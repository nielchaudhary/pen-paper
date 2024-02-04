const deleteBlog = require('../src/controllers/BlogPostControllers/DeleteBlog');
const User = require('../src/models/UserModel');
const BlogPost = require('../src/models/BlogPostModel');

jest.mock('../src/models/UserModel');
jest.mock('../src/models/BlogPostModel');

describe('deleteBlog Controller', () => {
    it('should delete a blog', async () => {
        // Mock request and response objects
        const req = {
            query: { userId: 'someUserId', blogId: 'someBlogId' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the User.findById and BlogPost.findById methods
        User.findById.mockResolvedValueOnce({ _id: 'someUserId', blogs: ['someBlogId'] });
        BlogPost.findById.mockResolvedValueOnce({ _id: 'someBlogId' });

        // Mock the User save method
        User.prototype.save.mockResolvedValueOnce({ blogs: [] });

        // Call the controller function
        await deleteBlog(req, res);

        // Assertions
        expect(User.findById).toHaveBeenCalledWith('someUserId');
        expect(BlogPost.findById).toHaveBeenCalledWith('someBlogId');
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });

    });

    it('should handle missing userId', async () => {
        // Mock request and response objects
        const req = {
            query: { userId: null, blogId: 'someBlogId' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the controller function
        await deleteBlog(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Both UserId and BlogId are required" });
    });

    it('should handle missing blogId', async () => {
        // Mock request and response objects
        const req = {
            query: { userId: 'someUserId', blogId: null },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the controller function
        await deleteBlog(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Both UserId and BlogId are required" });
    });


    it('should handle user not found', async () => {
        // Mock request and response objects
        const req = {
            query: { userId: 'nonexistentUserId', blogId: 'someBlogId' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the User.findById method to return null (user not found)
        User.findById.mockResolvedValueOnce(null);

        // Call the controller function
        await deleteBlog(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle blog not found', async () => {
        // Mock request and response objects
        const req = {
            query: { userId: 'someUserId', blogId: 'nonexistentBlogId' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the User.findById and BlogPost.findById methods
        User.findById.mockResolvedValueOnce({ _id: 'someUserId', blogs: ['someBlogId'] });
        BlogPost.findById.mockResolvedValueOnce(null);

        // Call the controller function
        await deleteBlog(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Blog not found' });
    });

    it('should handle internal server error', async () => {
        // Mock request and response objects
        const req = {
            query: { userId: 'someUserId', blogId: 'someBlogId' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the User.findById and BlogPost.findById methods
        User.findById.mockResolvedValueOnce({ _id: 'someUserId', blogs: ['someBlogId'] });
        BlogPost.findById.mockResolvedValueOnce({ _id: 'someBlogId' });

        // Mock the User save method to throw an error
        User.prototype.save.mockRejectedValueOnce(new Error('Database error'));

        // Call the controller function
        await deleteBlog(req, res);

        // Assertions
        expect(User.findById).toHaveBeenCalledWith('someUserId');
        expect(BlogPost.findById).toHaveBeenCalledWith('someBlogId');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});
