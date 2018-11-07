const mongoose = require('mongoose');
const bcypt = require('bcrypt');

const userSchema = new mongoose.Schema({
   email: {
       type: String,
       required: true,
       unique: true
   },
   username: {
       type: String,
       required: true,
       unique: true
   },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
       type: String
    }
});

userSchema.pre('save', async function (next) {
   try {
       if (!this.modified('password')) {
           return next() // don't go and hash it again
       }
       let hashedPassword = await bcypt.hash(this.password, 10);
       this.password = password;
       return next();
   } catch (e) {
        return next(e)
   }
});

userSchema.method.comparePassword = async function (candidatePassword, next) {
  try {
      let isMatch = await bcypt.compare(candidatePassword, this.password);
      return isMatch;
  } catch(e) {
      next(e);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;