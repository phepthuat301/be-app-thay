FROM node:16.14.0-alpine

WORKDIR /app

COPY ./package.json .

RUN yarn install

COPY . .

RUN chmod +x scripts/*.sh

RUN yarn build

EXPOSE 4000

CMD [ "npm", "run", "dev" ]