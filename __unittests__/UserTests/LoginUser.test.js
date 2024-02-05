const jwt = require('jsonwebtoken');
const User = require('../../src/models/UserModel');
const loginUser = require('../../src/controllers/UserControllers/LoginUser');

const Redis = require('redis');

// Mocking the Redis client
jest.mock('redis', () => {
    return {
        createClient: jest.fn(() => ({
            connect: jest.fn(),
            setEx: jest.fn(),
        })),
    };
});

describe('loginUser', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should log in a user successfully and return a JWT', async () => {
        // Valid username and password in request body
        req.body = { username: 'testuser', password: 'testpassword' };

        // Mock User.findOne to simulate that the user exists
        const existingUser = {
            _id: '65c0b7d84714b027bed9443a',
            username: 'testuser',
            password: 'testpassword',
            blogs: [],
            UserCreatedAt : new Date(),
        };
        jest.spyOn(User, 'findOne').mockResolvedValue(existingUser);

        // Mock jwt.sign to simulate generating a JWT
        jest.spyOn(jwt, 'sign').mockReturnValue('mockedJWT');

        // Ensure that loginUser returns a JSON response with user details and a JWT
        jest.spyOn(res, 'json').mockReturnValue(res);

        try {
            await loginUser(req, res);
            // Assertions for successful user login
            expect(res.json).toHaveBeenCalledWith({
                Message: 'User Logged In Successfully',
                UserDetails: existingUser,
                JWT: 'mockedJWT',
            });
        }catch{

        }
    });
    it('should handle missing username during login', async () => {
        // Missing username in request body
        req.body = { password: 'testpassword' };

        // Ensure that loginUser returns a 400 status code and an error message
        jest.spyOn(res, 'status').mockReturnValue(res);
        jest.spyOn(res, 'send').mockReturnValue(res);

        await loginUser(req, res);

        // Assertions for missing username during login
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Username and Password is required for Logging In.');
    });

    it('should handle missing password during login', async () => {
        // Missing username in request body
        req.body = { username: 'testusername' };

        // Ensure that loginUser returns a 400 status code and an error message
        jest.spyOn(res, 'status').mockReturnValue(res);
        jest.spyOn(res, 'send').mockReturnValue(res);

        await loginUser(req, res);

        // Assertions for missing username during login
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Username and Password is required for Logging In.');
    });

    it('should handle user not found during login', async () => {
        // Valid username and password in request body
        req.body = { username: 'nonexistentuser', password: 'testpassword' };

        // Mock User.findOne to simulate that the user does not exist
        jest.spyOn(User, 'findOne').mockResolvedValue(null);

        // Ensure that loginUser returns a 401 status code and an error message
        jest.spyOn(res, 'status').mockReturnValue(res);
        jest.spyOn(res, 'json').mockReturnValue(res);

        await loginUser(req, res);

        // Assertions for user not found during login
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should handle JWT generation error during login', async () => {
        // Valid username and password in request body
        req.body = { username: 'testuser', password: 'testpassword' };

        // Mock User.findOne to simulate that the user exists
        const existingUser = {
            _id: '65c0b7d84714b027bed9443a',
            username: 'testuser',
            password: 'testpassword',
            blogs: [],
            UserCreatedAt: new Date(),
        };
        jest.spyOn(User, 'findOne').mockResolvedValue(existingUser);

        // Mock jwt.sign to simulate an error during JWT generation
        jest.spyOn(jwt, 'sign').mockImplementation(() => {
            throw new Error('Simulated JWT generation error');
        });

        // Ensure that loginUser returns a 500 status code and an error message
        jest.spyOn(res, 'status').mockReturnValue(res);
        jest.spyOn(res, 'json').mockReturnValue(res);

        await loginUser(req, res);

        // Assertions for JWT generation error during login
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should handle Redis connection error during login', async () => {
        // Valid username and password in request body
        req.body = { username: 'testuser', password: 'testpassword' };

        // Mock User.findOne to simulate that the user exists
        const existingUser = {
            _id: '65c0b7d84714b027bed9443a',
            username: 'testuser',
            password: 'testpassword',
            blogs: [],
        };
        jest.spyOn(User, 'findOne').mockResolvedValue(existingUser);

        // Mock Redis.createClient to simulate a Redis connection error
        jest.spyOn(Redis, 'createClient').mockImplementation(() => {
            throw new Error('Simulated Redis connection error');
        });

        // Ensure that loginUser returns a 500 status code and an error message
        jest.spyOn(res, 'status').mockReturnValue(res);
        jest.spyOn(res, 'json').mockReturnValue(res);

        await loginUser(req, res);

        // Assertions for Redis connection error during login
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should handle Redis setEx error during login', async () => {
        // Valid username and password in request body
        req.body = { username: 'testuser', password: 'testpassword' };

        // Mock User.findOne to simulate that the user exists
        const existingUser = {
            _id: '65c0b7d84714b027bed9443a',
            username: 'testuser',
            password: 'testpassword',
            blogs: [],
        };
        jest.spyOn(User, 'findOne').mockResolvedValue(existingUser);

        // Mock Redis.createClient and setEx to simulate a Redis setEx error
        const mockRedisClient = {
            connect: jest.fn(),
            setEx: jest.fn(() => {
                throw new Error('Simulated Redis setEx error');
            }),
        };
        jest.spyOn(Redis, 'createClient').mockReturnValue(mockRedisClient);

        // Ensure that loginUser returns a 500 status code and an error message
        jest.spyOn(res, 'status').mockReturnValue(res);
        jest.spyOn(res, 'json').mockReturnValue(res);

        await loginUser(req, res);

        // Assertions for Redis setEx error during login
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });




});
