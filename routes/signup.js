const express = require("express");
const signupRouter = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const { register } = require("../models/user");


signupRouter.get("/signup", (req, res) => {
    res.render('index');
})

signupRouter.post("/signup", async(req, res) => {

    const { username, email, password } = req.body;
    const userInit = new User({ username, email });
    const user = await User.register(userInit, password);

    // const hashedPassword = await bcrypt.hash(password, 10);
    // const user = new User({ username, email, password: hashedPassword });
    // await user.save();
    req.flash('success', `You are now signed up ${user.username}`);
    res.redirect('/welcome');

})


module.exports = signupRouter;