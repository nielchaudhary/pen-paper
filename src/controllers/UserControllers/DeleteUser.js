const User = require('../../models/UserModel');
const { validationResult } = require("express-validator");
const secretKey = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

const deleteUser = async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const token = req.cookies.jwtToken;

        const decoded = jwt.verify(token, secretKey);
        const decodedUsername = decoded.username; // Assign the decoded username to decodedUsername
        console.log(decodedUsername); // Output the decoded username for debugging

        const { username } = req.body;

        if (decodedUsername !== username) {
            return res.status(403).json({ error: 'Unauthorized' }); // Return a 403 Forbidden response
        }

        // Check if a user with the provided username exists
            const existingUser = await User.findOne({ username });
            if (!existingUser) {
                return res.status(400).json({ error: 'User does not exist' });
            }

            // Delete the user
            await User.findOneAndDelete({ username });

            res.json({ message: 'User deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = deleteUser;
