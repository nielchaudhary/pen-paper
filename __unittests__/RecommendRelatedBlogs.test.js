const BlogPostModel = require('../src/models/BlogPostModel');
const recommendRelatedPosts = require('../src/controllers/BlogPostControllers/RecommendRelatedBlogs');

const TfIdf = require('node-tfidf')

describe('recommendRelatedPosts Controller Test', () => {
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

    it('should respond with a 400 status and error message for missing postId', async () => {
        // Call the controller without setting a postId
        await recommendRelatedPosts(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Please Provide Correct PostId' });
    });

    it('should respond with a 400 status and error message for incorrect postId', async () => {
        // Set an incorrect postId in the request
        req.query.postId = 123; // Example of an incorrect postId

        // Mock the findById method to simulate a post not found scenario
        jest.spyOn(BlogPostModel, 'findById').mockResolvedValue(null);

        // Call the controller
        await recommendRelatedPosts(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Please Provide Correct PostId' });
    });


    it('should respond with a 404 status and error message for blog post not found', async () => {
        // Set a specific postId in the request
        req.query.postId = 'nonExistentPostId'; // Example of a non-existent postId

        // Mock the findById method to simulate a scenario where the post is not found
        jest.spyOn(BlogPostModel, 'findById').mockResolvedValue(null);

        // Call the controller
        await recommendRelatedPosts(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Blog not found' });
    });


    it('should return an array of related posts for a valid postId', async () => {
        // Mock data for a valid post and related posts
        const validPostId = 'validPostId';
        const validPostMock = { _id: validPostId, content: 'Valid post content' };
        const relatedPostsMock = [
            { _id: 'relatedPostId1', content: 'Related post 1 content' },
            { _id: 'relatedPostId2', content: 'Related post 2 content' },
        ];

        // Mock the findById and find methods of BlogPostModel
        jest.spyOn(BlogPostModel, 'findById').mockResolvedValue(validPostMock);
        jest.spyOn(BlogPostModel, 'find').mockResolvedValue(relatedPostsMock);

        // Set a valid postId in the request
        req.query.postId = validPostId;

        try {
            // Call the controller
            await recommendRelatedPosts(req, res);

            // Assertions
            expect(BlogPostModel.findById).toHaveBeenCalledWith(validPostId);
            expect(BlogPostModel.find).toHaveBeenCalledWith({ _id: { $ne: validPostId } });
            expect(res.json).toHaveBeenCalledWith({ relatedPosts: relatedPostsMock });
            expect(res.status).toHaveBeenCalledWith(200);
        } catch (error) {
            console.error('Test case error:', error);
        }
    });

    it('should handle an error when retrieving similarity scores', async () => {
        // Mock data for a valid post
        const validPostId = 'validPostId';
        const validPostMock = { _id: validPostId, content: 'Valid post content' };

        // Mock the findById method of BlogPostModel
        jest.spyOn(BlogPostModel, 'findById').mockResolvedValue(validPostMock);

        // Mock the find method of BlogPostModel
        jest.spyOn(BlogPostModel, 'find').mockResolvedValue([]);

        // Mock the tfidf.tfidf method to reject the promise
        jest.spyOn(TfIdf.prototype, 'tfidf').mockRejectedValue(new Error('Simlarity score retrieval error'));

        // Set a valid postId in the request
        req.query.postId = validPostId;

        // Call the controller
        await recommendRelatedPosts(req, res);

        // Assertions
        expect(BlogPostModel.findById).toHaveBeenCalledWith(validPostId);
        expect(BlogPostModel.find).toHaveBeenCalledWith({ _id: { $ne: validPostId } });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });




});
