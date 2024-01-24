
const express = require('express');
const router = express.Router();
const CreateNewBlogController = require('../controllers/BlogPostControllers/CreateNewBlog')
const DeleteBlogController = require('../controllers/BlogPostControllers/DeleteBlog')
const UpdateBlogController = require('../controllers/BlogPostControllers/UpdateBlog')

// Endpoint for creating a new user
router.post('/createNewBlog', CreateNewBlogController);
router.delete('/deleteBlog', DeleteBlogController);
router.put('/updateBlog', UpdateBlogController);


module.exports = router;
