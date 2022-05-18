const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bycrypt = require('bcrypt');
const app = express();

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/WebTech2')
    .then(() => console.log('MongoDB Connected'));

const User = require('./models/user');
const Message = require('./models/message');

app.use(bodyParser.json());

app.get('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const resp = await User.findOne({ username, password })

    if (!resp) {
        return res.status(404).send('User not found');
    } else {
        // Make a session and log in user
        return res.status(200).send('User found');
    }

});

app.get('/api/user', async (req, res) => {
    const { id, _id } = req.query;
    const resp = await User.findOne({ $or: [{ id }, { _id }] }).select('-password');
    if (!resp) {
        return res.status(404).send('User not found');
    }

    res.status(200).send(resp);
});

app.get('/api/messages', async (req, res) => {
    const resp = await Message.find();
    res.status(200).send(resp);
});

app.post('/api/message', async (req, res) => {
    const { content, senderId } = req.body;
    const id = await Message.count();
    const timestamp = new Date();

    if (!content || !senderId) {
        return res.status(400).send('Invalid request');
    }

    if (!User.findOne({ id: senderId })) {
        return res.status(400).send('Sender not found');
    }

    if (content.length > 1000) {
        return res.status(400).send('Message too long');
    }

    const resp = await Message.create({ id, content, senderId, timestamp });
    return res.status(201).send(resp);
});

app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    const id = await User.count();

    bycrypt.hash(password, 10, async (err, hash) => {
        if (!err) {
            const resp = await User.create({ id, username, 'password': hash, email });
            return res.status(201).send(resp);
        } else {
            return res.status(500).send('Error: ' + err);
        }
    });
});

app.listen(1234, () => { console.log('Server is running on port 1234') });