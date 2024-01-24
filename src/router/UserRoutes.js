// routes/userRoutes.js
const express = require('express');
const router = express.Router();
// Correct the path based on your actual file structure
const CreateNewUserController = require('../controllers/UserControllers/CreateNewUser')

// Endpoint for creating a new user
router.post('/createUser', CreateNewUserController);

module.exports = router;
