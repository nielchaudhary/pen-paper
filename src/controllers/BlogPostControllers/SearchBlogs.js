const BlogPost = require("../../models/BlogPostModel");

const SearchBlogs = async (req, res) => {
    try {
        const searchQuery = req.query.search; // Get the search query from query parameters

        if (!searchQuery) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Use a regular expression to perform a case-insensitive search on title and content
        const regex = new RegExp(searchQuery, 'i');

        // Retrieve blog posts that match the search query
        const blogPosts = await BlogPost.find({
            $or: [
                { title: { $regex: regex } },
                { content: { $regex: regex } }
            ]
        });

        res.json({ blogPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = SearchBlogs;
