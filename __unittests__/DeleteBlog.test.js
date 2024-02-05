const jwt = require('jsonwebtoken');
const Redis = require('redis-mock');
const deleteBlog = require('../src/controllers/BlogPostControllers/DeleteBlog');
const User = require('../src/models/UserModel');
const BlogPost = require('../src/models/BlogPostModel');
const redis = require("redis-mock");

jest.mock('jsonwebtoken');

describe('deleteBlog', () => {
    let req, res;

    beforeEach(() => {
        req = { query: { blogId: 'mocked-blog-id' } };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should delete the blog', async () => {
        // Mock Redis methods
        const mockRedisClient = Redis.createClient();
        jest.spyOn(mockRedisClient, 'get').mockResolvedValue('"mocked-jwt"');
        jest.spyOn(mockRedisClient, 'quit').mockResolvedValue();

        // Mock the createClient method to return our mockRedisClient
        jest.spyOn(Redis, 'createClient').mockReturnValue(mockRedisClient);

        // Mock jwt.verify
        jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'mocked-user-id' });

        // Mock User.findById to return a user with a valid _id and blogs array
        jest.spyOn(User, 'findById').mockResolvedValue({ _id: 'mocked-user-id', blogs: [] });

        // Mock BlogPost.findById to return a blog with a valid _id
        jest.spyOn(BlogPost, 'findById').mockResolvedValue({ _id: 'mocked-blog-id' });

        // Mock BlogPost.findByIdAndDelete

        jest.spyOn(BlogPost, 'findByIdAndDelete').mockResolvedValue();

        jest.spyOn(res, 'status').mockReturnValue(res);

        await deleteBlog(req, res);

        // Assertions for successful blog deletion
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Blog deleted successfully',
            DeletedBlog: { _id: 'mocked-blog-id' },
        });

    });

    it('should handle internal server error', async () => {
        // Mock Redis methods
        const mockRedisClient = Redis.createClient();
        jest.spyOn(mockRedisClient, 'get').mockResolvedValue('"mocked-jwt"');
        jest.spyOn(mockRedisClient, 'quit').mockResolvedValue();

        // Mock the createClient method to return our mockRedisClient
        jest.spyOn(Redis, 'createClient').mockReturnValue(mockRedisClient);

        // Mock jwt.verify
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(new Error('Simulated Error'), null);
        });

        // Ensure that deleteBlog returns a 500 status code upon internal server error
        jest.spyOn(res, 'status').mockReturnValue(res);

        await deleteBlog(req, res);

        // Assertions for internal server error
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should handle missing userId', async () => {
        // Mock Redis methods
        const mockRedisClient = redis.createClient();
        jest.spyOn(mockRedisClient, 'get').mockResolvedValue('"mocked-jwt"');
        jest.spyOn(mockRedisClient, 'quit').mockResolvedValue();

        // Mock the createClient method to return our mockRedisClient
        jest.spyOn(redis, 'createClient').mockReturnValue(mockRedisClient);

        // Mock jwt.verify without userId to simulate userId not found
        jest.spyOn(jwt, 'verify').mockReturnValue({});

        // Call the controller
        await deleteBlog(req, res);

        // Assertions for userId not found
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Both UserId and BlogId are required' });
    });

    it('should handle missing blogId', async () => {
        // Mock Redis methods
        const mockRedisClient = redis.createClient();
        jest.spyOn(mockRedisClient, 'get').mockResolvedValue('"mocked-jwt"');
        jest.spyOn(mockRedisClient, 'quit').mockResolvedValue();

        // Mock the createClient method to return our mockRedisClient
        jest.spyOn(redis, 'createClient').mockReturnValue(mockRedisClient);

        // Mock jwt.verify with a valid userId
        jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'mocked-user-id' });

        // Mock User.findById to return a valid user
        jest.spyOn(User, 'findById').mockResolvedValue({ _id: 'mocked-user-id', blogs: ['existing-blog-id'] });

        // Call the controller without providing blogId in the request
        await deleteBlog({ query: {} }, res);

        // Assertions for missing blogId
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Both UserId and BlogId are required' });
    });

    it('should handle blog not found', async () => {
        // Mock Redis methods
        const mockRedisClient = redis.createClient();
        jest.spyOn(mockRedisClient, 'get').mockResolvedValue('"mocked-jwt"');
        jest.spyOn(mockRedisClient, 'quit').mockResolvedValue();

        // Mock the createClient method to return our mockRedisClient
        jest.spyOn(redis, 'createClient').mockReturnValue(mockRedisClient);

        // Mock jwt.verify with a valid userId
        jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'mocked-user-id' });

        // Mock User.findById to return a user with a valid _id
        jest.spyOn(User, 'findById').mockResolvedValue({ _id: 'mocked-user-id', blogs: ['existing-blog-id'] });

        // Mock BlogPost.findById to return null, simulating blogId not found
        jest.spyOn(BlogPost, 'findById').mockResolvedValue(null);

        // Call the controller
        await deleteBlog(req, res);

        // Assertions for blogId not found
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Blog not found' });
    });

    it('should handle user not found', async () => {
        // Mock Redis methods
        const mockRedisClient = redis.createClient();
        jest.spyOn(mockRedisClient, 'get').mockResolvedValue('"mocked-jwt"');
        jest.spyOn(mockRedisClient, 'quit').mockResolvedValue();

        // Mock the createClient method to return our mockRedisClient
        jest.spyOn(redis, 'createClient').mockReturnValue(mockRedisClient);

        // Mock jwt.verify with a valid userId
        jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'mocked-user-id' });

        // Mock User.findById to return a user with a valid _id
        jest.spyOn(User, 'findById').mockResolvedValue();


        // Call the controller
        await deleteBlog(req, res);

        // Assertions for blogId not found
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });


    it('should handle Redis connection error', async () => {
        // Mock Redis.createClient to throw an error
        jest.spyOn(Redis, 'createClient').mockImplementation(() => {
            throw new Error('Simulated Redis connection error');
        });

        // Call the controller
        await deleteBlog(req, res);

        // Assertions for Redis connection error
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    // Add the new test case here
    it('should delete the blog in the database', async () => {
        // Mock Redis methods
        const mockRedisClient = redis.createClient();
        jest.spyOn(mockRedisClient, 'get').mockResolvedValue('"mocked-jwt"');
        jest.spyOn(mockRedisClient, 'quit').mockResolvedValue();

        // Mock the createClient method to return our mockRedisClient
        jest.spyOn(redis, 'createClient').mockReturnValue(mockRedisClient);

        // Mock jwt.verify
        jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'mocked-user-id' });

        // Mock User.findById to return a user with a valid _id and blogs array
        const mockedUser = {
            _id: 'mocked-user-id',
            blogs: ['mocked-blog-id'],
            save: jest.fn(), // Mock the save method
        };
        jest.spyOn(User, 'findById').mockResolvedValue(mockedUser);

        // Mock BlogPost.findById to return a blog with a valid _id
        const mockedBlog = {
            _id: 'mocked-blog-id',
            title: 'Mocked Title',
            content: 'Mocked Content',
            category: 'Mocked Category',
        };
        jest.spyOn(BlogPost, 'findById').mockResolvedValue(mockedBlog);

        // Mock BlogPost.findByIdAndDelete
        jest.spyOn(BlogPost, 'findByIdAndDelete').mockResolvedValue(mockedBlog);

        // Call the controller
        await deleteBlog(req, res);

        // Assertions for successful blog deletion
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Blog deleted successfully',
            DeletedBlog: {
                _id: 'mocked-blog-id',
                title: 'Mocked Title',
                content: 'Mocked Content',
                category: 'Mocked Category',
            },
        });

        // Assertions for save being called
        expect(mockedUser.save).toHaveBeenCalled();
    });


    it('should handle missing jwt value', async () => {
        // Mock Redis methods
        const mockRedisClient = Redis.createClient();
        jest.spyOn(mockRedisClient, 'get').mockResolvedValue(null); // Simulate missing JWT value
        jest.spyOn(mockRedisClient, 'quit').mockResolvedValue();

        // Mock the createClient method to return our mockRedisClient
        jest.spyOn(Redis, 'createClient').mockReturnValue(mockRedisClient);

        // Call the controller
        await deleteBlog(req, res);

        // Assertions for missing jwt value
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });



});
