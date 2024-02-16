const {body} = require('express-validator')


const validateDeleteUser = [
    body('username').notEmpty().isString().withMessage("username is required")
]

module.exports = validateDeleteUser