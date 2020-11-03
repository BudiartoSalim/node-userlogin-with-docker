require('dotenv').config();
const { beforeAll, afterAll, expect } = require('@jest/globals');
const request = require('supertest');
const app = require('../app.js');
const { User } = require('../models/index.js');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const tokenExpiration = "1h";
let correctuser_token;
let wronguser_token;
let expired_token;
let longstring = "";

const startingData = [
  {
    email: "correct@mail.com",
    username: "correctuser",
    password: "correct"
  },
  {
    email: "wrong@mail.com",
    username: "wronguser",
    password: "wrong"
  }
]

describe('==User Path Test==', () => {
  beforeAll(async (done) => {
    try {
      const seed = await User.bulkCreate(startingData, {})
      let correctUser = User.findOne({
        where: { email: startingData[0].email },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
      });
      let wrongUser = User.findOne({
        where: { email: startingData[1].email },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
      });

      //running this loop 5x to generate 50 characters long string
      for (let i = 0; i < 5; i++) {
        longstring += "1234567890";
      }

      correctUser = await correctUser;
      correctuser_token = jwt.sign(
        { id: correctUser.id, username: correctUser.username }, JWT_SECRET,
        { expiresIn: tokenExpiration }
      );

      expired_token = jwt.sign(
        { id: correctUser.id, username: correctUser.username }, JWT_SECRET,
        { expiresIn: 0 }
      )

      wrongUser = await wrongUser;
      wronguser_token = jwt.sign(
        { id: correctUser.id, username: wrongUser.username }, JWT_SECRET,
        { expiresIn: tokenExpiration }
      );

      done();
    } catch (err) {
      done(err);
    }
  })

  afterAll(async (done) => {
    try {
      await User.destroy({ where: {}, truncate: true });
      done();
    } catch {
      done(err);
    }
  })

  describe('Successful register test', () => {
    test('Should give proper response when successfully registered.', (done) => {
      request(app)
        .post('/user/register')
        .send({
          email: "registertest@mail.com",
          username: longstring,
          password: longstring
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe(`User ${longstring} successfully registered!`);
            done();
          }
        })
    })
  })

  describe('Fail register test', () => {
    test('Email should be unique check.', (done) => {
      request(app)
        .post('/user/register')
        .send({
          email: startingData[1].email,
          username: "registertester",
          password: "registersuccesstest"
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Email is unavailable.');
            done();
          }
        })
    })

    test('Email must be in email format.', (done) => {
      request(app)
        .post('/user/register')
        .send({
          email: "inibukanemaillho",
          username: "testbukanemail",
          password: "registersuccesstest"
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Email must be in email format.');
            done();
          }
        })
    })

    test('Email must not be empty.', (done) => {
      request(app)
        .post('/user/register')
        .send({
          username: "testbukanemail",
          password: "registersuccesstest"
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Email cannot be empty.');
            done();
          }
        })
    })

    test('Username should be unique check.', (done) => {
      request(app)
        .post('/user/register')
        .send({
          email: "belumdidaftarin@mail.com",
          username: startingData[1].username,
          password: "registersuccesstest"
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            console.log(res.body)
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Username is unavailable.');
            done();
          }
        })
    })

    test('Password cannot be longer than 50 characters long.', (done) => {
      request(app)
        .post('/user/register')
        .send({
          email: "belumdidaftar@mail.com",
          username: "registertester",
          password: longstring + 'a'
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Password must be between 4 - 50 characters long.');
            done();
          }
        })
    })
    test('Password cannot shorter than 4 characters long.', (done) => {
      request(app)
        .post('/user/register')
        .send({
          email: "belumdidaftar2@mail.com",
          username: "registertester",
          password: 'abc'
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Password must be between 4 - 50 characters long.');
            done();
          }
        })
    })

    test('Password cannot be empty.', (done) => {
      request(app)
        .post('/user/register')
        .send({
          email: "belumdidaftar@mail.com",
          username: "registertester"
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Password must be between 4 - 50 characters long.');
            done();
          }
        })
    })

    test('Username cannot be longer than 50 characters long.', (done) => {
      request(app)
        .post('/user/register')
        .send({
          email: "belomdidaftarjuga@mail.com",
          username: longstring + "a",
          password: "registerfailtest"
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Username must be between 4 - 50 characters long.');
            done();
          }
        })
    })

    test('Username cannot be shorter than 4 characters long.', (done) => {
      request(app)
        .post('/user/register')
        .send({
          email: "belomdidaftarjuga2@mail.com",
          username: "zxc",
          password: "registerfailtest"
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Username must be between 4 - 50 characters long.');
            done();
          }
        })
    })

    test('Username cannot be empty.', (done) => {
      request(app)
        .post('/user/register')
        .send({
          email: "belomdidaftarjuga@mail.com",
          password: "registerfailtest"
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Username must be between 4 - 50 characters long.');
            done();
          }
        })
    })

    //end of fail register test
  })

  describe('Successful login test', () => {
    test('Should return access_token when logged in successfully.', (done) => {
      request(app)
        .post('/user/login')
        .send({
          email: startingData[0].email,
          password: startingData[0].password
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('access_token');
            done();
          }
        })
    })
    //end of success login test
  })

  describe('Fail login test', () => {
    test('Should check for correct password.', (done) => {
      request(app)
        .post('/user/login')
        .send({
          email: startingData[0].email,
          password: startingData[1].password
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Wrong ID/Password.');
            done();
          }
        })
    })

    test('Should check for registered email.', (done) => {
      request(app)
        .post('/user/login')
        .send({
          email: "emailtidaknyata@halu.com",
          password: startingData[0].password
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Wrong ID/Password.');
            done();
          }
        })
    })
    //end of fail login test
  })

  describe('User find one test', () => {
    test('Should return correct username and email.', (done) => {
      request(app)
        .get('/user')
        .set('access_token', correctuser_token)
        .end(function (err, res) {
          if (err) {
            done(err)
          } else {
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email', startingData[0].email);
            expect(res.body).toHaveProperty('username', startingData[0].username);
            done();
          }
        })
    })

    test('Should check for invalid token.', (done) => {
      request(app)
        .get('/user')
        .set('access_token', wronguser_token)
        .end(function (err, res) {
          if (err) {
            done(err)
          } else {
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized.');
            done();
          }
        })
    })

    test('Should check for expired token.', (done) => {
      request(app)
        .get('/user')
        .set('access_token', expired_token)
        .end(function (err, res) {
          if (err) {
            done(err)
          } else {
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized.');
            done();
          }
        })
    })

    test('Should check for having no token.', (done) => {
      request(app)
        .get('/user')
        .end(function (err, res) {
          if (err) {
            done(err)
          } else {
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized.');
            done();
          }
        })
    })

    //end of user findone test
  })
})
