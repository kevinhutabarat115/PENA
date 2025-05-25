# Run Cluster Minikube
minikube start

# Build Image nodejs
docker build -t kevinpolin/technial-test-pena:v3 .
docker push kevinpolin/technial-test-pena:v3

# Build Image ngrock base on V 3.18
docker build -t kevinpolin/ngrok-pena:v2 -f Dockerfile.ngrok .
docker push kevinpolin/ngrok-pena:v2

# Local CLI
cd "/mnt/d/Techinal Test/PENA_TEAM"

# Build Image using Dockerfile


# Deploy App Node JS using Helm
helm install pena-app ./helm-chart --namespace default -f ./helm-chart/values.yaml
helm upgrade pena-app ./helm-chart --namespace default -f ./helm-chart/values.yaml


# Deploy Tools Monitoring using helm:
# Elasticsearch
cd ./infra-helm/elasticsearch
helm repo add elastic https://helm.elastic.com
helm dependency build
helm install elasticsearch ./infra-helm/elasticsearch -f ./infra-helm/elasticsearch/elasticsearch-values.yaml
helm upgrade elasticsearch ./infra-helm/elasticsearch -f ./infra-helm/elasticsearch/elasticsearch-values.yaml

# Troubleshoot pod 0/1 running elasticsearch
delete pvc elasticsearch and the pod
minikube ssh
ls -ld /tmp/hostpath-provisioner/default/elasticsearch-master-elasticsearch-master-0
sudo chown -R 1000:1000 /tmp/hostpath-provisioner/default/elasticsearch-master-elasticsearch-master-0

# reset paasword
bin/elasticsearch-reset-password -u elastic --force --url https://elasticsearch-master.default.svc:9200
helm upgrade elasticsearch elastic/elasticsearch \
  --set master.podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution="[]"
helm upgrade elasticsearch elastic/elasticsearch --set master.replicas=1



# Fluentd
cd ./infra-helm/fluentd
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-fluentd bitnami/fluentd --version 7.1.5 -f values.yaml

helm install fluentd .
# Makesure fluend working
kubectl get all -l "app.kubernetes.io/name=fluentd,app.kubernetes.io/instance=pena-fluent"

# cek semua log fluend
kubectl logs -l "app.kubernetes.io/component=aggregator"

# Kibana
cd ./infra-helm/kibana
helm repo add elastic https://helm.elastic.co
helm install kibana ./infra-helm/kibana -f ./infra-helm/kibana/values.yaml
helm upgrade kibana ./infra-helm/kibana -f ./infra-helm/kibana/values.yaml
# Credential kibana
Username: elastic
Password: rzf2lu8V6uYmopq


# Prometheus
cd ./infra-helm/prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus ./infra-helm/prometheus-grafana -f ./infra-helm/prometheus-grafana/prometheus-grafana-values.yaml
helm upgrade prometheus ./infra-helm/prometheus-grafana -f ./infra-helm/prometheus-grafana/prometheus-grafana-values.yaml


# Grafana
untuk dashboard grafana keinstall dari prometheus



# List Query Metrick di all resource k8s untuk di query di promoteus
http://localhost:8081/metrics

# KEDA
cd ./infra-helm/keda
helm repo add kedacore https://kedacore.github.io/charts
helm repo update
helm dependency update
helm dependency build
helm install keda .
# command upgrade jika ada changes di values
helm upgrade keda . -f values.yaml --namespace keda

# Metric-Server
# Install metric-serve karena helm-chart sudah di download manual ke lokal
helm install metrics-server ./metrics-server-3.12.2.tgz -n kube-system --create-namespace -f values.yaml



# Cek semua release-name ke deploy
helm list -A

# Cek Pod
kubectl get pod -A

# Akses Service
minikube service -n default pena-app

# Akses Grafana
minikube service grafana

# Cara Re-Install Release Name pake helm
contoh uninstall kibana.
kubectl delete all,job,cronjob,pvc,configmap,secret,serviceaccount,role,rolebinding -n default -l release=kibana
kubectl delete clusterrole,clusterrolebinding -l release=kibana
helm uninstall kibana




# Enable inggress using helm
cd "/mnt/d/Techinal Test/PENA_TEAM"
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm pull ingress-nginx/ingress-nginx --untar --untardir=infra-helm/
helm install ingress-nginx ./infra-helm/ingress-nginx --namespace ingress-nginx --create-namespace
\
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.extraVolumeMounts[0].name=nginx-tmp \
  --set controller.extraVolumeMounts[0].mountPath=/tmp/nginx \
  --set controller.extraVolumes[0].name=nginx-tmp \
  --set controller.extraVolumes[0].emptyDir={}
helm upgrade ingress-nginx ./infra-helm/ingress-nginx -n ingress-nginx -f ./infra-helm/ingress-nginx/values.yaml


# Enable Ngrok for public access 
helm install ngrok ./infra-helm/ngrok -n ngrok --namespace ngrok --create-namespace
  helm upgrade ngrok ./infra-helm/ngrok -n ngrok -f ./infra-helm/ngrok/ngrok-values.yaml



