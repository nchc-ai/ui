install_deps:
	glide install

run-backend:
	rm -rf bin/*
	go build -o bin/app ./cmd
	./bin/app --conf=./conf/api-config.json

run-backend-docker:
	docker run -ti --rm  -p 38080:38080 ogre0403/twgc:local

build-backend-img:
	docker build -t ogre0403/twgc:local -f Dockerfiles/Dockerfile .

build-backend-img-k8s:
	docker build -t ogre0403/twgc:k8s -f Dockerfiles/Dockerfile-k8s .

build-in-docker:
	rm -rf bin/*
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/app ./cmd


clean:
	rm -rf bin/*