const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/UserModel');
const { validationResult } = require("express-validator");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const loginUser = async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Find the user in the database by their username
        const user = await User.findOne({ username });

        // If the user is not found, or password doesn't match, send an error response
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // If the username and password match, generate a JWT
        const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: "1h" });

        // Set the JWT token as a cookie
        res.cookie('jwtToken', token, { maxAge: 3600000, httpOnly: true });

        // Respond with success message and JWT token
        res.json({ Success: `${user.username} Logged In Successfully.`, JWT: token });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = loginUser;
