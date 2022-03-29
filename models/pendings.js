const mongoose = require('mongoose');
const pendingsSchema = mongoose.Schema({
    user_id:{type : String,},
    book:{type : String,},
    type:{type : String,},
    price_per_page:{type : Number},
    pages:{type : Number},
    address : {
        country:{type:String},
        city : {type:String},
        street : {type:String},
        number :{type:Number},
        zip_code:{type:String},
    },
    
});
module.exports = mongoose.model('pendings', pendingsSchema); 