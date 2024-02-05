const BlogPostModel = require("../src/models/BlogPostModel");
const MostPopularBlog = require("../src/controllers/BlogPostControllers/MostPopularBlog");

describe('MostPopularBlogController', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should retrieve the most popular blog posts', async () => {
        // Mock data for popular blog posts
        const popularBlogPostsMock = [
            { title: 'Blog Post 1', views: 100 },
            { title: 'Blog Post 2', views: 90 },
            { title: 'Blog Post 3', views: 80 },
            { title: 'Blog Post 4', views: 70 },
            { title: 'Blog Post 5', views: 60 },
        ];

        // Mock the find and sort methods of BlogPostModel
        jest.spyOn(BlogPostModel, 'find').mockReturnValue({
            sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(popularBlogPostsMock)
            })
        });

        // Call the controller
        await MostPopularBlog(req, res);

        // Assertions
        expect(res.json).toHaveBeenCalledWith(popularBlogPostsMock);
    });

    it('should handle internal server error', async () => {
        // Mock an error during database query
        jest.spyOn(BlogPostModel, 'find').mockImplementationOnce(() => {
            throw new Error('Simulated Database Error');
        });

        // Call the controller
        await MostPopularBlog(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });


    it('should handle empty result set', async () => {
        // Mock the find and sort methods of BlogPostModel to return an empty array
        jest.spyOn(BlogPostModel, 'find').mockReturnValue({
            sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([])
            })
        });

        // Call the controller
        await MostPopularBlog(req, res);

        // Assertions for empty result set
        expect(res.json).toHaveBeenCalledWith([]);
    });

});
