
const express = require('express');
const app = express()
const limiter = require('../middleware/RateLimiter')
const router = express.Router();


const authenticateJWT = require('../middleware/authenticateJwt')

//validation routes
const validateNewBlog = require('../validation/validateBlog/validateNewBlog')
const validateDeleteBlog = require('../validation/validateBlog/validateDeleteBlog')
const validateUpdateBlog = require('../validation/validateBlog/validateUpdateBlog')
const validateLatestNBlogs = require('../validation/validateBlog/validateLatestNBlogs')
const validateReadSpecificBlog = require('../validation/validateBlog/validateReadSpecificBlog')
const validateRecommendedRelatedBlog = require('../validation/validateBlog/validateRecommendRelatedBlogs')
const validateSearchBlog = require('../validation/validateBlog/validateSearchBlog')

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
const RecommendRelatedBlogsController = require('../controllers/BlogPostControllers/RecommendRelatedBlogs.js')

// Endpoint for creating a new user
router.post('/createNewBlog',limiter, authenticateJWT, validateNewBlog, CreateNewBlogController);
router.delete('/deleteBlog',limiter,authenticateJWT,validateDeleteBlog, DeleteBlogController);
router.put('/updateBlog',limiter,authenticateJWT, validateUpdateBlog, UpdateBlogController);
router.get('/readAllBlogs',limiter, ReadAllBlogsController);
router.get('/readSpecificBlog',limiter, validateReadSpecificBlog,ReadSpecificBlogController)
router.get('/searchBlog',limiter,validateSearchBlog, SearchBlogController)
router.get('/latestNBlogs', limiter,validateLatestNBlogs,LatestNBlogController)
router.get('/mostPopularBlogs',limiter, MostPopularBlogController)
router.get('/recommendRelatedBlogs',limiter,validateRecommendedRelatedBlog,RecommendRelatedBlogsController)

module.exports = router;
