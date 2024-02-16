const {body} = require('express-validator')

const validateUser = [
    body('username').notEmpty().isString().withMessage('Username is required'),
    body('password').notEmpty().isString().withMessage('Username is required'),


]

module.exports = validateUser