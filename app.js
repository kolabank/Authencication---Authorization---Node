const express = require("express");

require('dotenv').config();
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
const MongoStore = require("connect-mongo") //(session);
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { isLoggedin } = require('./middleware')
const ejsmate = require('ejs-mate');
const { db } = require("./models/user");
app.engine('ejs', ejsmate);

const dbUrl = process.env.DB_URL //|| 'mongodb://localhost:27017/user';


const secret = process.env.SECRET || 'thisisnotagoodsecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60
})
store.on("error", function(e) {
    console.log("SESSION ERROR")
})

const sessionOptions = {
    store,
    secret,
    resave: false,
    saveUninitialized: false
}

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
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use("/", loginRouter);
app.use("/", signupRouter);



// 'mongodb://localhost:27017/user'
mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
    console.log(dbUrl);


})