const { query } = require('express-validator');

const validateReadSpecificBlog = [
    // Validate blogId from query parameters
    query('blogId').notEmpty().withMessage('Blog ID is required'),
];

module.exports = validateReadSpecificBlog;
