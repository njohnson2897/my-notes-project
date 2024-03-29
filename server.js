// imports the necessary modules and functions
const express = require('express');
const path = require('path');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils.js')
const { v4: uuidv4 } = require('uuid');

// PORT optionality allows app to be run locally or deployed on a platform 
const PORT = process.env.port || 3001; 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

// GET route for /notes that delivers notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route for /api/notes that reads from db.json
app.get('/api/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data))));

app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json("Successfully recorded the note");
    } else {
        res.error('Please include a title and text for your note');
    };
});


// wildcard GET route that delivers index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);




app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);