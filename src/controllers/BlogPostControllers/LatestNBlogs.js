    const BlogPostModel = require("../../models/BlogPostModel");
    const {validationResult} = require("express-validator");

    const LatestNBlogs = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // Get the value of N from the query parameter, default to 5 if not provided
            const numberOfPosts = parseInt(req.query.N, 10)
            if(!numberOfPosts){
                return res.json({error: "Enter the Number of Latest Blog Posts you want to retrieve"})
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
            res.status(500).json({ error: 'New Server Error' });
        }
    };

    module.exports = LatestNBlogs;
