const bcrypt = require('bcrypt');
const User = require('../../models/UserModel');
const { validationResult } = require("express-validator");

const deleteUser = async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username } = req.body;

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
