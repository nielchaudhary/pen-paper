const User = require('../src/models/UserModel');
const deleteUser = require('../src/controllers/UserControllers/DeleteUser');

describe('deleteUser', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should delete an existing user successfully', async () => {
        // Valid username and password in request body
        req.body = { username: 'existinguser', password: 'testpassword' };

        // Mock User.findOne to simulate that the user exists
        const existingUser = {
            _id: '65c0b7d84714b027bed9443a',
            username: 'existinguser',
            password: 'testpassword',
            blogs: [],
        };
        jest.spyOn(User, 'findOne').mockResolvedValue(existingUser);

        // Mock User.findOneAndDelete to simulate successful deletion
        jest.spyOn(User, 'findOneAndDelete').mockResolvedValueOnce(existingUser);

        // Ensure that deleteUser returns a JSON message upon successful deletion
        jest.spyOn(res, 'json').mockReturnValue(res);

        await deleteUser(req, res);

        // Assertions for successful user deletion
        expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should handle missing username during deletion', async () => {
        // Missing username in request body
        req.body = { password: 'testpassword' };

        // Ensure that deleteUser returns a 400 status code and an error message
        jest.spyOn(res, 'status').mockReturnValue(res);
        jest.spyOn(res, 'send').mockReturnValue(res);

        await deleteUser(req, res);

        // Assertions for missing username during deletion
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Both username and password are required to delete the account.');
    });

    it('should handle missing username during deletion', async () => {
        // Missing username in request body
        req.body = { username: 'testusername' };

        // Ensure that deleteUser returns a 400 status code and an error message
        jest.spyOn(res, 'status').mockReturnValue(res);
        jest.spyOn(res, 'send').mockReturnValue(res);

        await deleteUser(req, res);

        // Assertions for missing username during deletion
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Both username and password are required to delete the account.');
    });

    it('should handle internal server error during deletion', async () => {
        // Valid username and password in request body
        req.body = { username: 'existinguser', password: 'testpassword' };

        // Mock User.findOne to simulate that the user exists
        const existingUser = {
            _id: '65c0b7d84714b027bed9443a',
            username: 'existinguser',
            password: 'testpassword',
            blogs: [],
            UserCreatedAt : new Date(),
        };
        jest.spyOn(User, 'findOne').mockResolvedValue(existingUser);

        // Mock User.findOneAndDelete to simulate an internal server error during deletion
        jest.spyOn(User, 'findOneAndDelete').mockImplementation(() => {
            throw new Error('Simulated internal server error during deletion');
        });

        // Ensure that deleteUser returns a 500 status code and an error message
        jest.spyOn(res, 'status').mockReturnValue(res);
        jest.spyOn(res, 'json').mockReturnValue(res);

        await deleteUser(req, res);

        // Assertions for internal server error during deletion
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should handle user not found during deletion', async () => {
        // Non-existent username and password in request body
        req.body = { username: 'nonexistentuser', password: 'testpassword' };

        // Mock User.findOne to simulate that the user does not exist
        jest.spyOn(User, 'findOne').mockResolvedValue(null);

        // Ensure that deleteUser returns a 400 status code and an error message
        jest.spyOn(res, 'status').mockReturnValue(res);
        jest.spyOn(res, 'json').mockReturnValue(res);

        await deleteUser(req, res);

        // Assertions for user not found during deletion
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'User does not exist' });
    });

    it('should handle invalid password during deletion', async () => {
        // Valid username and incorrect password in request body
        req.body = { username: 'existinguser', password: 'incorrectpassword' };

        // Mock User.findOne to simulate that the user exists
        const existingUser = {
            _id: '65c0b7d84714b027bed9443a',
            username: 'existinguser',
            password: 'correcthashedpassword', // Use the correct hashed password here
            blogs: [],
            UserCreatedAt : new Date(),
        };
        jest.spyOn(User, 'findOne').mockResolvedValue(existingUser);

        // Ensure that deleteUser returns a 401 status code and an error message
        jest.spyOn(res, 'status').mockReturnValue(res);
        jest.spyOn(res, 'json').mockReturnValue(res);

        await deleteUser(req, res);

        // Assertions for invalid password during deletion
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' });
    });








});
