# Build & Run the sample

## Build

1. Install [glide](https://github.com/Masterminds/glide)
2. `make install_deps`
3. `make build`
4. `make image`

## Run

### Outside cluster

Run `make run`

### inside Cluster

After push image to DockerHub, refer [Service account](./rbac.md#service-account)
to know rbac issue when pod access kubernetes api in cluster.