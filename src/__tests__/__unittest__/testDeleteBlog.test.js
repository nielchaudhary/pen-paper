const deleteBlog = require('../../controllers/BlogPostControllers/DeleteBlog'); // Assuming the controller is in a file named deleteBlog.js
const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Mocking the required modules
jest.mock('../../models/UserModel');
jest.mock('../../models/BlogPostModel');
jest.mock('jsonwebtoken');
jest.mock('express-validator');

describe('deleteBlog controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            cookies: {
                jwtToken: 'mockToken'
            },
            query: {
                blogId: 'mockBlogId'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should delete blog successfully when user is authorized', async () => {
        const mockDecoded = { userId: 'mockUserId' };
        const mockUser = {
            _id: 'mockUserId',
            blogs: ['mockBlogId'],
            save: jest.fn()
        };
        const mockBlog = {
            _id: 'mockBlogId',
            createdByUser: 'mockUserId',
            title: 'Mock Blog Title'
        };

        // Mocking validation results
        validationResult.mockReturnValueOnce({ isEmpty: () => true });

        // Mocking jwt.verify
        jwt.verify.mockResolvedValueOnce(mockDecoded);

        // Mocking User.findById
        User.findById.mockResolvedValueOnce(mockUser);

        // Mocking BlogPost.findById
        BlogPost.findById.mockResolvedValueOnce(mockBlog);

        await deleteBlog(req, res);

        expect(User.findById).toHaveBeenCalledWith(mockDecoded.userId);
        expect(BlogPost.findById).toHaveBeenCalledWith(req.query.blogId);
        expect(mockUser.blogs).not.toContain(mockBlog._id);
        expect(mockUser.save).toHaveBeenCalled();
        expect(BlogPost.findByIdAndDelete).toHaveBeenCalledWith(mockBlog._id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Blog deleted successfully',
            DeletedBlog: {
                id: mockBlog._id,
                blogTitle: mockBlog.title
            }
        });
    });

    it('should return validation errors', async () => {
        // Mock validation errors
        validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Validation error' }] });

        await deleteBlog(req, res);

        expect(validationResult).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Validation error' }] });
    });


// In the testDeleteBlog.test.js file

    test('should handle internal server error', async () => {
        // Mocking validation results
        validationResult.mockReturnValueOnce({ isEmpty: () => true });

        // Mocking jwt.verify to throw an error
        jwt.verify.mockRejectedValueOnce(new Error('Test error'));

        await deleteBlog(req, res);

        expect(validationResult).toHaveBeenCalled();
        expect(jwt.verify).toHaveBeenCalledWith(req.cookies.jwtToken, process.env.SECRET_KEY);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        expect(User.findById).not.toHaveBeenCalled();
        expect(BlogPost.findById).not.toHaveBeenCalled();
    });


    it('should return 403 error if user is not authorized to delete the blog', async () => {
        // Mock req.cookies.jwtToken to ensure it returns 'mocked-jwt-token'
        req.cookies.jwtToken = 'mocked-jwt-token';

        // Mock validation results
        validationResult.mockReturnValueOnce({ isEmpty: () => true });

        // Mock jwt.verify
        jwt.verify.mockReturnValueOnce({ userId: 'mocked-user-id' });

        // Mock User.findById to return a user
        const mockUser = {
            _id: 'mocked-user-id',
            blogs: [],
            save: jest.fn().mockResolvedValue()
        };
        jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

        // Mock BlogPost.findById to return a blog created by another user
        const mockBlog = {
            _id: 'mocked-blog-id',
            createdByUser: 'other-user-id', // Assuming another user created this blog
            title: 'Test Blog Title'
        };
        jest.spyOn(BlogPost, 'findById').mockResolvedValue(mockBlog);

        await deleteBlog(req, res);

        expect(validationResult).toHaveBeenCalled();
        expect(User.findById).toHaveBeenCalledWith('mocked-user-id');
        expect(jwt.verify).toHaveBeenCalledWith('mocked-jwt-token', process.env.SECRET_KEY);
        expect(BlogPost.findById).toHaveBeenCalledWith('mockBlogId');
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to delete this blog' });
    });


});
