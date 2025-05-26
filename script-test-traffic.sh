#!/bin/bash
# Ganti URL_APLIKASI dengan URL/service , bisa IP ClusterIP, atau DNS service

URL_APLIKASI="http://pena-app-my-nodejs-chart.default.svc.cluster.local"

while true
do
  curl -s $URL_APLIKASI > /dev/null
  sleep 0.1  # kirim 10 request per detik (1 request tiap 0.1 detik)
done

