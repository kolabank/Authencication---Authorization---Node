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


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

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
    res.redirect('/signup')
})



app.get("/welcome", (req, res) => {
    res.send("You are welcome to get response");

})

app.listen(3000, () => {
    console.log("App is listening");
})