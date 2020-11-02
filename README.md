# node-userlogin-with-docker

this is a practice aimed at:
- Creating a simple but polished user register/login backend system
- Practicing Test Driven Development
- Contain the node app using Docker

Current plan:
1. create base models and hooks for the user creation //done
2. create test cases //in progress
3. create routes and controller
4. create middleware for auth
5. create error handler middleware
6. adjust output to match test cases written
7. dockerize the application

Reminder notes:

commands:
- npm run dev //running the app for development environment, for manual test
- npm run test //running the jest/supertest script for unit testing

CARA GANTI NODE_ENV BUAT UNIT TESTING DI WINDOWS POWERSHELL:

- $env:NODE_ENV="test" //change NODE_ENV ke test environment (biar sequelize pakai test env config ketika npm run test)
- $env:NODE_ENV="development" //chnage NODE_ENV ke development environment (biasa pakai ini buat manual tests)
- $env:NODE_ENV //check current NODE_ENV

cara lain, bikin file ".sequelizerc"

isinya:
module.exports = { 
  env: 'test'
}

DO NOT FORGET TO RUN "npx sequelize-cli db:create" and "npx sequelize-cli db:migrate" to generate the database and table first for test and/or development NODE_ENV depending on which one you're going to run.