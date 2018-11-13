const db = require('../models');
const jwt = require('jsonwebtoken');


exports.signup = async function(req, res, next) {
    try {
        // create user
        // create a token (signing a token)
        const user = await db.User.create(req.body);
        const {id, username, profileImageUrl} = user;
        const token = jwt.sign({
            id,
            username,
            profileImageUrl
        }, process.env.SECRET_KEY);
        return res.status(200).json({
            id,
            username,
            profileImageUrl,
            token
        })

    } catch (err) {
        // see what kind of error is
        // if it is a certain error, respond with "username/email already taken"
        // otherwise just send back a generic 400

        // if a validation fails
        if(err.code === 11000) { // mongoose code for "valivation failed"
            err.message = "Sorry, that username and/or email is taken" // don't send the cryptic mongoose error message
        }
        return next({
            status: 400,
            message: err.message
        })
    }
};

exports.signin = async function(req, res, next) {
    try {
        // find a user
        const user = await db.User.findOne({
            email: req.body.email
        });
        if (!user) {
            return next({
                status: 400,
                message: 'User not found'
            })
        }
        let { id, username, profileImageUrl } = user;
        const isMatch = await user.comparePassword(req.body.password);
        if (isMatch) {
            const token = jwt.sign({
                id,
                username,
                profileImageUrl
            },  process.env.SECRET_KEY);
            return res.status(200).json({
                id,
                username,
                profileImageUrl,
                token
            })
        } else {
            return next({
                status: 400,
                message: 'Invalid Password'
            })
        }
        // check if the pw matches what was sent to the server
        // if it all matches
        // log them im using jwt
    } catch (err) {
        return next({
            status: 500,
            message: 'Something went wrong: ' + JSON.stringify(err)
        })
    }
};