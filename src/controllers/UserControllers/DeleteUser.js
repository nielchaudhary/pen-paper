const User = require('../../models/UserModel');

const deleteUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password) {
            return res.status(400).send("Both username and password is required to delete the account.")
        }

        // Check if a user with the provided username exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        // Check if the provided password matches the stored password (you should use a secure hashing mechanism)
        if (existingUser.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // If username and password are valid, delete the user
        await User.findOneAndDelete({ username });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = deleteUser;
