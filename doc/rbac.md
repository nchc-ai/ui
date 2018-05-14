# Setup RBAC

## Kubectl user permission

 **Goal :**

 We create a `cht` user and a corresponding kubeconfig. User permission is restricted in `cht-demo` namespace.

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

**Goal :**

We create a deployment in `cht-demo` namespace, and permission is restricted in `cht-demo` namespace.

### No ServiceAccount

Because RBAC enabled cluster use default service account for pod, pod can not access any kubernetes api.

```sh
$ kubectl create -f deployment-no-rbac.yaml

$ k logs demo-78998b6cdb-bn2zc                                                                                                                     (kubernetes/cht-demo)
panic: pods is forbidden: User "system:serviceaccount:cht-demo:default" cannot list pods in the namespace "cht-demo"
```

We have two options to make pod can access kubernetes api:

1. Grant permission to `default` service account

2. Grant Permission to an application-specific service account  (best practice)

### Grant Permission to default service account

We bind default ClusterRole "edit" to `default` service account, and only grants permissions within the "cht-demo" namespace.
Because we use default ClusterRole "edit", we don't need to create ClusterRole manually.

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: demo-rolebinding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: edit
subjects:
- kind: ServiceAccount
  namespace: cht-demo
  name: default
```

If `serviceAccountName` is not defined in Pod template, `default` service account is used by default.

We can see demo pod with `default` service account is restricted in `cht-demo` namespace, and is forbidden in `default` namespace.

```sh
$ kubectl create -f deployment-default-sa.yaml

$k logs demo-78998b6cdb-cxpw7                                                                                                                     (kubernetes/cht-demo)
There are 3 pods in the cluster
Error getting pod pods "example-xxxxx" is forbidden: User "system:serviceaccount:cht-demo:default" cannot get pods in the namespace "default"
```

### Grant Permission to an application-specific service account  (best practice)


Create `demo-sa` service account

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: demo-sa
```


We bind default ClusterRole "edit" to service account `demo-sa`, and only grants permissions within the "cht-demo" namespace.
Because we use default ClusterRole "edit", we don't need to create ClusterRole manually.

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: demo-rolebinding
  namespace: cht-demo
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: edit
subjects:
- kind: ServiceAccount
  namespace: cht-demo
  name: demo-sa
```

Then, use `demo-sa` service account in Pod template:

```yaml
...
    spec:
      serviceAccountName: demo-sa
      containers:
      - name: demo
        image: ogre0403/in-cluster:cht
        imagePullPolicy: Always
...
```


We can see demo pod with `demo-sa` service account is restricted in `cht-demo` namespace, and is forbidden in `default` namespace.

```sh
$ kubectl create -f deployment-app-sa.yaml

$k logs demo-7447445996-ksljq                                                                                                                     (kubernetes/cht-demo)
There are 3 pods in the cluster
Error getting pod pods "example-xxxxx" is forbidden: User "system:serviceaccount:cht-demo:demo-sa" cannot get pods in the namespace "default"
```



## Reference
1. [使用 RBAC 控制 kubectl 權限](https://mritd.me/2018/03/20/use-rbac-to-control-kubectl-permissions/)
2. [Using RBAC Authorization](https://kubernetes.io/docs/admin/authorization/rbac/#)
3. [配置對多集群的訪問](https://kubernetes.io/cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)