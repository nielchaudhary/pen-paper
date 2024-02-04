const BlogPostModel = require("../src/models/BlogPostModel");
const MostPopularBlogController = require("../src/controllers/BlogPostControllers/MostPopularBlog");

jest.mock("../src/models/BlogPostModel");

describe("MostPopularBlogController", () => {
    it("should fetch the most popular blog posts", async () => {
        // Mock request and response objects
        const req = {};
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        // Mock the data to be returned by BlogPostModel.find
        const popularBlogPosts = [
            { _id: "blog1", title: "Popular Blog 1", views: 100 },
            { _id: "blog2", title: "Popular Blog 2", views: 90 },
            { _id: "blog3", title: "Popular Blog 3", views: 80 },
            { _id: "blog4", title: "Popular Blog 4", views: 70 },
            { _id: "blog5", title: "Popular Blog 5", views: 60 },
        ];
        BlogPostModel.find.mockResolvedValueOnce(popularBlogPosts);

        // Call the controller function
        await MostPopularBlogController(req, res);

        // Assertions
        expect(BlogPostModel.find).toHaveBeenCalledWith();
        expect(res.json).toHaveBeenCalledWith(popularBlogPosts);
    });
});
