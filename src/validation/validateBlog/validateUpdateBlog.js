const { body ,query,cookie} = require('express-validator');

const validateUpdateBlog = [
    // Validate title, content, and category fields
    cookie('jwtToken').notEmpty().withMessage('JWT token is required'),


    query('blogId').notEmpty().withMessage('BlogId is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
];

module.exports = validateUpdateBlog;
