const express = require('express');
const router = express.Router();
const bookControl = require('../controllers/books');
const fileUpload = require("../file")
const verify = require('../middleware/auth');

router.post('/uploads',verify("Customer"), fileUpload.upload.single("pdf"), bookControl.addBooks);
router.put("/update",verify("Admin"), bookControl.updateBook);
router.get("/all", verify("Admin"), bookControl.getAllBooks);
router.get("/some/:id", verify("both"),bookControl.getSomeBooks);
router.get("/one/:id",verify("both"), bookControl.getOneBooks);
router.get("/download", bookControl.downloadBook);
module.exports = router