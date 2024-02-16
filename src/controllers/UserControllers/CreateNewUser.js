const User = require('../../models/UserModel');
const {validationResult} = require("express-validator");

const createUser = async (req, res) => {
    try {
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

        // If the username is unique, create a new user
        const newUser = new User({ username, password });
        res.status(200).json({
            message : 'User Successfully Created',
            username : newUser.username,
            password : newUser.password,

        });


        await newUser.save();


    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = createUser;
