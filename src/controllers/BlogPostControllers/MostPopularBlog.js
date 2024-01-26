const BlogPostModel = require("../../models/BlogPostModel");

const MostPopularBlogController = async (req, res) => {
    try {
        // Fetch blog posts sorted by views in descending order
        const popularBlogPosts = await BlogPostModel.find().sort({ views: -1 }).limit(5);

        // Return the popular blog posts as JSON
        res.json(popularBlogPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = MostPopularBlogController;
