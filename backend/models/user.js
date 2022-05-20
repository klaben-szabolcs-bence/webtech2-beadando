const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    email: String,
    admin: Boolean
});

const user = mongoose.model('User', userSchema);

module.exports = user;