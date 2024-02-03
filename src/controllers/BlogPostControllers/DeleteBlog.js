const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');

// Controller to delete a Blog
deleteBlog = async (req, res) => {
    try {
        const userId = req.query.userId;
        const blogId = req.query.blogId;

        if( !userId || !blogId) {
            res.status(401).send("Both UserId and BlogId are required")
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the blog by ID
        const blog = await BlogPost.findById(blogId);

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Remove the blog from both User and BlogPost collections
        user.blogs = user.blogs.filter((userBlog) => userBlog.toString() !== blogId);
        await user.save();

        await BlogPost.findByIdAndDelete(blogId);

        res.json({ message: 'Blog deleted successfully', DeletedBlog: blog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = deleteBlog;
