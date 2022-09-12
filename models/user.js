const mongoose = require("mongoose");
const passortLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({


    email: {
        type: String,
        required: true,
        unique: true
    },

})

userSchema.plugin(passortLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;