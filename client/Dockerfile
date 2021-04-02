# pull official base image
FROM node:14-alpine  as build

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY ./client/package.json ./
COPY ./client/yarn.lock ./
RUN yarn install

COPY ./client ./
RUN yarn build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html

#RUN rm /etc/nginx/conf.d/default.conf
#COPY ./nginx/nginx.cofig  /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
