const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
const bcrypt = require('bcrypt');
const User = require("./models/user");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const res = require("express/lib/response");
const session = require("express-session");
const sessionOptions = { secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false }
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { isLoggedin } = require('./middleware')
console.log(isLoggedin);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use("/", loginRouter);
app.use("/", signupRouter);

mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })




app.get("/", (req, res) => {
    res.redirect('/homepage');
})

app.get('/homepage', (req, res) => {
    res.render("homepage");
})



app.get("/welcome", isLoggedin, (req, res) => {
    res.render('welcome');

})


app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "You are now logged out");
        res.redirect('/signup');
    });
});

app.listen(3000, () => {
    console.log("App is listening");
})