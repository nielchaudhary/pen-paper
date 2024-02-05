const BlogPost = require('../../models/BlogPostModel');



readSpecificBlog = async (req, res) => {
    try {
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
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = readSpecificBlog;
