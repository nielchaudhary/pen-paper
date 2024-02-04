const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const Redis = require('redis');
const redisClient = Redis.createClient();

// Controller to update a blog
const updateBlog = async (req, res) => {
    try {
        await redisClient.connect();
        const jwtvalue = await redisClient.get('jwt');

        const tokenHeader = jwtvalue.replace(/["\\]/g, '');

        if (!tokenHeader) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
        }

        // Verify the token
        const decoded = jwt.verify(tokenHeader, secretKey);

        const userId = decoded.userId;


        const blogId = req.query.blogId;

        if (!userId || !blogId) {
            return res.status(401).json({ error: 'Both UserId and BlogId are required' });
        }


        const { title, content, category } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ error:"Please provide title, category, and content." });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Find the blog by ID within the user's blogs
        const blog = await BlogPost.findById(blogId);

        if (!blog) {
            return res.status(400).json({ error: 'Blog not found' });
        }

        // Update the blog's title, content, and updatedAt
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.category = category || blog.category;
        blog.updatedAt = new Date();

        res.status(200).json({ message: 'Blog updated successfully', updatedBlog: blog });


        await blog.save();


        await user.save();




    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await redisClient.quit();
    }
};

module.exports = updateBlog;
