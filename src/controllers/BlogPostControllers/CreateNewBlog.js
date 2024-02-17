const jwt = require('jsonwebtoken');
const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
const { validationResult } = require('express-validator');

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const newBlog = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Retrieve the JWT frm Redis
        const tokenHeader = req.cookies.jwtToken;
        if (!tokenHeader) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
        }

        // Verify the token
        const decoded = jwt.verify(tokenHeader, secretKey);
        const userId = decoded.userId;
        const { title, content, category } = req.body;

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


    }
};

module.exports = newBlog;
