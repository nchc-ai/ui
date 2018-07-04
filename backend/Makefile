TAG = $(shell git rev-parse --short HEAD)

install_deps:
	glide install

run-backend:
	rm -rf bin/*
	go build -o bin/app ./cmd
	./bin/app --conf=./conf/api-config.json

run-backend-docker:
	docker run -ti --rm  -p 38080:38080 ogre0403/twgc:api-$(TAG)

build-backend-img:
	echo $(TAG)
	docker build -t ogre0403/twgc:api-$(TAG) .

build-in-docker:
	rm -rf bin/*
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/app ./cmd

run-frontend:
	npm  --prefix frontend start

clean:
	rm -rf bin/*