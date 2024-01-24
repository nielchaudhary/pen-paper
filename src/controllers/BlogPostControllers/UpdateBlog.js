const User = require('../../models/UserModel')
const BlogPost = require('../../models/BlogPostModel')


// Controller to update a blog
updateBlog = async (req, res) => {
    try {
        const userId = req.query.userId;
        const blogId = req.query.blogId;
        const { title, content } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the blog by ID within the user's blogs
        const blog = user.blogs.find((blog) => blog._id.toString() === blogId);

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Update the blog's title, content, and updatedAt
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.updatedAt = new Date(); // Update the updatedAt field
        await user.save();

        res.json({ message: 'Blog updated successfully', updatedBlog: blog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = updateBlog
