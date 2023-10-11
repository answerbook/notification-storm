FROM alpine:3.18.4

RUN apk add --update nodejs npm
RUN addgroup -S mezmo && adduser -S mezmo -G mezmo

USER mezmo
WORKDIR /home/mezmo

copy lib ./lib
COPY index.js ./index.js
COPY package.json ./package.json
COPY env ./env

RUN npm i

ENTRYPOINT ["npm", "run", "start"]