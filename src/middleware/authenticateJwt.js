const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

// JWT middleware function
const authenticateJWT = (req, res, next) => {
    // Get the JWT token from the cookie
    const token = req.cookies.jwtToken;

    if (token) {
        // Verify and decode the token
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                // If token verification fails, return an unauthorized error
                return res.sendStatus(403);
            }

            // If token is valid, attach the decoded user to the request object
            req.user = user;
            next(); // Call the next middleware
        });
    } else {
        // If no JWT token present in the cookie, return unauthorized error
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT;
