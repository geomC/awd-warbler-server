const mongoose = require('mongoose');
const User = require('./user');

const messageSchema = new mongoose.Schema({
        text: {
            type: String,
            required: true,
            maxLength: 160
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // the alias defined as first argument to  mongoose.mode in the User schema. casing matters here!
        }
    },
    {
        timestamps: true
    }
);

// whenever a message is deleted, remove reference in User schema
messageSchema.pre('remove', async function (next) {
    try {

        // find a user
        const user = await User.findById(this.user);

        // remove the id of the message from their messages list
        user.messages.remove(this.id); // works like splice
        // save that user
        await user.save();
        // return next
        return next();
    } catch (e) {
        return next(e)
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message