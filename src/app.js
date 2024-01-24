const express = require('express');
const app = express();
const dbConnect = require('../config/dbconnect');
const userRoutes = require('./router/UserRoutes');
const blogRoutes = require('./router/BlogRoutes');

dbConnect();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('This is the homePage');
});

app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
