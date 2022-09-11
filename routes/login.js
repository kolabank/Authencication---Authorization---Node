const express = require("express");
const loginRouter = express.Router();
const app = express();
const bcrypt = require('bcrypt');
const User = require("../models/user");
const passport = require("passport");




loginRouter.get("/login", (req, res) => {

    res.render('login');

})

loginRouter.post('/login', async(req, res) => {
    console.log("Got into the login post route");
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        res.send("Login details are not correct");
    } else {
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            req.flash("success", `You are now logged in ${user.username}`)
            res.redirect('/welcome')

        } else {
            res.send("Login details are not correct");

        }
    }

})

module.exports = loginRouter;