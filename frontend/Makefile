TAG = $(shell git rev-parse --short HEAD)


build-frontend-img:
	rm -rf node_modules
	docker build -t ogre0403/twgc:ui-$(TAG) .
