FROM node:14-alpine


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./api/package.json ./
COPY ./api/yarn.lock ./
RUN yarn install
COPY ./api/ ./
RUN yarn build


EXPOSE 8080

CMD ["yarn", "server"]