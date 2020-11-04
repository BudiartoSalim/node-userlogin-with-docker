FROM node:12.18.2

WORKDIR /var/www/dockerized-login-app

ENV PORT=3000
ENV JWT_SECRET=sadssasdq

COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
RUN npm install -g sequelize-cli

EXPOSE 3000
COPY . .
CMD ["npm", "run", "dev"]