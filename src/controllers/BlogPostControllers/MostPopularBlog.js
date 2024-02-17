const BlogPostModel = require("../../models/BlogPostModel");
const Redis = require('ioredis');

const client = new Redis("rediss://default:dcb192a4489c489cbe28ba358635c396@us1-new-kangaroo-39306.upstash.io:39306");

const MostPopularBlogController = async (req, res) => {
    try {
        // Check if popular blog posts exist in Redis
        const popularBlogPosts = await client.lrange('popularBlogPosts', 0, 4);
        const parsedBlogPosts = popularBlogPosts.map(post => JSON.parse(post));

        // If popular blog posts exist in Redis, return them
        if (parsedBlogPosts.length > 0) {
            return res.json(parsedBlogPosts);
        } else {
            // Fetch blog posts sorted by views in descending order
            const popularBlogPosts = await BlogPostModel.find({ views: { $gte: 5 } }).sort({ views: -1 }).limit(5);

            // Return the popular blog posts as JSON
            return res.json(popularBlogPosts);
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = MostPopularBlogController;
