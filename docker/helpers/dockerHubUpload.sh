#!/bin/bash

# Script used in Travis CI to Build Production Image and Upload it to docker hub with appopriate tags.

if [ "$TRAVIS_BRANCH" == "master" ] ||  [ "$TRAVIS_BRANCH" == "docker-test" ]
then
   docker-compose -f docker-compose.yml -f dc-production.yml build;
   docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";
fi

if [ "$TRAVIS_BRANCH" == "master" ]
then
  docker tag hb-backend-image-prod sandunwebdev/hb-backend-image-prod:master;

  docker push sandunwebdev/hb-backend-image-prod:master;
elif [ "$TRAVIS_BRANCH" == "docker-test" ]
then
  docker tag hb-backend-image-prod sandunwebdev/hb-backend-image-prod:release;
  docker tag hb-backend-image-prod sandunwebdev/hb-backend-image-prod:latest;

  docker push sandunwebdev/hb-backend-image-prod:release;
  docker push sandunwebdev/hb-backend-image-prod:latest;
fi
