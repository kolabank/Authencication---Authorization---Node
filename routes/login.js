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
    const retrievedUser = await User.findOne({ username });
    if (!retrievedUser) {
        res.send("Login details are not correct");
    } else {
        const isPasswordMatch = await bcrypt.compare(password, retrievedUser.password);

        if (isPasswordMatch) {
            res.send("You are logged in");

        } else {
            res.send("Login details are not correct");

        }
    }
    res.send("You are logged in");
})

module.exports = loginRouter;