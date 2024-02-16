const {query} = require('express-validator');

const validateRecommendedRelatedBlogs = [
    query('postId').notEmpty().withMessage('Post Id is required')
        .isString().withMessage('Post Id must be a string'),


    ]

module.exports = validateRecommendedRelatedBlogs