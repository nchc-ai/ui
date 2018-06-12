FROM golang:1.9

WORKDIR /go/src/gitlab.com/nchc-ai/AI-Eduational-Platform/backend

RUN useradd -u 10001 kube-operator

RUN go get github.com/Masterminds/glide

COPY . .

RUN make install_deps
RUN make build-in-docker



FROM ubuntu:xenial
RUN apt-get update && apt-get -y install curl
RUN mkdir -p /etc/api-server

COPY --from=0 /go/src/gitlab.com/nchc-ai/AI-Eduational-Platform/backend/bin/app .
COPY --from=0 /go/src/gitlab.com/nchc-ai/AI-Eduational-Platform/backend/conf/api-config-docker.json /etc/api-server/api-config.json
COPY --from=0 /go/src/gitlab.com/nchc-ai/AI-Eduational-Platform/backend/conf/openstack-kubeconfig /etc/api-server
CMD ["/app"]