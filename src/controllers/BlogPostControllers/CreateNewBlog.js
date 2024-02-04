const jwt = require('jsonwebtoken');
const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const Redis = require('redis');
const redisClient = Redis.createClient();

const newBlog = async (req, res) => {
    try {
        // Connect to Redis
        await redisClient.connect();

        // Retrieve the JWT from Redis
        const jwtvalue = await redisClient.get('jwt');

        const tokenHeader = jwtvalue.replace(/["\\]/g, '');

        if (!tokenHeader) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
        }

        // Verify the token
        const decoded = jwt.verify(tokenHeader, secretKey);
        const userId = decoded.userId;
        const { title, content, category } = req.body;

        // Validate that both title and content are provided
        if (!title || !content || !category) {
             res.status(400).json({ error: 'Title, content, and category are required' });
             return;
        }
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Create a new blog post
        const newBlogPost = new BlogPost({ title, content, category, createdByUser: user._id });
        await newBlogPost.save();

        res.status(200).json({
            Message: 'New Blog Added',
            Blog: newBlogPost,
        });

        // Add the new blog post's ID to the user's blogs array
        user.blogs.push(newBlogPost._id);
        await user.save();


    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });


    } finally {
        // Close the Redis connection after completion
        await redisClient.quit();
    }
};

module.exports = newBlog;
