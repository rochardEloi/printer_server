const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Balance = require("../models/balances");
const dotenv = require("dotenv")
dotenv.config()

exports.signupCustomer = (req, res, next) => {   
    const userInfo = req.body;
    console.log(req.body)
    bcrypt.hash(userInfo.password, 10)
        .then(
            hash => {
                const user = new User({
                    ...req.body,
                    password: hash,
                    role:"Customer",
                    phone:"",
                    status:"active"
                });
                user.save() 
                    .then((user) =>{
                        console.log(user)
                        res.status(200).json({
                            userId: user._id,
                            role:user.role,
                            token: jwt.sign({ userId: user._id, role:"Customer" },
                                process.env.SECRET_KEY, { expiresIn: "24h" }
                            )
                        })
                        
                }).catch(error => res.status('400').json({error_1 : error}))
            }
        ).catch(error => res.status('500').json({error_2 : error}))
};

exports.signupAdmin = (req, res, next) => {   
    const userInfo = req.body;
    console.log(req.body)
    bcrypt.hash(userInfo.password, 10)
        .then(
            hash => {
                const user = new User({
                    ...req.body,
                    password: hash,
                    role :"Admin",
                    status:"active"
                });
                user.save() 
                    .then((user) =>{
                        res.status(200).json({
                            userId: user._id,
                            role:user.role,
                            token: jwt.sign({ userId: user._id, role:"Admin" },
                                process.env.SECRET_KEY, { expiresIn: "24h" }
                            )
                        })
                        
                }).catch(error => res.status('400').json({error_1 : error}))
            }
        ).catch(error => res.status('500').json({error_2 : error}))
};



exports.login = (req, res, next) => {
    console.log(req.body)
    User.findOne({ email: req.body.email })
        .then(
            result => {
                if (!result) {
                    return res.status('400').json({ 'message': 'User not found' });
                }
                bcrypt.compare(req.body.password, result.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status('400').json({ 'message': 'Incorrect Password' });
                        }
                        res.status(200).json({
                            userId: result._id,
                            role:result.role,
                            token: jwt.sign({ userId: result._id, role:result.role },
                                process.env.SECRET_KEY, { expiresIn: "24h" }
                            )
                        })
                    })
                    .catch(error => res.status('401').json(error));
            }
        )
        .catch(error => res.status('501').json(error));
};

exports.getUsers = (req, res)=>{ 
   User.find()
     .then(users => res.status("201").json(users))
     .catch(err => res.status("401").json(err))
 }
 exports.getOneUser = (req, res)=>{
  User.findOne({_id : req.params.id})
     .then(user=> res.status("201").json(user ))
     .catch(err => res.status("401").json(err))
 }

 exports.updateUser = (req,res)=>{
    User.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
        .then(() => res.status('201').json({ message: "Succesfully updated" }))
        .catch(error => res.status('401').json(error))
}