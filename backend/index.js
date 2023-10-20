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

    if (password.length < 6) {
        return res.status(400).send("Password must be at least 6 characters long");
    }

    if (username.length > 50) {
        return res.status(400).send("Username must be less than 50 characters long");
    }

    const user = await User.findOne({ username });

    bycrypt.compare(password, user.password, (err, result) => {
        if (err) {
            return res.status(500).send("Error logging in");
        }

        if (!result) {
            return res.status(200).json({ "message": "Incorrect username or password" });
        }

        console.log(user);

        req.session.userid = user.id;
        req.session.admin = user.admin;
        req.session.save();
        res.status(200).send(user);
    });
});

app.get('/api/session', (req, res) => {
    if (req.session.userid == undefined) {
        return res.status(200).json({ "message": "No user logged in" });
    }

    User.findOne({ id: req.session.userid })
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((err) => {
            res.status(500).send("Error finding user");
        });
});

app.get('/api/user', async (req, res) => {
    const { id, _id } = req.query;

    if (!id && !_id) {
        return res.status(400).send("No user requested");
    }

    const resp = await User.findOne({ $or: [{ id }, { _id }] }).select('-password');
    if (!resp) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send("Error destroying session");
            }
            return res.status(200).json({ "user": null, "message": "User not found" });
        });
    }

    res.status(200).send(resp);
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).send(err);
        } else {
            return res.status(200).json({ "message": "Logged out" });
        }
    });
});

app.get('/api/messages', async (req, res) => {
    const resp = await Message.find();
    res.status(200).send(resp);
});

app.put('/api/message', async (req, res) => {
    const { content, senderId } = req.body;
    const id = await Message.count();
    const timestamp = new Date();
    console.log(content + " " + senderId);

    if (!content || senderId == undefined) {
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

app.delete('/api/message', async (req, res) => {
    const { id } = req.body;

    const msg = await Message.findOne({ id });
    if (msg == undefined) {
        return res.status(404).json({ "message": "Message not found" });
    }

    if (msg.senderId != req.session.userid && !req.session.admin) {
        return res.status(401).json({ "message": "Unauthorized" });
    }

    Message.deleteOne({ id }).then(() => {
        res.status(200).json({ "message": "Message deleted" });
    }).catch((err) => {
        res.status(500).json({ "message": "Error deleting message" });
    });
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

    if (!req.session.admin) {
        return res.status(401).json({ "message": "Unauthorized" });
    }

    bycrypt.hash(password, 10, async (err, hash) => {
        if (!err) {
            const resp = await User.create({ id, username, 'password': hash, email, 'admin': false });
            return res.status(201).send(resp);
        } else {
            return res.status(500).send('Error: ' + err);
        }
    });
    /* In reality, the password should be generated not asked, and the invited emailed with the password */
});

app.listen(1234, () => { console.log('Server is running on port 1234') });