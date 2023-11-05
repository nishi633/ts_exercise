FROM node:20

RUN apt-get update && apt-get install -y vim

# timezone setting
ENV TZ='Asia/Tokyo'
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /root
COPY ./node-app .

# Set Up
RUN npm install yarn && npm install typescript -g && yarn init -y
RUN yarn install
