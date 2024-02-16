const { body } = require('express-validator');

const validateNewBlog = [
    // Validate title, content, and category fields
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
];

module.exports = validateNewBlog;
