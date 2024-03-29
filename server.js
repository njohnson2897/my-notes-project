const express = require('express');
const path = require('path');
const { readFromFile } = require('./helpers/fsUtils.js')


const PORT = process.env.port || 3001; 

const app = express();

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data))));

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);