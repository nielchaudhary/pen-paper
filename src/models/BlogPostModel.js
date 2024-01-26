const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const blogPostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdByUser: {
        type: Types.ObjectId,
        ref: 'User', // Reference the User model by name
    },
});

blogPostSchema.index({ 'createdAt': -1 });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
