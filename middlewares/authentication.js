const jwt = require('jsonwebtoken');
const { User } = require('../models/index.js');

async function authentication(req, res, next) {
  try {
    if (req.headers.access_token) {
      req.payload = jwt.verify(req.headers.access_token, process.env.JWT_SECRET);
      const data = await User.findOne({ where: { id: req.payload.id } });

      //checks if the username of the payload matches the username of payload id in db
      if (data !== null && data.username === req.payload.username) {
        next();
      } else {
        throw "Unauthorized.";
      };
    } else {
      throw "Unauthorized.";
    };
  }
  catch (err) {
    if (err.name && err.name === 'JsonWebTokenError') {
      err = 'Unauthorized.';
    }
    res.status(401).json({ message: err });
  }
}

module.exports = authentication;