const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticateJWT = (req, res, next) => {
    const token = req.header("x-auth-token");

    if(!token) res.status(401).send({message:'Access denied, no token provided'})
    
    try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
    if (decoded) next()
    }
    catch (err) {
        res.status(400).send({message: 'Invalid token'})
    }
};

module.exports = authenticateJWT