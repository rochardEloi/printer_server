const express = require('express');
const router = express.Router();
const userControl = require('../controllers/user');
const verify = require('../middleware/auth');
//verify,
router.post('/login', userControl.login);
router.post('/signupCustomer',  userControl.signupCustomer);
router.post('/signupAdmin',  userControl.signupAdmin);


module.exports = router;