
const express = require('express');
const app = express()
const limiter = require('../middleware/RateLimiter')
const router = express.Router();
const AuthenticateUser = require('../middleware/AuthenticateUser')

app.use(limiter)




//Endpoints for Blog Feature
const CreateNewBlogController = require('../controllers/BlogPostControllers/CreateNewBlog')
const DeleteBlogController = require('../controllers/BlogPostControllers/DeleteBlog')
const UpdateBlogController = require('../controllers/BlogPostControllers/UpdateBlog')
const ReadAllBlogsController = require('../controllers/BlogPostControllers/ReadAllBlogs')
const ReadSpecificBlogController = require('../controllers/BlogPostControllers/ReadSpecificBlog')
const SearchBlogController = require('../controllers/BlogPostControllers/SearchBlogs')
const LatestNBlogController = require('../controllers/BlogPostControllers/LatestNBlogs.js')
const MostPopularBlogController = require('../controllers/BlogPostControllers/MostPopularBlog')

// Endpoint for creating a new user
router.post('/createNewBlog',limiter, AuthenticateUser, CreateNewBlogController);
router.delete('/deleteBlog',limiter, AuthenticateUser, DeleteBlogController);
router.put('/updateBlog',limiter, AuthenticateUser, UpdateBlogController);
router.get('/readAllBlogs',limiter, ReadAllBlogsController);
router.get('/readSpecificBlog',limiter,ReadSpecificBlogController)
router.get('/searchBlog',limiter, SearchBlogController)
router.get('/latestNBlogs', limiter,LatestNBlogController)
router.get('/mostPopularBlogs',limiter, MostPopularBlogController)

module.exports = router;
