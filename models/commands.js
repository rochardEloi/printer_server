const mongoose = require('mongoose');
const commandSchema = mongoose.Schema({
    user_id:{type : String, required : true},
    book_id :{type : String, required : true},
	type:{type : String, required : true},
    price_per_page:{type : Number, required : true},
    page_number : {type : Number, required : true}, 
    transaction_id:{type : String, required : true},
    address : {
        country:{type:String},
        city : {type:String},
        street : {type:String},
        number :{type:Number},
        zip_code:{type:String},
    },
    command_date : {type:Date, default : Date.now},
    status :{type : String, required : true},
});
module.exports = mongoose.model('commands', commandSchema); 