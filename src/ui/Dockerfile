FROM node:16.9.0 as build-stage

WORKDIR /app

COPY ui/package.*json ./
COPY ui/yarn.lock ./

RUN yarn install
COPY ui ./
RUN yarn build


FROM nginx:1.21.3 as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY --from=build-stage /app/vhosts.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]