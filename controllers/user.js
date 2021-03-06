const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const { resetWatchers } = require('nodemon/lib/monitor/watch');
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
                        res.status(201).json({
                            userId: user._id,
                            role:user.role,
                            token: jwt.sign({ userId: user._id, role:"Customer" },
                                process.env.SECRET_KEY, { expiresIn: "24h" }
                            )
                        })
                        
                }).catch(error => res.status('401').json({error_1 : error}))
            }
        ).catch(error => res.status('401').json({error_2 : error}))
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
                        res.status(201).json({
                            userId: user._id,
                            role:user.role,
                            token: jwt.sign({ userId: user._id, role:"Admin" },
                                process.env.SECRET_KEY, { expiresIn: "24h" }
                            )
                        })
                        
                }).catch(error => res.status('401').json({error_1 : error}))
            }
        ).catch(error => res.status('401').json({error_2 : error}))
};



exports.login =  (req, res, next) => {
    console.log(req.body)
    User.findOne({ email: req.body.email })
        .then(
            result => {
                if (!result) {
                    return res.status('401').json({ 'message': 'User not found' });
                }
                else if(result.status !== "active"){
                    return res.status('401').json({ 'message': 'User Blocked' });
                } else{
                    bcrypt.compare(req.body.password, result.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status('401').json({ 'message': 'Incorrect Password' });
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
                
            }
        )
        .catch(error => res.status('401').json(error));
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

exports.updateUserPassword = (req,res)=>{
    User.findOne({_id : req.params.id})
        .then( (user)=> {
            bcrypt.compare(req.body.oldPassword, user.password)
                .then(async(valid)=>{
                       if(!valid){
                          return res.status(200).json({status : "fail", message : "Old password Incorrect"})
                        }

                        if(req.body.newPassword !== req.body.confirmPassword){
                            return res.status(200).json({status : "fail", message : "Password don't match"})
                        }
                        
                        let hashPassword
                        try {
                            hashPassword = await bcrypt.hash(req.body.newPassword, 10);
                        } catch (error) {
                            return res.status(200).json({status : "fail", message : "Hash error"})
                        }
                        
                        User.updateOne({_id : req.params.id}, {password : hashPassword})
                        .then(()=>{
                            return res.status(200).json({status : "success", message : "success"})
                        })
                        .catch(()=>{
                            return res.status(401).json({status : "fail", message : "Error with mail"})
                        })
                        
                        

                        
                    
                })
        })
        .catch(err => res.status("401").json(err))
}