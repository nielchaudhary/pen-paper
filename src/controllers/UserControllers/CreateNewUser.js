const User = require('../../models/UserModel');

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        //validation
        if(!username || !password) {
            return res.status(400).send("Username and Password is required.")
        }

        // Check if a user with the same username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // If the username is unique, create a new user
        const newUser = new User({ username, password });
        await newUser.save();

        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = createUser;
