const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bycrypt = require('bcrypt');
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'this-should-be-read-from-an-enviromental-variable',
    saveUninitialized: false,
    resave: false
}));

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/WebTech2')
    .then(() => console.log('MongoDB Connected'));

const User = require('./models/user');
const Message = require('./models/message');

app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Not enough information provided");
    }

    const resp = await User.findOne({ username, password })

    if (!resp) {
        return res.status(200).json(
            {
                message: "Invalid username or password"
            }
        );
    } else {
        // Make a session and log in user
        req.session.user = resp['id'];
        req.session.save();
        console.log(req.session);
        return res.status(200).send(resp);
    }

});

app.get('/api/session', (req, res) => {
    console.log(req.session);
    if (req.session.user != undefined) {
        return res.status(200).json(
            { "user": req.session.user, "message": "Logged in as user " + req.session.user }
        );
    } else {
        return res.status(200).json(
            { "user": null, "message": "Not logged in" }
        );
    }
});

app.get('/api/user', async (req, res) => {
    const { id, _id } = req.query;

    if (!id && !_id) {
        return res.status(400).send("No user requested");
    }

    const resp = await User.findOne({ $or: [{ id }, { _id }] }).select('-password');
    if (!resp) {
        return res.status(200).json({ "user": null });
    }

    res.status(200).send(resp);
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    return res.status(200).send("Logged out");
});

app.get('/api/messages', async (req, res) => {
    const resp = await Message.find();
    res.status(200).send(resp);
});

app.put('/api/message', async (req, res) => {
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

app.put('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    const id = await User.count();

    if (!username || !password || !email) {
        return res.status(400).send('Invalid request');
    }

    if (await User.findOne({ email })) {
        return res.status(200).json({ "message": "Email already in use" });
    }

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