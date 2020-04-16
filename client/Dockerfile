FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start-server:prod"]

#FROM nginx
#EXPOSE 3000
#COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
#COPY --from=builder /app/build /usr/share/nginx/html