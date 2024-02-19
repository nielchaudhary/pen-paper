const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

// Controller to update a blog
const updateBlog = async (req, res) => {
    try {
        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get the JWT token from the request cookies
        const tokenHeader = req.cookies.jwtToken;

        // Verify the token to get the user ID
        const decoded = jwt.verify(tokenHeader, secretKey);
        const userId = decoded.userId;

        const blogId = req.query.blogId;
        const { title, content, category } = req.body;

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

        // Check if the user is authorized to update the blog
        if (userId.toString() !== blog.createdByUser.toString()) {
            return res.status(403).json({ error: 'You are not authorized to update this blog' });
        }

        // Update the blog with the provided fields
        if (title) blog.title = title;
        if (content) blog.content = content;
        if (category) blog.category = category;
        blog.updatedAt = new Date();

        // Save the updated blog
        await blog.save();

        res.status(200).json({ message: 'Blog updated successfully', updatedBlog: blog });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = updateBlog;
