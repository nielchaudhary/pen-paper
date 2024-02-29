// Import the necessary modules or classes
const { validationResult } = require('express-validator');
const BlogPostModel = require('../../models/BlogPostModel'); // Assuming this is where your model is imported from
const LatestNBlogs = require('../../controllers/BlogPostControllers/LatestNBlogs');

let req, res;

beforeEach(() => {
    req = {
        query: {}, // Example query parameter
    };
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    // validationResult.mockReturnValue({ isEmpty: () => true });
});

// Your test case
test('Test LatestNBlogs function', async () => {
    // Spy on the methods
    const findSpy = jest.spyOn(BlogPostModel, 'find');

    // Define fake data
    const fakeBlogPosts = [{ title: 'Post 1' }, { title: 'Post 2' }];
    const numberOfPosts = 2;

    // Mock resolved value for BlogPostModel.find
    BlogPostModel.find.mockResolvedValueOnce(fakeBlogPosts);

    // Mock request object
    const req = {
        query: { N: numberOfPosts },
    };

    // Call the function under test
    await LatestNBlogs(req, res);

    // Assertions
    // expect(validationResult).toHaveBeenCalledWith(req);
    expect(findSpy).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        blogs: fakeBlogPosts,
    });

    // Clean up - restore the original methods
    findSpy.mockRestore();
});
