#!/bin/bash

if [ "$TRAVIS_BRANCH" == "master" ] ||  [ "$TRAVIS_BRANCH" == "release" ]
then
   docker-compose -f docker-compose.yml -f dc-production.yml build;
   echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin;
fi

if [ "$TRAVIS_BRANCH" == "master" ]
then
  docker tag hb-backend-image-prod sandunwebdev/hb-backend-image-prod:master;

  docker push sandunwebdev/hb-backend-image-prod:master;
elif [ "$TRAVIS_BRANCH" == "release" ]
then
  docker tag hb-backend-image-prod sandunwebdev/hb-backend-image-prod:release;
  docker tag hb-backend-image-prod sandunwebdev/hb-backend-image-prod:latest;

  docker push sandunwebdev/hb-backend-image-prod:master;
  docker push sandunwebdev/hb-backend-image-prod:latest;
fi
