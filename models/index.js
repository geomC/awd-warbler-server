const mongoose = require("mongoose");
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/warbler', {
    keepalive: true,
    useMongoClient: true
});

