const mongoose = require('mongoose');
const parametersSchema = mongoose.Schema({
    name :{type : String, required : true, unique:true},
	value:{type : String, required : true},
});
module.exports = mongoose.model('parameters', parametersSchema); 