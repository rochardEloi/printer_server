const express = require('express');
const router = express.Router();
const userControl = require('../controllers/user');
const verify = require('../middleware/auth');
//verify,
router.post('/login', userControl.login);
router.post('/signupCustomer',  userControl.signupCustomer);
router.post('/signupAdmin',  userControl.signupAdmin);
router.put('/updateUser/:id', verify("Admin"), userControl.updateUser);
router.get("/oneUser/:id", verify("both"),userControl.getOneUser);
router.get("/allUser", verify("Admin"), userControl.getUsers);


module.exports = router;