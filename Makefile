COMMIT_HASH = $(shell git rev-parse --short HEAD)
RET = $(shell git describe --contains $(COMMIT_HASH) 1>&2 2> /dev/null; echo $$?)
USER = $(shell whoami)


ifeq ($(RET),0)
    TAG = $(shell git describe --contains $(COMMIT_HASH))
else
	TAG = $(USER)-$(COMMIT_HASH)
endif

build-frontend-img:
	docker build -t ogre0403/twgc:ui-$(TAG) .

run-ui-docker:
	docker run -ti --rm  -p 3010:3010  ogre0403/twgc:ui-$(TAG)
