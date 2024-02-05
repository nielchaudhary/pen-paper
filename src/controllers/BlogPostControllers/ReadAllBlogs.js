const BlogPost = require("../../models/BlogPostModel");

const ReadAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 5;

        const skip = (page - 1) * perPage;

        // Retrieve blog posts with pagination
        const blogPosts = await BlogPost.find().skip(skip).limit(perPage).sort({createdAt : -1});

        res.json({ page, blogPosts });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = ReadAllBlogs;
