FROM node:alpine
RUN apk update && \
  apk upgrade && \
  apk add bash && \
  apk add inotify-tools && \
  apk add --no-cache git

WORKDIR '/app'

COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .

ENV NODE_ENV=production

RUN mkdir -p /home/repos && \
  adduser -S builder && \
  chmod 000 * && \
  chmod -R 777 /app && \
  chmod -R 777 /home/repos && \
  git config --global user.email "test-mail@mail.com" && \
  git config --global user.name "robot"

USER builder

CMD ["npm", "run", "start"]