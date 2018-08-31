#!/usr/bin/env bash

kubectl create secret tls nchc-tls-secret --key ./nchc-ssl.key --cert ./chain.cert
