FROM node:alpine

RUN apk update && \
  apk add bash && \
  apk add inotify-tools && \
  apk add --no-cache git

WORKDIR '/app'
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
EXPOSE 5000

RUN git config --global user.email "test-mail@mail.com" && \
  git config --global user.name "robot"

RUN npm run build
CMD ["npm", "run", "start"]