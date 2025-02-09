# Use an official Node.js runtime as a parent image
FROM node:20
# Set the working directory in the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install dependencies
RUN npm ci
# Install app dependencies
RUN npm install pm2@latest-g
# Bundle app source
COPY . .
# Expose the port your app runs on
EXPOSE 5050
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY=bnrsg5qx9f5not4
ENV PM2_SECRET_KEY=5vxev8rkvohxflv
# Define the command to run your app test test
CMD [ "pm2-runtime", "ecosystem.config.js" ]