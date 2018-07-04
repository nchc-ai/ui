package api

import (
	"k8s.io/client-go/kubernetes"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	apiv1 "k8s.io/api/core/v1"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"fmt"
	log "github.com/golang/glog"

	appsv1 "k8s.io/api/apps/v1"
	"github.com/jinzhu/gorm"
	"github.com/google/uuid"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	"k8s.io/apimachinery/pkg/util/intstr"

	"k8s.io/apimachinery/pkg/api/resource"
)

func findServiceNodePort(K8sClient *kubernetes.Clientset, job model.Job, exposeip string) ([]model.LabelValue, error) {

	result := []model.LabelValue{}

	svcClient := K8sClient.CoreV1().Services(apiv1.NamespaceDefault)
	svc, err := svcClient.Get(job.Service, metav1.GetOptions{})

	if err != nil {
		log.Errorf("Get service {%s} fail: %s", job.Service, err.Error())
		return nil, err
	}

	for _, p := range svc.Spec.Ports {
		lv := model.LabelValue{
			Label: p.Name,
			Value: fmt.Sprintf("%s:%d", exposeip, p.NodePort),
		}
		result = append(result, lv)
	}
	return result, nil
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
		defaultResourceLimit["nvidia.com/gpu"] = *resource.NewQuantity(int64(course.Gpu), resource.DecimalSI)
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
		CourseID: course.ID,
		//Deployment: deploy.Name,
		Service: svc.Name,
		Status:  JoBStatusCreated,
	}

	err := DB.Create(&newJob).Error

	if err != nil {
		return nil
	}

	return nil
}

func findCourse(DB *gorm.DB, job model.Job) (*model.Course, error) {

	course := model.Course{
		Model: model.Model{
			ID: job.CourseID,
		},
	}
	err := DB.Where(&course).Find(&course).Error
	if err != nil {
		log.Errorf("Query courses table fail: %s", err.Error())
		return nil, err
	}

	dataset := model.Dataset{
		CourseID: job.CourseID,
	}
	datasetResult := []model.Dataset{}
	err = DB.Where(&dataset).Find(&datasetResult).Error
	if err != nil {
		log.Errorf("Query datasets table fail: %s", err.Error())
		return nil, err
	}

	courseDataset := []string{}

	for _, s := range datasetResult {
		courseDataset = append(courseDataset, s.DatasetName)
	}

	return &model.Course{
		Model: model.Model{
			ID:        course.ID,
			CreatedAt: course.CreatedAt,
		},
		Name:         course.Name,
		Introduction: course.Introduction,
		Image:        course.Image,
		Level:        course.Level,
		Gpu:          course.Gpu,
		Datasets:     courseDataset,
	}, nil
}

func deleteDeployment(clientset *kubernetes.Clientset, deployment string) error {
	deploymentsClient := clientset.AppsV1().Deployments(apiv1.NamespaceDefault)
	deletePolicy := metav1.DeletePropagationForeground
	if err := deploymentsClient.Delete(deployment, &metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,}); err != nil {
		return err
	}
	return nil
}

func deleteService(clientset *kubernetes.Clientset, svc string) error {
	serviceClient := clientset.CoreV1().Services(apiv1.NamespaceDefault)
	deletePolicy := metav1.DeletePropagationForeground
	if err := serviceClient.Delete(svc, &metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,}); err != nil {
		return err
	}
	return nil
}

func queryCourse(DB *gorm.DB, query interface{}, args ...interface{}) ([]model.Course, error) {
	// query course based on course condition
	results := []model.Course{}

	if err := DB.Where(query, args).Find(&results).Error; err != nil {
		log.Errorf("Query courses table fail: %s", err.Error())
		return nil, err
	}

	resp := []model.Course{}

	for _, result := range results {

		dataset := model.Dataset{
			CourseID: result.ID,
		}
		datasetResult := []model.Dataset{}
		if err := DB.Where(&dataset).Find(&datasetResult).Error; err != nil {
			log.Errorf("Query datasets table fail: %s", err.Error())
			return nil, err
		}

		courseDataset := []string{}

		for _, s := range datasetResult {
			courseDataset = append(courseDataset, s.DatasetName)
		}

		resp = append(resp, model.Course{
			Model: model.Model{
				ID:        result.ID,
				CreatedAt: result.CreatedAt,
			},
			Name:         result.Name,
			Introduction: result.Introduction,
			Image:        result.Image,
			Level:        result.Level,
			Gpu:          result.Gpu,
			Datasets:     courseDataset,
		})
	}

	return resp, nil
}
