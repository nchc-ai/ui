TAG = $(shell git rev-parse --short HEAD)


build-frontend-img-k8s:
	docker build -t ogre0403/twgc:ui-$(TAG) .
