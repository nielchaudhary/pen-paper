
const express = require('express');
const router = express.Router();


// Correct the path based on your actual file structure
const CreateNewUserController = require('../controllers/UserControllers/CreateNewUser')
const LoginUserController = require('../controllers/UserControllers/LoginUser')
const DeleteUserController = require('../controllers/UserControllers/DeleteUser')
const LogoutUserController = require('../controllers/UserControllers/LogoutUser')
const authenticateJWT = require('../middleware/authenticateJwt')

//validation routes
const validateUser = require('../validation/validateUsers/validateDeleteUser')
const validateDeleteUser = require('../validation/validateUsers/validateDeleteUser')

// Endpoint for creating a new user
router.post('/createUser', validateUser,CreateNewUserController);
router.post('/loginUser',validateUser, LoginUserController)
router.delete('/deleteUser', authenticateJWT,validateDeleteUser, DeleteUserController)
router.post('/logoutUser', authenticateJWT,LogoutUserController)

module.exports = router;
