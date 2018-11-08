require('dotenv').config(); // load all env vars so they are available under process.env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');
const authRoutes = require('./routes/auth');

const PORT = 8081;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// all routes
app.use('/api/auth', authRoutes);


// error middleware (top level error handling)

// route not foud
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