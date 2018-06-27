package api

import (
	"net/http"
	"fmt"

	"k8s.io/client-go/kubernetes"
	"github.com/spf13/viper"
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	apiv1 "k8s.io/api/core/v1"
	appsv1 "k8s.io/api/apps/v1"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	log "github.com/golang/glog"
	"github.com/jinzhu/gorm"
	"github.com/google/uuid"
	"k8s.io/apimachinery/pkg/api/resource"
)

var exposePort = map[string]int32{
	"web":     80,
	"jupyter": 8888,
	"digitis": 5000,
	"ssh":     22,
	"svc1":    6006,
	"svc2":    5566,
}

// todo: determine cpu & memory limit automatically, not hard code
var defaultResourceLimit = apiv1.ResourceList{
	apiv1.ResourceMemory: resource.MustParse("64Mi"),
	apiv1.ResourceCPU:    resource.MustParse("500m"),
}

const (
	//JobStatusCreated = "Created",
	//	JobStatusRunning = "Running",

)

func NewKClients(config *viper.Viper) (*kubernetes.Clientset, error) {

	kConfig, err := util.GetConfig(
		config.GetBool("api-server.isOutsideCluster"),
		config.GetString("kubernetes.kubeconfig"))

	if err != nil {
		log.Fatalf("create kubenetes config fail: %s", err.Error())
		return nil, err
	}

	clientset, err := kubernetes.NewForConfig(kConfig)
	if err != nil {
		log.Fatalf("create kubenetes client set fail: %s", err.Error())
		return nil, err
	}

	return clientset, nil
}

func (resourceClient *ResourceClient) checkK8s(c *gin.Context) {
	statusList := []model.Node{}
	nList, err := resourceClient.K8sClient.CoreV1().Nodes().List(metav1.ListOptions{})

	if err != nil {
		log.Errorf("List Node fail: %s", err.Error())
		util.RespondWithError(c, http.StatusInternalServerError, "List Node fail: %s", err.Error())
		return
	}

	for _, n := range nList.Items {
		a := n.Status.Conditions[len(n.Status.Conditions)-1]
		statusList = append(statusList, model.Node{
			Name:   n.Name,
			Status: a.Type,
		})
	}

	resp := model.HealthKubernetesResponse{
		Error:   false,
		Message: statusList,
	}

	c.JSON(http.StatusOK, resp)
}

func (resourceClient *ResourceClient) DeleteDeployments(deploymentList []string) {

}

func deleteDeployment(deployment string) {

}

func (resourceClient *ResourceClient) ListPVC(c *gin.Context) {

	var pvcNameList []string
	pvcs, err := resourceClient.K8sClient.CoreV1().PersistentVolumeClaims("default").List(metav1.ListOptions{})
	if err != nil {
		util.RespondWithError(c, http.StatusInternalServerError,
			"List Kubernetes default namespace PVC fail: %s", err.Error())
		return
	}

	for _, pvc := range pvcs.Items {
		pvcNameList = append(pvcNameList, pvc.Name)
	}

	c.JSON(http.StatusOK, model.DatasetsListResponse{
		Error:    false,
		Datasets: pvcNameList,
	})

}

func (resourceClient *ResourceClient) LaunchCourse(c *gin.Context) {

	var req model.LaunchCourseRequest
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}

	user := req.User
	if user == "" {
		log.Errorf("user field in request cannot be empty")
		util.RespondWithError(c, http.StatusBadRequest, "user field in request cannot be empty")
		return
	}

	provider, exist := c.Get("Provider")
	if !exist {
		log.Warning("Provider is not found in request context, set empty")
		provider = ""
	}

	//Step 1: retrive required information
	//	Step 1-1: find course object by course_id
	course := getCourseObject(resourceClient.DB, req.CourseId)
	if course == nil {
		log.Errorf("Query course id %s fail: %s", req.CourseId, err.Error())
		util.RespondWithError(c, http.StatusInternalServerError,
			"Query course id %s fail: %s", req.CourseId, err.Error())
		return
	}

	// 	Step 1-2: find dataset required by course
	datasets := getRequiredDataset(resourceClient.DB, req.CourseId)
	if datasets == nil {
		log.Errorf("Query course id %s required dataset fail: %s", req.CourseId, err.Error())
		util.RespondWithError(c, http.StatusInternalServerError,
			"Query course id %s required dataset fail: %s", req.CourseId, err.Error())
		return
	}

	// Step 2: create kubernetes resources
	// 	Step 2-1: create deployment
	deployment, err := createDeployment(resourceClient.K8sClient, course, datasets)

	if err != nil {
		errStrt := fmt.Sprintf("create deployment for course {id = %s} fail: %s", course.ID, err.Error())
		log.Errorf(errStrt)
		util.RespondWithError(c, http.StatusInternalServerError, errStrt)
		return
	}

	// 	Step 2-2: create service
	svc, err := createService(resourceClient.K8sClient, deployment.Name)
	if err != nil {
		//todo : rollback, need to delete deployment
		errStrt := fmt.Sprintf("create service for job {id = %s} fail: %s", deployment.Name, err.Error())
		log.Errorf(errStrt)
		util.RespondWithError(c, http.StatusInternalServerError, errStrt)
		return
	}

	// Step 3: update Job Table
	err = updateTable(resourceClient.DB, deployment, svc, course, user, provider.(string))
	if err != nil {
		//todo : rollback, need to delete svc and deployment
		errStrt := fmt.Sprintf("update Job Table for job {id = %s} fail: %s", deployment.Name, err.Error())
		log.Errorf(errStrt)
		util.RespondWithError(c, http.StatusInternalServerError, errStrt)
		return
	}

	c.JSON(http.StatusOK, model.LaunchCourseResponse{
		Error: false,
		Job: model.JobStatus{
			JobId:  deployment.Name,
			Status: "Created",
		},
	})

}

func getCourseObject(DB *gorm.DB, id string) *model.Course {
	course := model.Course{
		Model: model.Model{
			ID: id,
		},
	}
	err := DB.First(&course).Error

	if err != nil {
		log.Errorf("Query course id %s fail: %s", id, err.Error())
		return nil
	}
	return &course
}

func getRequiredDataset(DB *gorm.DB, id string) []string {

	dataset := model.Dataset{
		CourseID: id,
	}
	datasetResult := []model.Dataset{}
	err := DB.Where(&dataset).Find(&datasetResult).Error
	if err != nil {
		log.Errorf("Query course id %s required dataset fail: %s", id, err.Error())
		return nil
	}

	courseDataset := []string{}

	for _, s := range datasetResult {
		courseDataset = append(courseDataset, s.DatasetName)
	}

	return courseDataset
}

func createDeployment(clientset *kubernetes.Clientset, course *model.Course, datasets []string) (*appsv1.Deployment, error) {
	jobId := uuid.New().String()

	deploymentsClient := clientset.AppsV1().Deployments(apiv1.NamespaceDefault)

	volumes := []apiv1.Volume{}
	volumeMounts := []apiv1.VolumeMount{}
	for _, dataset := range datasets {
		// prepare volume array
		vol := apiv1.Volume{
			Name: dataset,
			VolumeSource: apiv1.VolumeSource{
				PersistentVolumeClaim: &apiv1.PersistentVolumeClaimVolumeSource{
					ReadOnly:  true,
					ClaimName: dataset,
				},
			},
		}
		volumes = append(volumes, vol)

		// prepare volumeMount array
		vm := apiv1.VolumeMount{
			Name:      dataset,
			MountPath: fmt.Sprintf("/tmp/%s", dataset),
		}
		volumeMounts = append(volumeMounts, vm)
	}

	// prepare expose port
	exposePorts := []apiv1.ContainerPort{}
	for _, p := range exposePort {
		cp := apiv1.ContainerPort{
			ContainerPort: p,
		}
		exposePorts = append(exposePorts, cp)
	}

	// default resource limit
	var resources apiv1.ResourceRequirements

	// if require GPU
	if course.Gpu > 0 {
		//defaultResourceLimit["nvidia.com/gpu"] = *resource.NewQuantity(int64(course.Gpu), resource.DecimalSI)
		defaultResourceLimit["nvidia.com/gpu"] = resource.MustParse(string(course.Gpu))
	}
	resources = apiv1.ResourceRequirements{
		Limits: defaultResourceLimit,
	}

	// prepare container Spec
	podSpec := apiv1.PodSpec{
		Containers: []apiv1.Container{
			{
				Name:         jobId,
				Image:        course.Image,
				Ports:        exposePorts,
				Resources:    resources,
				VolumeMounts: volumeMounts,
			},
		},
		Volumes: volumes,
	}

	// fill in deployment definition
	deployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name: jobId,
		},

		Spec: appsv1.DeploymentSpec{
			Replicas: util.Int32Ptr(1),

			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"job_Id": jobId,
				},
			},

			Template: apiv1.PodTemplateSpec{

				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"job_Id": jobId,
					},
				},

				Spec: podSpec,
			},
		},
	}

	result, err := deploymentsClient.Create(deployment)
	if err != nil {
		return nil, err
	}

	log.Infof("deployment {%s} is created", result.Name)
	return deployment, nil
}

func createService(clientset *kubernetes.Clientset, deploy_name string) (*apiv1.Service, error) {

	selector := make(map[string]string)
	selector["job_Id"] = deploy_name

	// svc name must consist of lower case alphanumeric characters or '-',
	// start with an alphabetic character, and end with an alphanumeric character
	svcName := util.SvcNameGen()

	var ports []apiv1.ServicePort

	for name, p := range exposePort {
		sp := apiv1.ServicePort{
			Name: name,
			Port: p,
			TargetPort: intstr.IntOrString{
				Type:   intstr.Int,
				IntVal: p,
			},
		}
		ports = append(ports, sp)
	}

	serviceClient := clientset.CoreV1().Services(apiv1.NamespaceDefault)
	service := &apiv1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name: svcName,
		},

		Spec: apiv1.ServiceSpec{
			Selector: selector,
			Type:     apiv1.ServiceTypeNodePort,
			Ports:    ports,
		},
	}

	result, err := serviceClient.Create(service)

	if err != nil {
		return nil, err
	}
	log.Infof("service {%s} is created", result.Name)
	return service, nil

}

func updateTable(DB *gorm.DB, deploy *appsv1.Deployment, svc *apiv1.Service,
	course *model.Course, user string, provider string) error {
	newJob := model.Job{
		Model: model.Model{
			ID: deploy.Name,
		},
		OauthUser: model.OauthUser{
			User:     user,
			Provider: provider,
		},
		CourseID:   course.ID,
		Deployment: deploy.Name,
		Service:    svc.Name,
		Status:     "Created",
	}

	err := DB.Create(&newJob).Error

	if err != nil {
		return nil
	}

	return nil
}

// check deployment is ready and set job status to running
func (resourceClient *ResourceClient) IsJobReady(c *gin.Context) {

}
