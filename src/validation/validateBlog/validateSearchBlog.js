const {query} = require('express-validator');

const validateSearchBlog = [
    query('search').notEmpty().withMessage('Search is required')
]

module.exports = validateSearchBlog