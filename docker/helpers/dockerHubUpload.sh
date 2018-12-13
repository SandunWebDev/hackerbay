#!/bin/bash

# Script used in Travis CI to Build Production Image and Upload it to docker hub with appopriate tags.

# Building Production Build Image & Loggin In.
if [ "$TRAVIS_BRANCH" == "master" ] ||  [ "$TRAVIS_BRANCH" == "release" ]
then
   echo "Production Docker Image Built Is Started.";
   docker-compose -f docker-compose.yml -f dc-production.yml build;
   docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";
else
   echo "Production Docker Image Built Is Skipped. (Because not a master or release branch build)";
fi

# Tagging with appopriate tags and push them into docker hub.
if [ "$TRAVIS_BRANCH" == "master" ]
then
  docker tag hb-backend-image-prod sandunwebdev/hb-backend-image-prod:master;

  docker push sandunwebdev/hb-backend-image-prod:master;
elif [ "$TRAVIS_BRANCH" == "release" ]
then
  docker tag hb-backend-image-prod sandunwebdev/hb-backend-image-prod:release;
  docker tag hb-backend-image-prod sandunwebdev/hb-backend-image-prod:latest;

  docker push sandunwebdev/hb-backend-image-prod:release;
  docker push sandunwebdev/hb-backend-image-prod:latest;
fi
