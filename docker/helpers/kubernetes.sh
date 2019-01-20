# Simple script to create & upload docker image that used for kubernetes.
# Make sure already logged in using [docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";]

(docker-compose -f docker-compose.yml -f dc-production.yml build) && (docker tag hb-backend-image-prod sandunwebdev/hb-backend-image-prod:kubernetes) && (docker push sandunwebdev/hb-backend-image-prod:kubernetes)