const jwt = require('jsonwebtoken');
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        console.error('Token missing');
        return res.status(401).json({error: 'Unauthorized: Token missing'});
    }

    jwt.verify(token, secretKey, (err,decoded) => {
        console.log('Decoded Payload:', decoded);

        if (err) {

            console.error('Error:', err);
            // Handle the error
            return res.status(401).json({error: 'Unauthorized: Invalid token'});
        }
        req.user = decoded;
        next();
    });
}



module.exports = authenticateUser
