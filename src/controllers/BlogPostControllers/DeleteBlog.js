const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY

const Redis = require('redis')

const redisClient = Redis.createClient();
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});


// Controller to delete a Blog
const deleteBlog = async (req, res) => {
    try {

        await redisClient.connect()

        const jwtvalue = await redisClient.get('jwt');
        console.log('jwtvalue:', jwtvalue);

        const tokenHeader = jwtvalue.replace(/["\\]/g, '');
        console.log('tokenHeader:', tokenHeader);

        if (!tokenHeader) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
        }

        // Verify the token
        jwt.verify(tokenHeader, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized - Invalid token' });
            }

            const userId = decoded.userId;
            const blogId = req.query.blogId;

            if (!userId || !blogId) {
                return res.status(401).json({ error: "Both UserId and BlogId are required" });
            }

            // Find the user by ID
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Find the blog by ID
            const blog = await BlogPost.findById(blogId);

            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }

            // Remove the blog from both User and BlogPost collections
            user.blogs = user.blogs.filter((userBlog) => userBlog.toString() !== blogId);
            await user.save();

            await BlogPost.findByIdAndDelete(blogId);

            res.json({ message: 'Blog deleted successfully', DeletedBlog: blog });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }finally{
        await redisClient.quit()
    }
};

module.exports = deleteBlog;
