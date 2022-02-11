const express = require('express');
const router = express.Router()
const parameterController = require("../controllers/parameters")
const verify = require('../middleware/auth');

router.post("/parameter",verify("Admin"),parameterController.addParameters);
router.put("/update/parameter/:id", verify("Admin"),parameterController.updateParameter);
router.get("/get/parameter/:id", verify("Admin"),parameterController.getparameter)
router.get("/get/parameter/", verify("Admin"),parameterController.getparameter)


module.exports = router 