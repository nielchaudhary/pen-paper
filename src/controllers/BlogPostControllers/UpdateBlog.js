const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const Redis = require('redis')
const redisClient = Redis.createClient()

// Controller to update a blog
const updateBlog = async (req, res) => {
    try {
        await redisClient.connect();
        const jwtvalue = await redisClient.get('jwt');
        console.log('jwtvalue:', jwtvalue);

        const tokenHeader = jwtvalue.replace(/["\\]/g, '');
        console.log('tokenHeader:', tokenHeader);

        if (!tokenHeader) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
        }

        // Verify the token
        jwt.verify(tokenHeader, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized - Invalid token' });
            }

            const userId = decoded.userId;
            const blogId = req.query.blogId;
            const { title, content, category } = req.body;

            if (!userId || !blogId || !title || !content) {
                return res.status(400).send("Please provide userId, blogId, title, and content.");
            }

            // Find the user by ID
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Find the blog by ID within the user's blogs
            const blog = await BlogPost.findById(blogId);

            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }

            // Update the blog's title, content, and updatedAt
            blog.title = title || blog.title;
            blog.content = content || blog.content;
            blog.category = category || blog.category;
            blog.updatedAt = new Date();
            await blog.save();
            await user.save();

            res.json({ message: 'Blog updated successfully', updatedBlog: blog });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await redisClient.quit();
    }
};

module.exports = updateBlog;
