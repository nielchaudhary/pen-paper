const TfIdf = require('node-tfidf');
const BlogPost = require('../../models/BlogPostModel');
const {validationResult} = require("express-validator");

const recommendRelatedPosts = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const currentPostId = req.query.postId;


        const currentPost = await BlogPost.findById(currentPostId);

        if (!currentPost) {
            return res.status(400).json({ error: 'Blog not found' });
        }

        const currentContent = currentPost.content || '';

        // Retrieve other blog posts from the database with a limit
        const allPosts = await BlogPost.find({ _id: { $ne: currentPostId } }).limit(100);

        const tfidf = new TfIdf();

        // Learn documents from other posts asynchronously
        await Promise.all(allPosts.map(async (post, index) => {
            await tfidf.addDocument(post.content, index);
        }));

        // Learn the current document
        tfidf.addDocument(currentContent, 'current');

        // Calculate similarities asynchronously
        const similarityPromises = allPosts.map(async (post, index) => {
            const similarity = await tfidf.tfidf(currentContent, index);
            return { post, similarity };
        });

        const similarities = await Promise.all(similarityPromises);

        // Sort by similarity in descending order
        similarities.sort((a, b) => b.similarity - a.similarity);

        const initialThreshold = 1.0;

        // Filter and map in a single step, limiting to 2 related posts
        const relatedPosts = similarities
            .filter((item) => item.similarity >= initialThreshold)
            .map((item) => item.post)
            .slice(0, 5); // Limiting to 5 related posts

        // Respond with status 200 and relatedPosts using .then
        return res.status(200).json({ relatedPosts });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = recommendRelatedPosts;
