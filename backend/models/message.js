const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: String,
    senderId: String,
    timestamp: Date,
    content: String
});

const message = mongoose.model('Message', messageSchema);

module.exports = message;