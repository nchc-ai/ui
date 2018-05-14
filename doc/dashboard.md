# Install dashboard with different Permission

## Install Dashboard

Install dashboard from mainfest. This mainfest use NodePort to expose dashboard Service. 

```sh
$ kubectl apply -f https://raw.githubusercontent.com/ogre0403/kubeasz/master/manifests/dashboard/kubernetes-dashboard.yaml
```

Then we can use the NodePort to access dashboard, and use token or kubeconfig to login. 

![](./dashboard-login.jpg)

> Note: According to dashboard issue [#2474](https://github.com/kubernetes/dashboard/issues/2474#issuecomment-348811806), if we want to use kubeconfig to login, the kubeconfig file MUST have token, user, and password field, otherwise there will be `Not enough data to create auth info structure` error. 

## Setup permission

Because dashboard [default role](https://github.com/ogre0403/kubeasz/tree/master/manifests/dashboard#L51) has very limited permission, 
we need use service account token to login to get higher permission. If we want to control user permission, we can generate 
different service account for different user with different permission.  

For example, if we want a user login dashboard and is restricted to manage resource in `cht-demo` namespace. We create a 
service account `demo-sa` first, and use RoleBinding to bind `demo-sa` to `admin` role in `cht-demo` namespace. 

This can be done by [CLI](#cli) or [manifest](#manifest): 

### CLI

```sh
kubectl create ns cht-demo
kubectl create sa demo-sa  -n cht-demo
kubectl create rolebinding demo-rolebinding --clusterrole=admin --serviceaccount=cht-demo:demo-sa  --namespace=cht-demo
```

### Manifest
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  namespace: cht-demo
  name: demo-sa
---

apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: demo-rolebinding
  namespace: cht-demo
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: admin
subjects:
- kind: ServiceAccount
  namespace: cht-demo
  name: demo-sa
```

## Get Service Account Token

Then we retrive token for `demo-sa` service account, and use this token to login. We can use `kubectl describe secret` 
or `kubectl get secret` to do this. 

```sh
# find content start with "token:"
$ kubectl -n=cht-demo describe  secret  `kubectl -n cht-demo get secret | grep demo-sa | awk '{print $1}'` | grep token:
token:      eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJjaHQtZGVtbyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJkZW1vLXNhLXRva2VuLXY3N3JkIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImRlbW8tc2EiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI4MDEwMmFiZi01NzRlLTExZTgtOGZkMi0wMDBjMjllNzgwNDMiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6Y2h0LWRlbW86ZGVtby1zYSJ9.UQbukkDbScSVXP2tC9rg9SJM6zIp3aVRD5KKUE0K5xz_6LM6WAKiY5G4pb-ISZxVVzFEjIFOmJ1GdWKa-vwbLarskDYjkNbsCYfSaCZl-RwLBuyf7MLVtjKzlRDOZd6BmQ24V5f30So-ZKMvTBn5wyGGYxxxrD4vP4p_L5bUY7ushdfDv52vFggAqLxrlmHe4pwOQSzx0wQdGX-6GDnDvEtY66jGXLWC3Y65nXPHFSuNBmGloZoAEWzKQxTthCVV0pGKGHJSUoLEWReRxUjhWjruqz5pyliB13XgIHm2ZfxK6xJFxPxCOY3vGtmgLu6W89-z27Z2yNBWqujVGCEM3A
```

```sh
# base64 decoded is required if token is get from `kubectl get secret`
$ kubectl -n=cht-demo get  secret  `kubectl -n cht-demo get secret | grep demo-sa | awk '{print $1}'` -o jsonpath={.data.token}   | base64 -d
yJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJjaHQtZGVtbyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJkZW1vLXNhLXRva2VuLXY3N3JkIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImRlbW8tc2EiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI4MDEwMmFiZi01NzRlLTExZTgtOGZkMi0wMDBjMjllNzgwNDMiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6Y2h0LWRlbW86ZGVtby1zYSJ9.UQbukkDbScSVXP2tC9rg9SJM6zIp3aVRD5KKUE0K5xz_6LM6WAKiY5G4pb-ISZxVVzFEjIFOmJ1GdWKa-vwbLarskDYjkNbsCYfSaCZl-RwLBuyf7MLVtjKzlRDOZd6BmQ24V5f30So-ZKMvTBn5wyGGYxxxrD4vP4p_L5bUY7ushdfDv52vFggAqLxrlmHe4pwOQSzx0wQdGX-6GDnDvEtY66jGXLWC3Y65nXPHFSuNBmGloZoAEWzKQxTthCVV0pGKGHJSUoLEWReRxUjhWjruqz5pyliB13XgIHm2ZfxK6xJFxPxCOY3vGtmgLu6W89-z27Z2yNBWqujVGCEM3A
```
