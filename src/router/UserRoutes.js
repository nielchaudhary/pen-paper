// routes/userRoutes.js
const express = require('express');
const router = express.Router();
// Correct the path based on your actual file structure
const CreateNewUserController = require('../controllers/UserControllers/CreateNewUser')
const LoginUserController = require('../controllers/UserControllers/LoginUser')
const DeleteUserController = require('../controllers/UserControllers/DeleteUser')

// Endpoint for creating a new user
router.post('/createUser', CreateNewUserController);
router.post('/loginUser', LoginUserController)
router.delete('/deleteUser', DeleteUserController)

module.exports = router;
