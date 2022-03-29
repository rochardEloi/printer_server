const express = require('express');
const router = express.Router();
const userControl = require('../controllers/user');
const verify = require('../middleware/auth');
//verify,
router.post('/login', userControl.login);
router.post('/signupCustomer',  userControl.signupCustomer);
router.post('/signupAdmin',  userControl.signupAdmin);
router.post('/updateUser/:id', verify("both"), userControl.updateUser);
router.post("/update-password/:id",verify("both"), userControl.updateUserPassword);
router.get("/oneUser/:id", verify("both"),userControl.getOneUser);
router.get("/allUsers", verify("Admin"), userControl.getUsers);


module.exports = router;