const express = require('express');
const app = express();
const compression = require('compression');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const dbConnect = require('../config/dbconnect');
const userRoutes = require('./router/UserRoutes');
const blogRoutes = require('./router/BlogRoutes');
dbConnect();

app.use(compression());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
