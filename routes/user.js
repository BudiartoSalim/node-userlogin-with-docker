const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user-controller.js');
const authentication = require('../middlewares/authentication.js');

router.post('/login', UserController.loginPostHandler);
router.post('/register', UserController.registerPostHandler);

router.use(authentication);
router.get('/', UserController.userGetOneHandler);


module.exports = router;