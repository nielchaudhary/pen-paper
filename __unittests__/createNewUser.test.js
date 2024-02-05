const User = require('../src/models/UserModel');
const createUser = require('../src/controllers/UserControllers/CreateNewUser');


describe('createUser', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} }; // Reset request body before each test
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should handle missing username', async () => {
        // Missing username in request body
        req.body = { password: 'testpassword' };

        await createUser(req, res);

        // Assertions for missing username
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Username and Password is required.');
    });

    it('should handle missing password', async () => {
        // Missing password in request body
        req.body = { username: 'testuser' };

        await createUser(req, res);

        // Assertions for missing password
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Username and Password is required.');
    });

    it('should create a new user when both username and password are provided', async () => {
        // Valid username and password in request body
        req.body = { username: 'testuser', password: 'testpassword' };

        // Mock User.findOne to return null, simulating user not found
        jest.spyOn(User, 'findOne').mockResolvedValue(null);

        // Mock User.save
        const savedUser = {

            username: 'testuser',
            password: 'testpassword',

        };

        jest.spyOn(User.prototype, 'save').mockImplementation(async function () {
            // Simulate save method behavior

            this.username = savedUser.username;
            this.password = savedUser.password;

        });

        // Ensure that createUser returns a 200 status code upon success
        jest.spyOn(res, 'status').mockReturnValue(res);

        await createUser(req, res);

        // Format the expected date using a specific format (adjust as needed)


        // Assertions for successful user creation
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message : 'User Successfully Created',

            username: savedUser.username,
            password: savedUser.password,

        });
    });

    it('should handle existing user', async () => {
        // Existing username in request body
        req.body = { username: 'existinguser', password: 'testpassword' };

        // Mock User.findOne to simulate that the username already exists
        const existingUser = {
            _id: '65c0b7d84714b027bed9443a',
            username: 'existinguser',
            password: 'existingpassword',
            blogs: [],
        };
        jest.spyOn(User, 'findOne').mockResolvedValue(existingUser);

        await createUser(req, res);

        // Assertions for existing user
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists' });
    });

    it('should handle database save error', async () => {
        // Valid username and password in request body
        req.body = { username: 'testuser', password: 'testpassword' };

        // Mock User.findOne to return null, simulating user not found
        jest.spyOn(User, 'findOne').mockResolvedValue(null);

        // Mock User.save to simulate an error during the save process
        jest.spyOn(User.prototype, 'save').mockImplementation(async function () {
            throw new Error('Simulated save error');
        });

        // Ensure that createUser returns a 500 status code upon encountering an error
        jest.spyOn(res, 'status').mockReturnValue(res);

        await createUser(req, res);

        // Assertions for database save error
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });


});
