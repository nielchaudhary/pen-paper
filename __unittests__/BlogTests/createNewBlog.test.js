const jwt = require('jsonwebtoken');
const BlogPost = require('../../src/models/BlogPostModel');
const User = require('../../src/models/UserModel');
const redis = require('redis-mock');
const newBlog = require('../../src/controllers/BlogPostControllers/CreateNewBlog');
const Redis = require("redis-mock");
const deleteBlog = require("../../src/controllers/BlogPostControllers/DeleteBlog");

jest.mock('jsonwebtoken');

describe('newBlog', () => {
    let req, res;

    beforeEach(() => {
        req = { body: { title: 'Test Title', content: 'Test Content', category: 'Test Category' } };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create a new blog', async () => {
        // Mock Redis methods
        const mockRedisClient = redis.createClient();
        jest.spyOn(mockRedisClient, 'get').mockResolvedValue('"mocked-jwt"');
        jest.spyOn(mockRedisClient, 'quit').mockResolvedValue();

        // Mock the createClient method to return our mockRedisClient
        jest.spyOn(redis, 'createClient').mockReturnValue(mockRedisClient);

        // Mock jwt.verify
        jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'mocked-user-id' });

        // Mock User.findById to return a user with a valid _id and empty blogs array
        jest.spyOn(User, 'findById').mockResolvedValue({ _id: 'mocked-user-id', blogs: [] });

        // Mock BlogPost.save
        jest.spyOn(BlogPost.prototype, 'save').mockResolvedValue();

        // Ensure that newBlog returns a 200 status code upon success
        jest.spyOn(res, 'status').mockReturnValue(res);

        await newBlog(req, res);

        // Basic Assertions
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
        expect(BlogPost.prototype.save).toHaveBeenCalled();
    });


    describe('newBlog function', () => {
        test('should return 400 status code if title is missing', async () => {
            const req = {
                body: {
                    // Omitting the title intentionally
                    content: 'Some content',
                    category: 'Some category',
                },
            };

            const res = {
                status: jest.fn(() => res),
                json: jest.fn(),
            };

            await newBlog(req, res);

            // Use await before assertions to ensure the asynchronous function has completed
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Title, content, and category are required' });
        });
    });

    describe('newBlog function', () => {
        test('should return 400 status code if content is missing', async () => {
            const req = {
                body: {
                    // Omitting the title intentionally
                    title: 'Some title',
                    category: 'Some category',
                },
            };

            const res = {
                status: jest.fn(() => res),
                json: jest.fn(),
            };

            await newBlog(req, res);

            // Use await before assertions to ensure the asynchronous function has completed
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Title, content, and category are required' });
        });
    });

    describe('newBlog function', () => {
        test('should return 400 status code if category is missing', async () => {
            const req = {
                body: {
                    // Omitting the title intentionally
                    content: 'Some content',
                    title: 'Some title',
                },
            };

            const res = {
                status: jest.fn(() => res),
                json: jest.fn(),
            };

            await newBlog(req, res);

            // Use await before assertions to ensure the asynchronous function has completed
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Title, content, and category are required' });
        });
    });

    it('should handle internal server error', async () => {
        // Mock Redis methods
        const mockRedisClient = redis.createClient();
        jest.spyOn(mockRedisClient, 'get').mockResolvedValue('"mocked-jwt"');
        jest.spyOn(mockRedisClient, 'quit').mockResolvedValue();

        // Mock the createClient method to return our mockRedisClient
        jest.spyOn(redis, 'createClient').mockReturnValue(mockRedisClient);

        // Mock jwt.verify
        jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'mocked-user-id' });

        // Mock User.findById to return a user with a valid _id and empty blogs array
        jest.spyOn(User, 'findById').mockResolvedValue({ _id: 'mocked-user-id', blogs: [] });

        // Mock BlogPost.save to throw an error
        jest.spyOn(BlogPost.prototype, 'save').mockRejectedValue(new Error('Simulated Error'));

        await newBlog(req, res);

        // Assertions for internal server error
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should handle user not found', async () => {
        // Mock Redis methods
        const mockRedisClient = redis.createClient();
        jest.spyOn(mockRedisClient, 'get').mockResolvedValue('"mocked-jwt"');
        jest.spyOn(mockRedisClient, 'quit').mockResolvedValue();

        // Mock the createClient method to return our mockRedisClient
        jest.spyOn(redis, 'createClient').mockReturnValue(mockRedisClient);

        // Mock jwt.verify
        jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'mocked-user-id' });

        // Mock User.findById to return null, simulating user not found
        jest.spyOn(User, 'findById').mockResolvedValue(null);

        await newBlog(req, res);

        // Assertions for user not found
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle Redis connection error', async () => {
        // Mock Redis.createClient to throw an error
        jest.spyOn(Redis, 'createClient').mockImplementation(() => {
            throw new Error('Simulated Redis connection error');
        });

        // Call the controller
        await newBlog(req, res);

        // Assertions for Redis connection error
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

});


