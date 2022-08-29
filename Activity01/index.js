const User = require('./models/user');
const session = require('express-session');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const path = require('path');
const passport = require('./passport');

const app = express();
const saltRounds = 10;
const PORT = 8000;

app.use(express.static(path.join(__dirname))); // static path initialization

mongoose.connect("mongodb://127.0.0.1:27017/company");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({extended:false}));

// session data
app.use(session({
    secret: 'authentication',
    resave: false,
    saveUninitialized: false,
    cookie: {

    }
}));

app.use(passport.initialize());
app.use(passport.session());

// for index.html page
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join('pages') });
});

// for profile page
app.get('/profile', (req, res) => {
    // if session has passport object => user logged in
    if(req.session.passport){
        res.sendFile('profile.html',{ root:path.join('pages') });
    }
    else{
        res.redirect('/login'); // no such info in session => can't access to the profile page
    }
});

//for login page
app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: path.join('pages') });
});

//for register page
app.get('/register', (req, res) => {
    res.sendFile('register.html', { root: path.join('pages') });
});

app.post('/register', (req, res) => {
    // save user data to database
    if (req.body.password == req.body.passconf) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                let newUser = { name: req.body.name, email: req.body.email, password: hash };
                User.create(newUser, (error, user) => {
                    if (error) console.log(error);
                    else {
                        // console.log('user added !', newUser);
                        res.redirect('/login');
                    }
                });
            });
        });
    } else {
        res.redirect('/register');
    }

});

// passport authentication for login 
app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',    // redirect to profile if success
    failureRedirect: '/',   // redirect back to login if faliure
}));

// for logout
app.get('/logout', (req, res)=>{
    // destroy the session data of the user
    req.session.destroy(err => {
        if(err){
            console.log(err);
        }
        else{
            console.log(req.session);
            res.redirect('/');
        }   
    });
});

app.listen(PORT, (error) => {
    if (error) console.log('Error :', error);
    else console.log('server is running on', PORT);
});

module.exports = express;