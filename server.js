// imports the necessary modules and functions
const express = require('express');
const path = require('path');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils.js')

// PORT optionality allows app to be run locally or deployed on a platform 
const PORT = process.env.port || 3001; 

const app = express();

app.use(express.static('public'));

// GET route for /notes that delivers notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route for /api/notes that reads from db.json
app.get('/api/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data))));

// wildcard GET route that delivers index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);