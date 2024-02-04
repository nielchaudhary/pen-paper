const BlogPostModel = require("../src/models/BlogPostModel");
const LatestNBlogs = require("../src/controllers/BlogPostControllers/LatestNBlogs")

jest.mock("../src/models/BlogPostModel");

describe("LatestNBlogs Controller", () => {
    it("should fetch the latest N blog posts", async () => {
        // Mock request and response objects
        const req = {
            query: { N: 3 }, // Example: Fetch the latest 3 blog posts
        };
        const res = {
            json: jest.fn(),
        };

        // Mock the data to be returned by BlogPostModel.find
        const latestBlogs = [
            { _id: "blog1", title: "Blog 1", content: "Content 1", createdAt: new Date() },
            { _id: "blog2", title: "Blog 2", content: "Content 2", createdAt: new Date() },
            { _id: "blog3", title: "Blog 3", content: "Content 3", createdAt: new Date() },
        ];
        BlogPostModel.find.mockResolvedValueOnce(latestBlogs);

        // Call the controller function
        await LatestNBlogs(req, res);

        // Assertions
        expect(BlogPostModel.find).toHaveBeenCalledWith();
        expect(res.json).toHaveBeenCalledWith({
            message: "Latest 3 Blog Posts",
            blogs: latestBlogs,
        });
    });

    it("should handle missing or invalid N value", async () => {
        // Mock request and response objects with missing N value
        const req = {
            query: {},
        };
        const res = {
            json: jest.fn(),

        };

        // Call the controller function
        await LatestNBlogs(req, res);

        // Assertions
        expect(res.json).toHaveBeenCalledWith({ error: "Enter the Number of Latest Blog Posts you want to retrieve" });
        expect(BlogPostModel.find).not.toHaveBeenCalled(); // Ensure find method is not called
    });


});
