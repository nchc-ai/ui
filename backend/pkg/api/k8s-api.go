package api

import (
	"net/http"

	"k8s.io/client-go/kubernetes"
	"github.com/spf13/viper"
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	apiv1 "k8s.io/api/core/v1"

	appsv1 "k8s.io/api/apps/v1"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	log "github.com/golang/glog"
	"github.com/jinzhu/gorm"
	"fmt"
	"github.com/google/uuid"
	"k8s.io/apimachinery/pkg/api/resource"
)

var exposePort = []int32{
	80, 8888, 5000, 22, 6006, 5566,
}

var limit = apiv1.ResourceList{
	apiv1.ResourceMemory: resource.MustParse("64Mi"),
	apiv1.ResourceCPU:    resource.MustParse("500m"),
}

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

		return
	}

	// 	Step 2-2: create service
	_, err = createService(resourceClient.K8sClient, deployment.Name)

	if err != nil {

		return
	}

	// Step 3: update Job Table
	// Step 4: update proxy table
	err = updateTable(resourceClient.DB)
	if err != nil {

		return
	}

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
		limit["nvidia.com/gpu"] = *resource.NewQuantity(1, resource.DecimalSI)
	}
	resources = apiv1.ResourceRequirements{
		Limits: limit,
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

func createService(clientset *kubernetes.Clientset, dname string) (*apiv1.Service, error) {
	serviceClient := clientset.CoreV1().Services(apiv1.NamespaceDefault)
	service := &apiv1.Service{}

	result, err := serviceClient.Create(service)

	if err != nil {
		return nil, err
	}
	log.Infof("service {%s} is created", result.Name)
	return service, nil

}

func updateTable(DB *gorm.DB) error {
	return nil
}

func (resourceClient *ResourceClient) IsJobReady(c *gin.Context) {
}
