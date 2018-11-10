require('dotenv').load();
const jwt = require('jsonwebtoken');

// make sure the user is logged in   -> Authentication

const unAuthError = {
    status: 401,
    message: 'Please log in first'
};

const parseToken = (req) => req.headers.authorization.split(' ')[1]; // Bearer sdjfdjfga89gfdg

exports.loginRequired = function (req, res, next) {
    try {
        const token = parseToken(req);
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (decoded) { // if there is a payload that has been successfully decoced
                return next();
            } else if (!decoded || err) {
                console.error(err);
                return next(unAuthError)
            }
        });
    } catch (e) {
        return next(unAuthError)
    }
};

// make sure we get the currect user -> Authorization
// URL: /api/users/:id/messages
exports.ensureCorrectUser = function (req, res, next) {

    try {
        const token = parseToken(req);
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (decoded && decoded.id === req.params.id) { // if there is a payload that has been successfully decoced
                return next();
            }
            if (decoded && decoded.id !== req.params.id) {
                return next({
                    next: 401,
                    message: 'Unauthorized'
                })
            }
            if (!decoded) {
                console.error(err);
                return next(unAuthError)
            }

        });
    } catch (e) {
        console.error(e);
        return next(unAuthError)
    }
}