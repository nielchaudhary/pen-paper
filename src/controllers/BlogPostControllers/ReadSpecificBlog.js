const BlogPost = require('../../models/BlogPostModel');
const {validationResult} = require("express-validator");



readSpecificBlog = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const blogId = req.query.blogId;

        //validation
        if (!blogId || typeof blogId !== 'string') {
            res.status(400).json({ Error : "Please Provide Blog ID." });
            return;
        }

        const blog = await BlogPost.findById(blogId);

        if (!blog) {
            res.status(404).json({ Alert: "Incorrect Blog ID" });
            return;
        }

        // Increase views by 1
        blog.views = (blog.views || 0) + 1;

        res.json(blog);

        // Save the updated blog
        await blog.save();

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = readSpecificBlog;
