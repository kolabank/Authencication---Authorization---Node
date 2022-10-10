const express = require("express");
const signupRouter = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const { register } = require("../models/user");


signupRouter.get("/signup", (req, res) => {
    res.render('index');
})

signupRouter.post("/signup", async(req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const userInit = new User({ username, email });
        const user = await User.register(userInit, password);
        req.login(user, err => {
            if (err) return next(err);
            req.flash('success', `You are now signed up ${user.username}`);
            res.redirect('/welcome');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('signup');
    }

})


module.exports = signupRouter;