FROM node:16-alpine
WORKDIR /api
COPY . /api
RUN npm install
EXPOSE 7777
CMD npx sequelize-cli db:migrate && npm run develop