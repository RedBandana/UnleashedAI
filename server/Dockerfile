#https://github.com/docker/welcome-to-docker/blob/main/Dockerfile

# Start your image with a node base image
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

COPY . ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]


# https://stackabuse.com/deploying-node-js-apps-to-aws-ec2-with-docker/

# CMD to build the image: docker build -t gpt-unleashed-server .

# To push the img in docker hub (to access remotely)
# $ docker login # Use your Docker Hub credentials here
# $ docker tag gpt-unleashed-server <YOUR_DOCKER_USERNAME>/gpt-unleashed-server
# $ docker push <YOUR_DOCKER_USERNAME>/gpt-unleashed-server

# Once pushed, to update the docker image in the virtual machine:
# $ docker pull <YOUR_DOCKER_USERNAME>/rate-it-server

# Note: If a previous version of the image was running, do this before pulling:
# $ docker ps (# It give a list of container and their ids)
# $ docker container stop <CONTAINER_ID> (# stop the container)

# to run on free ECS instance: 
# $ docker run --memory="300mb" -p 3000:3000 <YOUR_DOCKER_USERNAME>/gpt-unleashed-server

# to run headlessly (so continue to run even when the instance console is closed):
# $ docker run --memory="300mb" -d -p 3000:3000 <YOUR_DOCKER_USERNAME>/gpt-unleashed-server

# note --memory="300mb" is optional
