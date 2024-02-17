const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

// Set up basic rate limiting (adjust as needed)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: 'Too many requests from this IP, please try again later.',
});

module.exports = limiter