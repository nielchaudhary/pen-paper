const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    UserCreatedAt: {
        type: Date,
        default: Date.now,
    },
    blogs: [
        {
            type: Types.ObjectId,
            ref: 'BlogPost', // Reference the BlogPost model by name
        },
    ],
});




const User = mongoose.model('User', userSchema);

module.exports = User;
