const bodyParser = require('body-parser')
const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const Photo = require('./models/photos'); // import the model Photos

const app = express();
const PORT = 8000;

// connect to the mongodb database
mongoose.connect('mongodb://127.0.0.1:27017/photoGallery').then(() => {
    console.log('connected to database');
}).catch(err => {
    console.log('err');
});

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' }); // set file uploading destination

// set ejs options
app.set('views', path.join(__dirname, '/pages'));
app.set('view engine', 'ejs');

// get route for render the 'index.ejs'
app.get('/', (req, res) => {
    // find all photos and captions from database
    Photo.find({}, (err, docs) => {
        if (err) {
            res.render('index');
        }
        else {
            res.render('index', { data: docs });
        }
    });
});

// post route for upload a photo with caption
app.post('/upload', upload.single('photo'), (req, res) => {
    // check if the photo and caption entered
    if (req.body.cap != '' && req.file) { 
        const photoDoc = { caption: req.body.cap, imgname: req.file.filename };

        // add to database with Photo model
        Photo.create(photoDoc, (err, photoData) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
})


app.listen(PORT, (err) => {
    if (err) {
        console.log("server error");
    } else {
        console.log("server running in port", PORT);
    }
});