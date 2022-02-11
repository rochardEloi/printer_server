const mongoose = require('mongoose');
const balanceSchema = mongoose.Schema({
    balance: { type: Number, required: true },
    bonus: { type: Number, required: true },
    user_id:{ type: String, required: true },   
});
module.exports = mongoose.model('balances', balanceSchema);