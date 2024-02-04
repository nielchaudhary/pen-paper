const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
const jwt = require('jsonwebtoken');
const Redis = require('redis');

require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const redisClient = Redis.createClient();
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Controller to delete a Blog
const deleteBlog = async (req, res) => {
    try {
        await redisClient.connect();

        const jwtvalue = await redisClient.get('jwt')


        const tokenHeader = jwtvalue.replace(/["\\]/g, '');


        const decoded = jwt.verify(tokenHeader, secretKey);

        const userId = decoded.userId;
        const blogId = req.query.blogId;

        if (!userId || !blogId) {
            return res.status(401).json({ error: 'Both UserId and BlogId are required' });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Find the blog by ID
        const blog = await BlogPost.findById(blogId);

        if (!blog) {
            return res.status(400).json({ error: 'Blog not found' });
        }

        // Remove the blog from both User and BlogPost collections
        user.blogs = user.blogs.filter((userBlog) => userBlog.toString() !== blogId);
        res.status(200).json({ message: 'Blog deleted successfully', DeletedBlog: blog });

        await user.save();



        await BlogPost.findByIdAndDelete(blogId);


    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await redisClient.quit();
    }
};

module.exports = deleteBlog;
