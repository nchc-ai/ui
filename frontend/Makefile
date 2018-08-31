COMMIT_HASH = $(shell git rev-parse --short HEAD)
RET = $(shell git describe --tags $(COMMIT_HASH) 1>&2 2> /dev/null; echo $$?)

ifeq ($(RET),0)
    TAG = $(shell git describe --tags $(COMMIT_HASH))
else
	TAG = $(COMMIT_HASH)
endif

build-frontend-img:
	rm -rf node_modules
	docker build -t ogre0403/twgc:ui-$(TAG) .
