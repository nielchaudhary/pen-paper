const BlogPost = require('../../models/BlogPostModel');
const { validationResult } = require("express-validator");
const Redis = require('ioredis')

const client = new Redis("rediss://default:dcb192a4489c489cbe28ba358635c396@us1-new-kangaroo-39306.upstash.io:39306");

const readSpecificBlog = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const blogId = req.query.blogId;

        // Validation
        if (!blogId || typeof blogId !== 'string') {
            return res.status(400).json({ Error: "Please Provide Blog ID." });
        }

        let blog = await BlogPost.findById(blogId);

        if (!blog) {
            return res.status(404).json({ Alert: "Incorrect Blog ID" });
        }

        // Increase views by 1
        blog.views = (blog.views || 0) + 1;

        // Save the updated blog
        await blog.save();

        if (blog.views >= 5) {
            // Add blog post to Redis
            await client.lpush('popularBlogPosts', JSON.stringify(blog));

        }

        // Send the response to the client after all operations are completed
        res.json(blog);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = readSpecificBlog;
