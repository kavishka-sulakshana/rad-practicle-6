const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 8000;
app.set('views', path.join(__dirname, '/pages'));
app.set('view engine', 'ejs');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, path.join(__dirname, '/files/'));
    },
    filename:  (req, file, cb) => {
        const regx = /\..*$/
        cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(regx)[0])
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            cb(null, true);
        else {
            cb(null, false);
            const err = new Error('Only .doc |.docx format allowed!')
            cb(err)
        }

    }
}).array('docs', 2);


app.get('/', (req, res) => {
    res.render("index");
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) res.send(`${err}`);
        else res.send('uploaded successfully');
    })
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})