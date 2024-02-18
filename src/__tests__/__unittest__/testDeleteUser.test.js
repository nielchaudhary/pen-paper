const User = require('../../models/UserModel');
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const deleteUser = require('../../controllers/UserControllers/DeleteUser');

jest.mock('../../models/UserModel');
jest.mock('jsonwebtoken');
jest.mock('express-validator');

describe('Test delete user route', () => {
    let req, res;

    beforeEach(() => {
        req = {
            cookies: {
                jwtToken: 'sampleJWTToken'
            },
            body: {
                username: 'testuser'
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        validationResult.mockReturnValue({ isEmpty: () => true });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should delete a user when user is authorized and exists', async () => {
        // Mock JWT verification to return a decoded token with matching username
        const decodedToken = { username: 'testuser' };
        jwt.verify.mockReturnValue(decodedToken);

        // Mock User.findOne to return an existing user
        User.findOne.mockResolvedValue({ username: 'testuser' });

        // Mock findOneAndDelete method
        User.findOneAndDelete.mockResolvedValue({});

        await deleteUser(req, res);

        expect(jwt.verify).toHaveBeenCalledWith('sampleJWTToken', process.env.SECRET_KEY);
        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(User.findOneAndDelete).toHaveBeenCalledWith({ username: 'testuser' });
        expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return a 403 error if user is unauthorized', async () => {
        // Mock JWT verification to return a decoded token with different username
        const decodedToken = { username: 'anotheruser' };
        jwt.verify.mockReturnValue(decodedToken);

        await deleteUser(req, res);

        expect(jwt.verify).toHaveBeenCalledWith('sampleJWTToken', process.env.SECRET_KEY);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return a 400 error if user does not exist', async () => {
        // Mock JWT verification to return a decoded token with matching username
        const decodedToken = { username: 'testuser' };
        jwt.verify.mockReturnValue(decodedToken);

        // Mock User.findOne to return null, indicating user not found
        User.findOne.mockResolvedValue(null);

        await deleteUser(req, res);

        expect(jwt.verify).toHaveBeenCalledWith('sampleJWTToken', process.env.SECRET_KEY);
        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'User does not exist' });
    });

    it('should return validation errors', async () => {
        // Mock validation errors
        validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Validation error' }] });

        await deleteUser(req, res);

        expect(validationResult).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Validation error' }] });
    });

    it('should return internal server error for any other errors', async () => {
        // Mock an internal server error
        const error = new Error('Internal Server Error');
        User.findOne.mockRejectedValue(error);

        await deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});
