const BlogPostModel = require("../src/models/BlogPostModel");
const ReadAllBlogs = require("../src/controllers/BlogPostControllers/ReadAllBlogs");

describe('ReadAllBlogsController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {},
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should retrieve the first page of blog posts with default perPage=5 when no query parameters are provided', async () => {
        // Mock data for the first page of blog posts
        const firstPageBlogPostsMock = [
            { title: 'Blog Post 1', content: 'Lorem ipsum 1', createdAt: new Date('2023-01-01') },
            { title: 'Blog Post 2', content: 'Lorem ipsum 2', createdAt: new Date('2023-02-01') },
            { title: 'Blog Post 3', content: 'Lorem ipsum 3', createdAt: new Date('2023-03-01') },
            { title: 'Blog Post 4', content: 'Lorem ipsum 4', createdAt: new Date('2023-04-01') },
            { title: 'Blog Post 5', content: 'Lorem ipsum 5', createdAt: new Date('2023-05-01') },
        ];

        // Mock the find, skip, limit, and sort methods of BlogPostModel for the first page
        jest.spyOn(BlogPostModel, 'find').mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(firstPageBlogPostsMock),
                }),
            }),
        });

        // Call the controller with no query parameters
        await ReadAllBlogs(req, res);

        // Assertions
        expect(res.json).toHaveBeenCalledWith({ page: 1, blogPosts: firstPageBlogPostsMock });
    });

    it('should retrieve a paginated list of blog posts sorted by creation date in descending order', async () => {
        // Mock data for paginated blog posts with different creation dates
        const paginatedBlogPostsMock = [
            { title: 'Blog Post 1', content: 'Lorem ipsum 1', createdAt: new Date('2023-01-01') },
            { title: 'Blog Post 2', content: 'Lorem ipsum 2', createdAt: new Date('2023-02-01') },
            { title: 'Blog Post 3', content: 'Lorem ipsum 3', createdAt: new Date('2023-03-01') },
            { title: 'Blog Post 4', content: 'Lorem ipsum 4', createdAt: new Date('2023-04-01') },
            { title: 'Blog Post 5', content: 'Lorem ipsum 5', createdAt: new Date('2023-05-01') },
        ];

        // Mock the find, skip, limit, and sort methods of BlogPostModel
        jest.spyOn(BlogPostModel, 'find').mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(paginatedBlogPostsMock),
                }),
            }),
        });

        // Call the controller
        await ReadAllBlogs(req, res);

        // Assertions
        expect(res.json).toHaveBeenCalledWith({ page: 1, blogPosts: paginatedBlogPostsMock });

        // Verify the correct sorting order using timestamps
        const sortedTimestamps = paginatedBlogPostsMock.map(post => post.createdAt.getTime());
        for (let i = 1; i < sortedTimestamps.length; i++) {
            expect(sortedTimestamps[i]).toBeGreaterThan(sortedTimestamps[i - 1]);
        }
    });


    it('should handle internal server error', async () => {
        // Mock an error during database query
        jest.spyOn(BlogPostModel, 'find').mockImplementationOnce(() => {
            throw new Error('Simulated Database Error');
        });

        // Call the controller
        await ReadAllBlogs(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should default to page 1 when page is 0', async () => {
        // Mock data for paginated blog posts
        const paginatedBlogPostsMock = [
            { title: 'Blog Post 1', content: 'Lorem ipsum 1', createdAt: new Date() },
            { title: 'Blog Post 2', content: 'Lorem ipsum 2', createdAt: new Date() },
            { title: 'Blog Post 3', content: 'Lorem ipsum 3', createdAt: new Date() },
            { title: 'Blog Post 4', content: 'Lorem ipsum 4', createdAt: new Date() },
            { title: 'Blog Post 5', content: 'Lorem ipsum 5', createdAt: new Date() },
        ];

        // Mock the find, skip, limit, and sort methods of BlogPostModel
        jest.spyOn(BlogPostModel, 'find').mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(paginatedBlogPostsMock),
                }),
            }),
        });

        // Set page=0 in the request
        req.query.page = 0;

        // Call the controller
        await ReadAllBlogs(req, res);

        // Assertions
        expect(res.json).toHaveBeenCalledWith({ page: 1, blogPosts: paginatedBlogPostsMock });
    });

    it('should handle pagination with insufficient posts', async () => {
        // Mock data for paginated blog posts with different creation dates
        const paginatedBlogPostsMock = [
            { title: 'Blog Post 1', content: 'Lorem ipsum 1', createdAt: new Date('2023-01-01') },
            { title: 'Blog Post 2', content: 'Lorem ipsum 2', createdAt: new Date('2023-02-01') },
        ];

        // Mock the find, skip, limit, and sort methods of BlogPostModel
        jest.spyOn(BlogPostModel, 'find').mockReturnValue({
            skip: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(paginatedBlogPostsMock),
                }),
            }),
        });

        // Set a large page number to request more posts than available
        req.query.page = 10;

        // Call the controller
        await ReadAllBlogs(req, res);

        // Assertions
        expect(res.json).toHaveBeenCalledWith({ page: 10, blogPosts: paginatedBlogPostsMock });
    });




    // Add more test cases as needed
});
