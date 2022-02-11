const mongoose = require('mongoose');
const transactionSchema = mongoose.Schema({
    user_id:{type : String, required : true},
    status:{type : String, required : true},
    book_id:{type : String, required : true},
    amount:{type : Number, required : true},
    method :{type : String, required : true},
    payment_id:{type : String, required : true},
});
module.exports = mongoose.model('transactions', transactionSchema); 