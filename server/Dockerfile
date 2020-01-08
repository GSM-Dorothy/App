FROM node:lts-alpine

WORKDIR /app
ENV NODE_PATH ./

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD [ "node", "main.js" ]