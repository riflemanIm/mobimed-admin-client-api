FROM node:13.12.0-alpine as build


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY yarn.lock ./
RUN yarn install
COPY . ./

EXPOSE 8080

CMD ["yarn", "build", "server"]