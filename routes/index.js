const express = require('express');
const router = express.Router();
const UserRouter = require('./user.js');

router.use('/user', UserRouter);

module.exports = router;