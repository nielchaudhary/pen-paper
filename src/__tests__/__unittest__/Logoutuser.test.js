const logoutUser = require('../../controllers/UserControllers/LogoutUser');

describe('Test logout user route', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn(),
        };
    });

    it('should clear JWT token cookie and return success message', () => {
        logoutUser(req, res);

        expect(res.clearCookie).toHaveBeenCalledWith('jwtToken');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ Success: 'User logged out successfully.' });
    });
});
