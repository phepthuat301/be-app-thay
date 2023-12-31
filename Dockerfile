FROM node:16.14.0-alpine

WORKDIR /app

COPY ./package.json .

RUN npm install && npm cache clean --force

COPY . .

RUN chmod +x scripts/*.sh

RUN npm run build

EXPOSE 4000

CMD [ "npm", "run", "dev" ]