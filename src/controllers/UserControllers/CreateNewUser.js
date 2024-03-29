const bcrypt = require('bcrypt');
const User = require('../../models/UserModel');
const { validationResult } = require("express-validator");

const createUser = async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Check if a user with the same username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create a new user with hashed password
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();


        res.status(200).json({
            message: 'User Successfully Created',
            username: newUser.username, // This should now work correctly
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = createUser;
