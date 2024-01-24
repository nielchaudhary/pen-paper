const User = require('../../models/UserModel')

createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = createUser