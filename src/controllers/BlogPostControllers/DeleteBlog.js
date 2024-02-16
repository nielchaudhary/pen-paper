const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

// Controller to delete a Blog
const deleteBlog = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const tokenHeader = req.cookies.jwtToken;
        const decoded = await jwt.verify(tokenHeader, secretKey);
        const userId = decoded.userId;
        const blogId = req.query.blogId;

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

        // Convert ObjectIds to strings for comparison
        const userIdString = userId.toString();
        const blogCreatedByUserString = blog.createdByUser.toString();

        // Check if the user is authorized to delete the blog
        if (userIdString !== blogCreatedByUserString) {
            return res.status(403).json({ error: 'You are not authorized to delete this blog' });
        }

        // Remove the blog from both User and BlogPost collections
        user.blogs = user.blogs.filter(userBlog => userBlog.toString() !== blogId);
        await user.save();

        await BlogPost.findByIdAndDelete(blogId);

        res.status(200).json({
            message: 'Blog deleted successfully',
            DeletedBlog: {
                id: blogId,
                blogTitle: blog.title
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = deleteBlog;
