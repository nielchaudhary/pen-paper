    // newBlog.test.js
    const newBlog = require('../src/controllers/BlogPostControllers/CreateNewBlog');
    const User = require('../src/models/UserModel');
    const BlogPost = require('../src/models/BlogPostModel');

    jest.mock('../src/models/UserModel');
    jest.mock('../src/models/BlogPostModel');

    describe('newBlog Controller', () => {
        it('should create a new blog post', async () => {
            // Mock request and response objects
            const req = {
                query: { userId: 'someUserId' },
                body: { title: 'Test Blog', content: 'Test Content', category: 'Test Category' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mock the User.findById method
            User.findById.mockResolvedValueOnce({ _id: 'someUserId', blogs: [] });

            // Mock the BlogPost save and User save methods
            BlogPost.prototype.save.mockResolvedValueOnce({ _id: 'someBlogId' });
            User.prototype.save.mockResolvedValueOnce({ blogs: ['someBlogId'] });

            // Call the controller function
            await newBlog(req, res);

            // Assertions
            expect(User.findById).toHaveBeenCalledWith('someUserId');
            expect(BlogPost).toHaveBeenCalledWith({
                title: 'Test Blog',
                content: 'Test Content',
                category: 'Test Category',
                createdByUser: 'someUserId',
            });

        });

        it('should handle missing content', async () => {
            // Mock request and response objects
            const req = {
                query: { userId: 'someUserId' },
                body: { title: 'Test Blog', content: null, category: 'Test Category' }, // Missing content
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Call the controller function
            await newBlog(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Content required' });
        });

        it('should handle missing title', async () => {
            // Mock request and response objects
            const req = {
                query: { userId: 'someUserId' },
                body: { title: null, content: 'Test Content', category: 'Test Category' }, // Missing title
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Call the controller function
            await newBlog(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Title Required' });
        });

        it('should handle missing category', async () => {
            // Mock request and response objects
            const req = {
                query: { userId: 'someUserId' },
                body: { title:'Test Title' , content: 'Test Content', category: null }, // Missing title
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Call the controller function
            await newBlog(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Category required'});
        });




        it('should handle user not found', async () => {
            // Mock request and response objects
            const req = {
                query: { userId: 'nonexistentUserId' },
                body: { title: 'Test Blog', content: 'Test Content', category: 'Test Category' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mock the User.findById method to return null (user not found)
            User.findById.mockResolvedValueOnce(null);

            // Call the controller function
            await newBlog(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });

        it('should handle internal server error', async () => {
            // Mock request and response objects
            const req = {
                query: { userId: 'someUserId' },
                body: { title: 'Test Blog', content: 'Test Content', category: 'Test Category' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mock the User.findById method
            User.findById.mockRejectedValueOnce(new Error('Database error'));

            // Call the controller function
            await newBlog(req, res);

            // Assertions
            expect(User.findById).toHaveBeenCalledWith('someUserId');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });
