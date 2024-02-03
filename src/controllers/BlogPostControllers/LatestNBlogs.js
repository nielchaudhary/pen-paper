const BlogPostModel = require("../../models/BlogPostModel");

const LatestNBlogs = async (req, res) => {
    try {
        // Get the value of N from the query parameter, default to 5 if not provided
        const numberOfPosts = parseInt(req.query.N, 10) || 5;
        if(!numberOfPosts){
            return res.status(400).send("Enter the Number of Latest Blog Posts you want to retrieve")
        }

        // Fetch the latest N blog posts from the database
        const latestBlogs = await BlogPostModel.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(numberOfPosts);

        res.json({
            message: `Latest ${numberOfPosts} Blog Posts`,
            blogs: latestBlogs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = LatestNBlogs;
