const BlogPostModel = require('../src/models/BlogPostModel');
const SearchBlogs = require('../src/controllers/BlogPostControllers/SearchBlogs'); // Adjust the path accordingly

describe('SearchBlogs Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {
                search: 'yourSearchQuery',
            },
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return matching blog posts based on the search query', async () => {
        // Mock data for matching blog posts
        const matchingPosts = [
            { _id: '1', title: 'Matching Blog 1', content: 'Content 1', category: 'Category 1' },
            { _id: '2', title: 'Matching Blog 2', content: 'Content 2', category: 'Category 2' },
        ];

        // Mock the find method of BlogPostModel to resolve with matching posts
        jest.spyOn(BlogPostModel, 'find').mockResolvedValue(matchingPosts);

        // Call the controller
        await SearchBlogs(req, res);

        // Assertions
        expect(BlogPostModel.find).toHaveBeenCalledWith({
            $or: [
                { title: { $regex: /yourSearchQuery/i } },
                { content: { $regex: /yourSearchQuery/i } },
                { category: { $regex: /yourSearchQuery/i } },
            ],
        });
        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({ blogPosts: matchingPosts });
    });


    it('should return an empty array for an empty search query', async () => {
        // Set an empty search query in the request
        req.query.search = '';

        // Mock the find method of BlogPostModel to resolve with an empty array
        jest.spyOn(BlogPostModel, 'find').mockResolvedValue([]);

        // Call the controller
        await SearchBlogs(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Search query is required.' });
    });

    it('should perform a case-insensitive search', async () => {
        // Set a search query in mixed case in the request
        req.query.search = 'CaSE-InSenSitive';

        // Mock the find method of BlogPostModel to resolve with mock data
        const mockBlogPosts = [{ title: 'Case-Insensitive Blog', content: 'Some content' }];
        jest.spyOn(BlogPostModel, 'find').mockResolvedValue(mockBlogPosts);

        // Call the controller
        await SearchBlogs(req, res);

        // Assertions
        expect(BlogPostModel.find).toHaveBeenCalledWith({
            $or: [
                { title: { $regex: /CaSE-InSenSitive/i } },
                { content: { $regex: /CaSE-InSenSitive/i } },
                { category: { $regex: /CaSE-InSenSitive/i } },
            ],
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ blogPosts: mockBlogPosts });
    });
    it('should handle no matching blog posts', async () => {
        // Set a search query in the request
        req.query.search = 'NonExistentQuery';

        // Mock the find method of BlogPostModel to resolve with an empty array
        jest.spyOn(BlogPostModel, 'find').mockResolvedValue([]);

        // Call the controller
        await SearchBlogs(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ blogPosts: [] });
    });
    it('should handle database query error', async () => {
        // Set a search query in the request
        req.query.search = 'QueryWithError';

        // Mock the find method of BlogPostModel to reject with an error
        const errorMessage = 'Simulating database query error';
        jest.spyOn(BlogPostModel, 'find').mockRejectedValue(new Error(errorMessage));

        // Call the controller
        await SearchBlogs(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });


});
