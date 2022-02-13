const mongoose = require('mongoose');
const bookSchema = mongoose.Schema({
    filename :{type : String, required : true},
    fs_id :{type : String, required : true},
	user_id:{type : String, required : true},
	status:{type : String, required : true},
    path_:{type : String, required : true},
	page_number:{type : Number, required : true},
    opening_date: { type: Date, default:Date.now},
});
module.exports = mongoose.model('books', bookSchema);