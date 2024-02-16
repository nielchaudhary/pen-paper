const { query } = require('express-validator');

const validateLatestNBlogs = [
    // Validate the value of N from the query parameter
    query('N')
        .notEmpty().withMessage('Number of posts (N) is required')
        .isInt({ min: 1 }).withMessage('N must be a positive integer'),
];

module.exports = validateLatestNBlogs;
