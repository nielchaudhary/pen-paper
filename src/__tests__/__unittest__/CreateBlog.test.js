const jwt = require('jsonwebtoken');
const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
const { validationResult } = require('express-validator');
const newBlog = require('../../controllers/BlogPostControllers/CreateNewBlog');
const updateBlog = require("../../controllers/BlogPostControllers/UpdateBlog");
jest.mock('express-validator', () => ({
    validationResult: jest.fn()
}));

describe('newBlog function', () => {
    let req, res, mockUser;

    beforeEach(() => {
        // Mock req and res objects
        req = {
            cookies: {
                jwtToken: 'mocked-jwt-token'
            },
            body: {
                title: 'Test Title',
                content: 'Test Content',
                category: 'Test Category'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock validationResult
        validationResult.mockReturnValue({ isEmpty: () => true });

        // Mock User.findById to return a user
        mockUser = {
            _id: 'mocked-user-id',
            blogs: [],
            save: jest.fn().mockResolvedValue()
        };
        jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

        // Mock jwt.verify
        jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'mocked-user-id' });

        // Mock BlogPost.save
        jest.spyOn(BlogPost.prototype, 'save').mockResolvedValue();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and the new blog post on success', async () => {
        await newBlog(req, res);

        expect(validationResult).toHaveBeenCalledWith(req);
        expect(User.findById).toHaveBeenCalledWith('mocked-user-id');
        expect(jwt.verify).toHaveBeenCalledWith('mocked-jwt-token', process.env.SECRET_KEY);
        expect(BlogPost.prototype.save).toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            Message: 'New Blog Added',
            Blog: expect.any(Object) // You might want to validate the structure of the returned Blog object here
        });
    });




    it('should return a 400 error if user is not found', async () => {
        // Mock JWT verification to return a decoded token with valid userId
        const decodedToken = { userId: 'userId123' };
        jwt.verify.mockReturnValue(decodedToken);

        // Mock User.findById to return null, indicating user not found
        User.findById.mockResolvedValue(null);

        await newBlog(req, res);

        expect(jwt.verify).toHaveBeenCalledWith('mocked-jwt-token', process.env.SECRET_KEY);
        expect(User.findById).toHaveBeenCalledWith('userId123');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return validation errors', async () => {
        // Mock validation errors
        validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Validation error' }] });

        await newBlog(req, res);

        expect(validationResult).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Validation error' }] });
    });

    test('should handle internal server error', async () => {
        // Mocking validation results
        validationResult.mockReturnValueOnce({ isEmpty: () => true });

        // Mocking jwt.verify to throw an error
        jwt.verify.mockImplementation(() => {
            throw new Error('Test error');
        });

        await newBlog(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });

    });

});
