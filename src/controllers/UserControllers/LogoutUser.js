const logoutUser = (req, res) => {
    // Clear the JWT token cookie
    res.clearCookie('jwtToken');

    // Respond with a success message
    return res.status(200).json({ Success: "User logged out successfully." });
};

module.exports = logoutUser;
