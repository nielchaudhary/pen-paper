const express = require('express');
const app = express();
const compression = require('compression');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const dbConnect = require('../config/dbconnect');
const userRoutes = require('./router/UserRoutes');
const blogRoutes = require('./router/BlogRoutes');

// Establish MongoDB connection
dbConnect().then(() => {
    console.log('Connected to MongoDB!');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the application if unable to connect to MongoDB
});

app.use(cookieParser());


// Add compression middleware
app.use(compression());

// Add JSON body parser middleware
app.use(express.json());



// Mount user routes
app.use('/users', userRoutes);

// Mount blog routes
app.use('/blogs', blogRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
