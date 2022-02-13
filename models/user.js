const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    phone: { type: String, required: false},
    state: { type: String, required: false },
    city: { type: String, required: false },
    address: { type: String, required: false },
    role: { type: String, required: true },
    status: { type: String, required: true },
    opening_date: { type: Date, default:Date.now},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true } 
});
module.exports = mongoose.model('users', userSchema);