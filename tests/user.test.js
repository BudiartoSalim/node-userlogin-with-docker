const request = require('supertest');
const app = require('../app.js');
const { User } = require('../models/index.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'secretkeyhere';

describe('==User Path Test==', () => {
  beforeAll((done) => {

  })

  afterAll((done) => {

  })
})