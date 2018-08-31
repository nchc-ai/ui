# How to setup AI Platform

## 0. Prerequisite

1. Install a Kubernetes cluster

2. Install go-oauth-server, this can be done by either [kubernetes yaml](https://gitlab.com/nchc-ai/go-oauth2-server/tree/master/k8s-deploy#how-to-setup-go-oauth-server) files 
or [docker compose file](https://gitlab.com/nchc-ai/go-oauth2-server#docker-compose). 


## 1. Setup local development environment 

Launch  MySQL container run at localhost for local testing, 

```bash 
docker run --name MySQL --rm -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=ogre0403 mysql --default-authentication-plugin=mysql_native_password
```

Login into MySQL container and create database, 

```sql
CREATE DATABASE twgc;
CREATE USER 'twgc'@'localhost' IDENTIFIED BY 'twgc@NCHC';
CREATE USER 'twgc'@'%' IDENTIFIED BY 'twgc@NCHC';
GRANT ALL ON twgc.* TO 'twgc'@'localhost';
GRANT ALL ON twgc.* TO 'twgc'@'%';
```

### API Server

Modify api server configure file in `./conf/api-config-dev.json`, 
then launch api server with parameter `--conf=./conf/api-config-dev.json --logtostderr=true`

```json
{
  "api-server": {
    "isOutsideCluster": true,
    "port": 38080,
    "provider": {
      "type": "go-oauth",
      "name": "test-provider",
      "client_id": "test_client_1",
      "client_secret": "test_secret",
      "auth_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/web/authorize",
      "token_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/tokens",
      "refresh_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/tokens",
      "introspect_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/introspect",
      "logout_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/logout",
      "register_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/register",
      "update_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/update",
      "query_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/query",
      "redirect_url": "http://localhost:3010/user/course"
    }
  },
  "database": {
    "host": "127.0.0.1",
    "port": 3306,
    "username": "twgc",
    "password": "twgc@NCHC",
    "database": "twgc"
  },
  "kubernetes": {
    "kubeconfig": "./path/to/kubernetes/config",
    "expose_ip": "http://<kubernetes-ip>",
    "namespace": "default",
    "resourceLimit": {
      "cpu": "500m",
      "memory": "64Mi"
    },
    "expose_port": {
      "web": 80,
      "jupyter": 8888,
      "digitis": 5000,
      "ttyd": 7681
    }
  }
}
```

### UI 

Modify frontend configure file `./frontend/app/config/api.js`

```js
export const WEBSITE_URL = 'http://localhost:3010';
export const API_URL = 'http://localhost:38080';
export const AUTH_PROVIDER_URL = 'http://<go-oauth-server IP>:<go-oauth-server PORT>';
export const jobInterval = 10000;
export const pdfLink = 'https://drive.google.com/file/d/1MvfNxfLkBr4yvbxsJhh-D6PeaFsovNPl/view';
```

Use following commands to install nodejs dependencies and run. 

```bash
$ yarn install
$ yarn dev
```

Open `http://localhost:3010` in browser.
 
*Note: You `CAN'T` use `127.0.0.1`, or OAuth redirect will not work.*

 
## 2. Setup testing environment

Launch MySQL Deployment in kubernetes

```bash
$ kubectl create -f deploy/db-data-pvc.yaml
$ kubectl create -f deploy/mysql-deployment.yam;
```

### API Server

Modify ConfigMap in `api-server-deployment.yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: twgc-api-cm
data:
  api-conf: |-
    {
      "api-server": {
        "isOutsideCluster": false,
        "port": 38080,
        "provider": {
          "type": "go-oauth",
          "name": "test-provider",
          "client_id": "test_client_1",
          "client_secret": "test_secret",
          "auth_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/web/authorize",
          "token_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/tokens",
          "refresh_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/tokens",
          "introspect_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/introspect",
          "logout_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/logout",
          "register_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/register",
          "update_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/update",
          "query_url": "http://<go-oauth-server IP>:<go-oauth-server PORT>/v1/oauth/query",
          "redirect_url": "http://<kubernetes-ip>:30004/user/course"
        }
      },
      "database": {
        "host": "twgc-database-svc.default",
        "port": 3306,
        "username": "twgc",
        "password": "twgc@NCHC",
        "database": "twgc"
      },
      "kubernetes": {
        "kubeconfig": "/etc/api-server/openstack-kubeconfig",
        "expose_ip": "http://<kubernetes-ip>",
        "namespace": "default",
        "resourceLimit": {
         "cpu": "500m",
         "memory": "64Mi"
        },
        "expose_port": {
          "web": 80,
          "jupyter": 8888,
          "digitis": 5000,
          "ttyd": 7681
        }
      }
    }
```

```bash
$ kubectl create -f deploy/api-server-deployment.yaml
```


### UI 

Modify Service in `frontend-deployment.yaml`


```yaml
apiVersion: v1
kind: Service
metadata:
  name: twgc-ui
spec:
  type: NodePort
  ports:
    - port: 3010
      nodePort: 30004
  selector:
    tier: twgc-ui
```

Modify ConfigMap in `frontend-deployment.yaml`


```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: twgc-ui-cm
data:
  endpoint-conf: |-
    export const WEBSITE_URL = 'http://<kubernetes-ip>:30004';
    export const API_URL = '';
    export const AUTH_PROVIDER_URL = '<go-oauth-server IP>:<go-oauth-server PORT>';
    export const jobInterval = 60000;
    export const pdfLink = 'https://drive.google.com/file/d/1MvfNxfLkBr4yvbxsJhh-D6PeaFsovNPl/view';
```

```bash
$ kubectl create -f deploy/frontend-deployment.yaml
```

## 3. Setup in Production

Create TLS secret 

```bash
$ ./deploy/tls/create-ssl-secret.sh
```

Launch MySQL Deployment in kubernetes

```bash
$ kubectl create -f deploy/db-data-pvc.yaml
$ kubectl create -f deploy/mysql-deployment.yam;
```


### API Server

```bash
$ kubectl create -f deploy/api-server-deployment.yaml
```

### UI 

```bash
$ kubectl create -f deploy/frontend-deployment.yaml
```

### Ingress 

```bash
$ kubectl create -f deploy/ingress-ssl.yaml
```


