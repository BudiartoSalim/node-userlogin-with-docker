const { User } = require('../models/index.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const tokenExpiration = "1h";

class UserController {
  // POST: /user/register 
  static async registerPostHandler(req, res, next) {
    try {
      await User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      });
      res.status(201).json(`User ${req.body.username} successfully registered!`);
    } catch (err) {
      next(err);
    }
  }

  // POST: /user/login
  static async loginPostHandler(req, res, next) {
    try {
      let data = await User.findOne({ where: { email: req.body.email } });
      if (data) {
        if (bcrypt.compareSync(req.body.password, data.password)) {
          let access_token = jwt.sign(
            { id: data.id, username: data.username }, process.env.JWT_SECRET,
            { expiresIn: tokenExpiration }
          );
          res.status(200).json({ access_token: access_token });

        } else {
          next({ name: 'LoginError', message: 'Wrong ID/Password.' });
        }
      } else {
        next({ name: 'LoginError', message: 'Wrong ID/Password.' });
      }
    } catch (err) {
      next(err);
    }
  }

  // GET: /user
  static async userGetOneHandler(req, res, next) {
    try {
      let data = await User.findOne(
        {
          where: { id: req.payload.id },
          attributes: { exclude: ['id', 'password', 'CreatedAt', 'UpdatedAt'] }
        }
      );
      res.status(200).json({ email: data.email, username: data.username });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = UserController;