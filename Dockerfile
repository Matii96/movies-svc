FROM node:14.17-alpine AS movies-svc

WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install

COPY ./src ./test ./
RUN npm run build
RUN rm -rf src

CMD ["node", "."]