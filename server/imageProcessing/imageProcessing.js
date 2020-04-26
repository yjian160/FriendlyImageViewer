const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

let corsOptions = {
    origin: '*',
    optionSuccessStatus: 200
};

router.use(express.static('./client/dist'))
router.use(cors(corsOptions));

router.use('/newPhoto', (req, res, next) => {
    if (req.method === 'POST') {
        fs.renameSync('./server/images/defaultImage.png', './server/images/oldImage.png');
    }

    next();
});

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, './server/images');
    },
    filename: (req, file, cb) => {
        cb(null, 'defaultImage.png')
    }
});

const upload = multer({ storage });

router.post('/newPhoto', upload.single('file'), (req, res) => {
    res.send();
});

router.get('/photo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'images', 'defaultImage.png'));
});

router.get('/oldPhoto', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'images', 'oldImage.png'));
});

module.exports = router;