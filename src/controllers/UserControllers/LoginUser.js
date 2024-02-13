const jwt = require('jsonwebtoken');
const User = require('../../models/UserModel');
require("dotenv").config()
const secretKey = process.env.SECRET_KEY

const Redis = require('redis')

const redisClient = Redis.createClient()

const default_expiry = 3600;



const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).send("Username and Password is required for Logging In.")
        }

        // Find the user in the database by their username
        const user = await User.findOne({username : username});

        // If the user is not found, send an error response
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // If the password does not match, send an error response
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }



            // If the username and password match, generate a JWT
        const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: "1h" });

        await redisClient.connect().then(()=>{
            redisClient.setEx('jwt', default_expiry, token)
        })

            res.json({ Message: "User Logged In Successfully", UserDetails: user, JWT: token });






    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = loginUser;


