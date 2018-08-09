COMMIT_HASH = $(shell git rev-parse --short HEAD)
RET = $(shell git describe --tags $(COMMIT_HASH) 1>&2 2> /dev/null; echo $$?)

ifeq ($(RET),0)
    TAG = $(shell git describe --tags $(COMMIT_HASH))
else
	TAG = $(COMMIT_HASH)
endif

install_deps:
	glide install

run-backend:
	rm -rf bin/*
	go build -o bin/app ./cmd
	./bin/app --conf=./conf/api-config.json

run-backend-docker:
	docker run -ti --rm  -p 38080:38080 ogre0403/twgc:api-$(TAG)

build-backend-img:
	docker build -t ogre0403/twgc:api-$(TAG) .


build-in-docker:
	rm -rf bin/*
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/app ./cmd


clean:
	rm -rf bin/*