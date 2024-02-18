const bcrypt = require('bcrypt');
const User = require('../../models/UserModel');
const { validationResult } = require('express-validator');
const createUser = require('../../controllers/UserControllers/CreateNewUser');

jest.mock('bcrypt');
jest.mock('../../models/UserModel');
jest.mock('express-validator');

describe('Test create user route', () => {
    let req, res, next;


    beforeEach(() => {
        req = {
            body: {
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        validationResult.mockReturnValue({ isEmpty: () => true });
        next = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it.only('should create a new user when both username and password are provided', async () => {
        // Valid username and password in request body
        req.body = { username: 'testuser', password: 'testpassword' };

        validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });


        // Mocking validationResult to return an object with an empty array for errors

        // Mock User.findOne to return null, simulating user not found
        jest.spyOn(User, 'findOne').mockResolvedValue(null);

        // Mock bcrypt.hash to return a hashed password
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

        // Mock User.save
        const savedUser = {
            username: 'testuser',
            password: 'hashedPassword', // Password should be hashed
        };

        jest.spyOn(User.prototype, 'save').mockImplementation(async function () {
            // Simulate save method behavior
            this.username = savedUser.username;
            this.password = savedUser.password;
        });

        // Ensure that createUser returns a 200 status code upon success
        jest.spyOn(res, 'status').mockReturnValue(res);

        await createUser(req, res);

        // Assertions for successful user creation
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User Successfully Created',
            username: savedUser.username,
        });
    });




    it.only('should return an error if user already exists', async () => {
        // Mock User.findOne to return an existing user
        User.findOne.mockResolvedValue({ username: 'testuser' });

        await createUser(req, res, next);

        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists' });
    });

    it.only('should return validation errors', async () => {
        // Mock validationResult to return validation errors
        validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Validation error' }] });

        await createUser(req, res, next);

        expect(validationResult).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Validation error' }] });
    });

    it.only('should return internal server error for any other errors', async () => {
        // Mock an internal server error
        const error = new Error('Internal Server Error');
        User.findOne.mockRejectedValue(error);

        await createUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});
