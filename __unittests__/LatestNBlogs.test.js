const BlogPostModel = require("../src/models/BlogPostModel");
const LatestNBlogs = require("../src/controllers/BlogPostControllers/LatestNBlogs");

describe('LatestNBlogs', () => {
    let req, res;

    beforeEach(() => {
        jest.setTimeout(10000); // 10 seconds

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

    it('should retrieve the latest 5 blog posts by default', async () => {
        const latestBlogsMock = [{ /* Mocked Blog Post Object */}];
        jest.spyOn(BlogPostModel, 'find').mockReturnValue({
            sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(latestBlogsMock)
            })
        });

        await LatestNBlogs(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Latest 5 Blog Posts',
            blogs: latestBlogsMock,
        });
    });

    it('should retrieve the specified number of latest blog posts', async () => {
        const numberOfPosts = 8;
        req.query.N = numberOfPosts;

        const latestBlogsMock = Array.from({length: numberOfPosts}, (_, index) => ({ /* Mocked Blog Post Object with unique data */}));
        jest.spyOn(BlogPostModel, 'find').mockReturnValue({
            sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(latestBlogsMock)
            })
        });

        await LatestNBlogs(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: `Latest ${numberOfPosts} Blog Posts`,
            blogs: latestBlogsMock,
        });
    });


    it('should handle database query error', async () => {
        const errorMessage = 'Simulated Database Error';
        jest.spyOn(BlogPostModel, 'find').mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });

        await LatestNBlogs(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'New Server Error'});
    });


})




