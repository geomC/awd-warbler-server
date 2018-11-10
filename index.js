require('dotenv').config(); // load all env vars so they are available under process.env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const db = require("./models");
const {ensureCorrectUser, loginRequired} = require('./middleware/auth');

const PORT = 8081;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// all routes
app.use('/api/auth', authRoutes); // open endpoint
app.use('/api/users/:id/messages', loginRequired, ensureCorrectUser, messagesRoutes); // protected endpoint

app.get("/api/messages", loginRequired, async function(req, res, next) {
    try {
        let messages = await db.Message.find()
            .sort({ createdAt: "desc" })
            .populate("user", {
                username: true,
                profileImageUrl: true
            });
        return res.status(200).json(messages);
    } catch (err) {
        return next(err);
    }
});

// error middleware (top level error handling)

// route not found
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error formatting (status code, message prop)
app.use(errorHandler);

// startup
app.listen(PORT, function () {
    console.log(`server starting on port ${PORT}`);
});