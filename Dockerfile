# build environment
FROM node:lts-alpine as build

# make the 'app' folder the current working directory
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# copy both 'package.json' and 'yarn.lock' (if available)
COPY package.json /app/
COPY yarn.lock /app/

# install project dependencies
RUN yarn install

COPY . /app

# build app for production with minification
RUN yarn build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build  /app/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
