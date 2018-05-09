# Setup RBAC

## Kubectl user permission

Goal: We create a `cht` user and a corresponding kubeconfig. User permission is restricted in `cht-demo` namespace.

### Create user

Create user json file `cht.json`. 
> Note: CN is for the username and O for the group.

```json
{
  "CN": "cht",
  "hosts": [],
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [{
    "C": "TW",
    "ST": "TPE",
    "L": "TPE",
    "O": "cht-group",
    "OU": "develop"
  }]
}
```

Create certification from `cht.json`. We will get `cht.csr`, `cht-key.pem`, and `cht.pem`

```sh
$ cfssl gencert \
   --ca /etc/kubernetes/ssl/ca.pem \
   --ca-key /etc/kubernetes/ssl/ca-key.pem \
   --config /etc/kubernetes/ssl/ca-config.json \
   --profile kubernetes cht.json | \
   cfssljson --bare cht

$ ls 
total 16
-rw-r--r-- 1 root root  964 May  9 13:40 cht.csr
-rw-r--r-- 1 root root  174 May  9 13:37 cht.json
-rw------- 1 root root 1675 May  9 13:40 cht-key.pem
-rw-r--r-- 1 root root 1350 May  9 13:40 cht.pem
```

### Create kubeconfig

```sh
KUBE_API_SERVER="https://172.16.0.8:6443"
CERT_DIR=${2:-"/etc/kubernetes/ssl"}

# add cluster details to your configuration file
kubectl config set-cluster default-cluster \
--server=${KUBE_API_SERVER} \
--certificate-authority=${CERT_DIR}/ca.pem \
--embed-certs=true \
--kubeconfig=cht.kubeconfig

# Add user details to your configuration file
kubectl config set-credentials cht \
--certificate-authority=${CERT_DIR}/-ca.pem \
--embed-certs=true \
--client-key=cht-key.pem \
--client-certificate=cht.pem \
--kubeconfig=cht.kubeconfig

# Add context details to your configuration file
kubectl config set-context cht-demo-ctx \
--cluster=default-cluster \
--user=cht \
--namespace=cht-demo \
--kubeconfig=cht.kubeconfig

kubectl config use-context cht-demo-ctx \
--kubeconfig=cht.kubeconfig
```

### Create ClusterRoleBinding

kubectl create ns cht-demo

We use a `RoleBinding` to  reference a default `ClusterRole` `"edit"`, and only grants permissions within the "cht-demo" namespace. 
Becasue we use default `ClusterRole` `"edit"`, we don't need to create `ClusterRole` manually.

`cht-binding.yaml`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: cht-demo-rolebinding
  namespace: cht-demo
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: edit
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: cht
```

```sh
$ kubectl create -f cht-binding.yaml
```

### Verify 

We use `--kubeconfig` to use created cht.kubeconfig, and verify that "default" namespace is not accessible. 

```sh
$ kubectl --kubeconfig=./cht.kubeconfig get pod -n=default
Error from server (Forbidden): pods is forbidden: User "cht" cannot list pods in the namespace "default"
```

## Service Account


## Reference
1. [使用 RBAC 控制 kubectl 權限](https://mritd.me/2018/03/20/use-rbac-to-control-kubectl-permissions/)
2. [Using RBAC Authorization](https://kubernetes.io/docs/admin/authorization/rbac/#)
3. [配置對多集群的訪問](https://kubernetes.io/cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)