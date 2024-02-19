const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/UserModel');
const { validationResult } = require("express-validator");
const loginUser = require('../../controllers/UserControllers/LoginUser');

jest.mock('../../models/UserModel');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('express-validator');

describe('Test login user route', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                username: 'testuser',
                password: 'testpassword'
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };
        validationResult.mockReturnValue({ isEmpty: () => true });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should login a user with valid credentials and return a JWT', async () => {
        // Mock User.findOne to return a user with matching username
        const user = { _id: 'userId123', username: 'testuser', password: 'hashedPassword' };
        User.findOne.mockResolvedValue(user);

        // Mock bcrypt.compare to return true for password comparison
        bcrypt.compare.mockResolvedValue(true);

        // Mock jwt.sign to return a token
        jwt.sign.mockReturnValue('sampleJWTToken');

        await loginUser(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', 'hashedPassword');
        expect(jwt.sign).toHaveBeenCalledWith({ userId: 'userId123', username: 'testuser' }, process.env.SECRET_KEY, { expiresIn: "1h" });
        expect(res.cookie).toHaveBeenCalledWith('jwtToken', 'sampleJWTToken', { maxAge: 3600000, httpOnly: true });
        expect(res.json).toHaveBeenCalledWith({ Success: 'testuser Logged In Successfully.', JWT: 'sampleJWTToken' });
    });

    it('should return a 401 error for invalid credentials', async () => {
        // Mock User.findOne to return null, indicating user not found
        User.findOne.mockResolvedValue(null);

        await loginUser(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return validation errors', async () => {
        // Mock validation errors
        validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Validation error' }] });

        await loginUser(req, res);

        expect(validationResult).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Validation error' }] });
    });

    it('should return internal server error for any other errors', async () => {
        // Mock an internal server error
        const error = new Error('Internal Server Error');
        User.findOne.mockRejectedValue(error);

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});
