const express = require('express');

const imageProcessingModule = require('./imageProcessing/imageProcessing')

const app = express();
const port = 3000;

app.use('/', imageProcessingModule);

app.listen(port, () => { console.log(`Listening on port: ${port}!`) });