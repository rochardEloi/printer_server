const express = require('express');
const router = express.Router();
const myControl = require('../controllers/balances');
const verify = require('../middleware/auth');

router.post('/',   myControl.createBalance);
router.get('/:id', myControl.getOneBalance);
router.put('/:id', myControl.updateBalance);
//router.delete('/:id', myControl.deleteBalance);
router.get('/', myControl.getAllBalance);
module.exports = router;