const express = require("express");
const loginRouter = express.Router();

const User = require("../models/user");
const passport = require("passport");




loginRouter.get("/login", (req, res) => {

    res.render('login');

})

loginRouter.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const { username, password } = req.body;
    req.flash("success", `You are now logged in ${username}`)
    res.redirect('/welcome')


})

module.exports = loginRouter;