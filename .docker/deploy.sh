#!/bin/bash -e

git pull
cd .docker
docker-compose up -d --build
