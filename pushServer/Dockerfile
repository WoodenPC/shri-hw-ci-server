FROM node:alpine
RUN apk update && apk upgrade && apk add bash && apk add inotify-tools && apk add --no-cache git
WORKDIR '/app'
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .

ENV NODE_ENV=production

CMD ["npm", "run", "start"]