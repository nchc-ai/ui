COMMIT_HASH = $(shell git rev-parse --short HEAD)
BRANCH_NAME = $(shell git rev-parse --abbrev-ref HEAD)
RET = $(shell git describe --contains $(COMMIT_HASH) 1>&2 2> /dev/null; echo $$?)
USER = $(shell whoami)
IS_DIRTY_CONDITION = $(shell git diff-index --name-status HEAD | wc -l)

REPO = ghcr.io/nchc-ai
IMAGE = ui

ifeq ($(strip $(IS_DIRTY_CONDITION)), 0)
	# if clean,  IS_DIRTY tag is not required
	IS_DIRTY = $(shell echo "")
else
	# add dirty tag if repo is modified
	IS_DIRTY = $(shell echo "-dirty")
endif

# Image Tag rule
# 1. Use git tag if we found
# 2. if repo in a master branch, use <username>-<commit-hash>
# 3. if repo in non-master branch, use branch name as image tag
ifeq ($(RET),0)
    TAG = $(shell git describe --contains $(COMMIT_HASH))$(IS_DIRTY)
else
	ifeq ($(BRANCH_NAME), master)
		TAG = $(USER)-$(COMMIT_HASH)$(IS_DIRTY)
	else
		TAG = $(BRANCH_NAME)$(IS_DIRTY)
	endif
endif




build-frontend-img:
	docker build -t $(REPO)/$(IMAGE):$(TAG) .

run-ui-docker:
	docker run -ti --rm  -p 3010:3010  $(REPO)/$(IMAGE):$(TAG)

run-inside-container:
	docker run --name UI -ti -p 3010:3010 -v `pwd`:/src/gitlab.com/nchc-ai/aitrain-ui node:10.5.0 sh || docker start UI; docker exec -ti UI sh

