const updateBlog = require('../../controllers/BlogPostControllers/updateBlog');
const User = require('../../models/UserModel');
const BlogPost = require('../../models/BlogPostModel');
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');

jest.mock('../../models/UserModel');
jest.mock('../../models/BlogPostModel');
jest.mock('jsonwebtoken');
jest.mock('express-validator');

describe('updateBlog function', () => {
    let req, res, mockUser, mockBlog;

    beforeEach(() => {
        req = {
            cookies: {
                jwtToken: 'mocked-jwt-token'
            },
            query: {
                blogId: 'mocked-blog-id'
            },
            body: {
                title: 'Updated Title',
                content: 'Updated Content',
                category: 'Updated Category'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        validationResult.mockReturnValue({ isEmpty: () => true });

        mockUser = {
            _id: 'mocked-user-id',
            blogs: [],
            save: jest.fn().mockResolvedValue()
        };
        User.findById.mockResolvedValue(mockUser);

        mockBlog = {
            _id: 'mocked-blog-id',
            createdByUser: 'mocked-user-id',
            title: 'Original Title',
            content: 'Original Content',
            category: 'Original Category',
            save: jest.fn().mockResolvedValue()
        };
        BlogPost.findById.mockResolvedValue(mockBlog);

        jwt.verify.mockReturnValue({ userId: 'mocked-user-id' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should update blog successfully', async () => {
        await updateBlog(req, res);

        expect(User.findById).toHaveBeenCalledWith('mocked-user-id');
        expect(BlogPost.findById).toHaveBeenCalledWith('mocked-blog-id');
        expect(mockBlog.title).toBe('Updated Title');
        expect(mockBlog.content).toBe('Updated Content');
        expect(mockBlog.category).toBe('Updated Category');
        expect(mockBlog.updatedAt).toBeDefined();
        expect(mockBlog.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Blog updated successfully', updatedBlog: mockBlog });
    });



    test('should return 403 error if user is not authorized to update the blog', async () => {
        // Mock JWT verification to return a different user ID
        jwt.verify.mockReturnValueOnce({ userId: 'different-user-id' });

        await updateBlog(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to update this blog' });

    });


    test('should return 400 error if user is not found', async () => {
        // Mock User.findById to return null, indicating user not found
        User.findById.mockResolvedValueOnce(null);

        await updateBlog(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        expect(BlogPost.findById).not.toHaveBeenCalled();
    });


    test('should return 400 error if blog is not found', async () => {
        // Mock User.findById to return a user
        const mockUser = { _id: 'mocked-user-id', blogs: [], save: jest.fn().mockResolvedValue() };
        User.findById.mockResolvedValueOnce(mockUser);

        // Mock BlogPost.findById to return null, indicating blog not found
        BlogPost.findById.mockResolvedValueOnce(null);

        await updateBlog(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Blog not found' });
    });

    test('should return 500 error if internal server error occurs', async () => {
        // Mocking validation results
        validationResult.mockReturnValueOnce({ isEmpty: () => true });

        // Mocking jwt.verify to throw an error
        jwt.verify.mockImplementation(() => {
            throw new Error('Test error');
        });

        await updateBlog(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        expect(User.findById).not.toHaveBeenCalled();
        expect(BlogPost.findById).not.toHaveBeenCalled();
    });

    // Write additional test cases for validation errors and internal server errors if needed
});
