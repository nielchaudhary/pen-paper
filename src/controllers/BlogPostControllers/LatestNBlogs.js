const BlogPostModel = require("../../models/BlogPostModel");
const { validationResult } = require("express-validator");

const LatestNBlogs = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get the value of N from the query parameter, default to 5 if not provided
        const numberOfPosts = parseInt(req.query.N, 10) || 5;

        // Fetch the latest N blog posts from the database
        const latestBlogs = await BlogPostModel.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(numberOfPosts);

         res.status(200).json({
            blogs: latestBlogs,
        });

    } catch (error) {
         res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = LatestNBlogs;
