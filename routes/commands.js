const express = require('express');
const router = express.Router();
const commandsController =  require("../controllers/commands")
const verify = require('../middleware/auth');

router.post("/create-checkout-session",verify("Customer"), commandsController.makeCommand);
router.get("/checkout-session",verify("Customer"), commandsController.executeCommand);
router.put("/updatecommand/:id", verify("Admin"),commandsController.updateCommand);
router.get("/onecommand/:id", verify("both"),commandsController.getOneCommand);
router.get("/allcommands", verify("Admin"),commandsController.getCommands);
router.get("/alltransactions", verify("Admin"),commandsController.getTransactions);
router.get("/someCommands/:id", verify("both"),commandsController.getSomeCommands);

module.exports = router;