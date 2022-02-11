const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config()

module.exports = (userType) =>{
    return(
        (req, res, next) => {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
                const userId = decodedToken.userId;
                const role = decodedToken.role
                console.log(userId);
                console.log(decodedToken);
                if (userType != "both" && role != userType) {
                    res.status(401).json({ error: "Invalid User" });
                } else {
                    next();
                }
            } catch (error) {
                res.status(401).json({ error:  "Connexion Impossible" });
            }
        }
    )
}