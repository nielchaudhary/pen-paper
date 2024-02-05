const BlogPostModel = require("../src/models/BlogPostModel");
const readSpecificBlog = require("../src/controllers/BlogPostControllers/ReadSpecificBlog");

describe('readSpecificBlogController', () => {
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

    it('should return the specific blog with the given blogId and increase views by 1', async () => {
        // Mock data for a specific blog
        const specificBlogMock = {
            _id: 'mockBlogId',
            title: 'Specific Blog',
            content: 'Lorem ipsum specific blog content',
            views: 5,  // initial views
            save: jest.fn().mockResolvedValue({
                // updated blog data after saving
                _id: 'mockBlogId',
                title: 'Specific Blog',
                content: 'Lorem ipsum specific blog content',
                views: 6,
            }),
        };

        // Mock the findById and save methods of BlogPostModel
        jest.spyOn(BlogPostModel, 'findById').mockResolvedValue(specificBlogMock);
        jest.spyOn(specificBlogMock, 'save').mockResolvedValue(specificBlogMock);

        // Set blogId in the request
        req.query.blogId = 'mockBlogId';

        // Call the controller
        await readSpecificBlog(req, res);

        // Assertions
        expect(BlogPostModel.findById).toHaveBeenCalledWith('mockBlogId');
        expect(specificBlogMock.views).toBe(6);  // views should be increased by 1
        expect(specificBlogMock.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(specificBlogMock);
    });

    it('should handle missing blogId in the request', async () => {
        // Call the controller without providing blogId
        await readSpecificBlog(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ Error: 'Please Provide Blog ID.' });
    });

    it('should handle incorrect blogId', async () => {
        // Mock data for an incorrect blogId
        jest.spyOn(BlogPostModel, 'findById').mockResolvedValue(null);

        // Set an incorrect blogId in the request
        req.query.blogId = 'incorrectBlogId';

        // Call the controller
        await readSpecificBlog(req, res);

        // Assertions
        expect(BlogPostModel.findById).toHaveBeenCalledWith('incorrectBlogId');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ Alert: 'Incorrect Blog ID' });
    });

    it('should handle internal server error', async () => {
        // Mock an error during database query
        jest.spyOn(BlogPostModel, 'findById').mockImplementationOnce(() => {
            throw new Error('Simulated Database Error');
        });

        // Set blogId in the request
        req.query.blogId = 'mockBlogId';

        // Call the controller
        await readSpecificBlog(req, res);

        // Assertions
        expect(BlogPostModel.findById).toHaveBeenCalledWith('mockBlogId');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should handle incorrect blogId format (non-string)', async () => {
        // Set a non-string blogId in the request
        req.query.blogId = 123; // Example: numeric blogId

        // Call the controller
        await readSpecificBlog(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ Error: 'Please Provide Blog ID.' });
    });

    it('should handle SQL injection attempt in blogId', async () => {
        // Set a blogId with SQL injection attempt in the request
        req.query.blogId = "1'; DROP TABLE BlogPosts; --";

        // Call the controller
        await readSpecificBlog(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error : 'Internal Server Error' });
        // Note: In a real-world scenario, you might want to handle SQL injection differently, e.g., logging and reporting.
    });


    // Add more test cases as needed
});
