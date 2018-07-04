#!/usr/bin/env bash


while true
do
    date 
    curl -H "Authorization: Bearer 79838319-091b-4af7-8874-6e515b97fa9c" http://140.110.5.22:30003/v1/datasets/
    echo "\n"
    sleep 60
done
