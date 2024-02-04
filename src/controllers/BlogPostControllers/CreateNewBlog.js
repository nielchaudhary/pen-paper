const jwt = require('jsonwebtoken');
const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const Redis = require('redis');
const redisClient = Redis.createClient();
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

const newBlog = async (req, res) => {
    try {
        // Connect to Redis
        await redisClient.connect();

        // Retrieve the JWT from Redis
        const jwtvalue = await redisClient.get('jwt');
        console.log('jwtvalue:', jwtvalue);

        const tokenHeader = jwtvalue.replace(/["\\]/g, '');
        console.log('tokenHeader:', tokenHeader);

        if (!tokenHeader) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
        }

        // Verify the token
        const decoded = jwt.verify(tokenHeader, secretKey);
        const userId = decoded.userId;
        const { title, content, category } = req.body;

        // Validate that both title and content are provided
        if (!title || !content || !category) {
            return res.status(400).json({ error: 'Title, content, and category are required' });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new blog post
        const newBlogPost = new BlogPost({ title, content, category, createdByUser: user._id });
        await newBlogPost.save();

        // Add the new blog post's ID to the user's blogs array
        user.blogs.push(newBlogPost._id);
        await user.save();

        res.json({
            Message: 'New Blog Added',
            Blog: newBlogPost,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Close the Redis connection after completion
        await redisClient.quit();
    }
};

module.exports = newBlog;
