const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');

const newBlog = async (req, res) => {
    try {
        const userId = req.query.userId;
        const { title, content, category } = req.body;

        // Validate that both title and content are provided
        if (!title || !content || !category) {
            return res.status(400).json({ error: 'Both title and content are required' });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new blog post
        const newBlogPost = new BlogPost({ title, content ,category, createdByUser: user._id });
        await newBlogPost.save();

        // Add the new blog post's ID to the user's blogs array
        user.blogs.push(newBlogPost._id);
        await user.save();

        res.json({
            Message: 'New Blog Added',
            Blog: newBlogPost,
        }); // Return the newly added blog post
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = newBlog;
