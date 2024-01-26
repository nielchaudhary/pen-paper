
const express = require('express');
const router = express.Router();
const AuthenticateUser = require('../middleware/AuthenticateUser')
const CreateNewBlogController = require('../controllers/BlogPostControllers/CreateNewBlog')
const DeleteBlogController = require('../controllers/BlogPostControllers/DeleteBlog')
const UpdateBlogController = require('../controllers/BlogPostControllers/UpdateBlog')
const ReadAllBlogsController = require('../controllers/BlogPostControllers/ReadAllBlogs')
const ReadSpecificBlogController = require('../controllers/BlogPostControllers/ReadSpecificBlog')
const SearchBlogController = require('../controllers/BlogPostControllers/SearchBlogs')
const LatestNBlogController = require('../controllers/BlogPostControllers/LatestNBlogs.js')
const MostPopularBlogController = require('../controllers/BlogPostControllers/MostPopularBlog')

// Endpoint for creating a new user
router.post('/createNewBlog', AuthenticateUser, CreateNewBlogController);
router.delete('/deleteBlog', AuthenticateUser, DeleteBlogController);
router.put('/updateBlog', AuthenticateUser, UpdateBlogController);
router.get('/readAllBlogs', ReadAllBlogsController);
router.get('/readSpecificBlog', ReadSpecificBlogController)
router.get('/searchBlog', SearchBlogController)
router.get('/latestNBlogs', LatestNBlogController)
router.get('/mostPopularBlogs', MostPopularBlogController)

module.exports = router;
