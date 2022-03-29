const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require("dotenv");
const user = require('../models/user');
dotenv.config()

module.exports = (userType) =>{
    return(
        (req, res, next) => {
                const token = req.headers.authorization.split(' ')[1];
                const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
                const userId = decodedToken.userId;
                User.findOne({_id : userId}).then((user)=>{
                    if(!user)
                        res.status("401").json({message : "Cannot find user"})
                    else if(user.status !== "active"){
                        res.status("401").json({message : "account blocked"})
                    }
                    else{
                        const role = decodedToken.role
                        if (userType != "both" && role != userType) {
                            res.status(401).json({ message: "Invalid User" });
                        } else {
                            next();
                        }
                    }
                    
                }).catch(()=>{
                    res.status(401).json({ message:  "Cannot find user informations" });
                })
                
        }
    )
}