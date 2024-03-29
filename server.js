// imports the necessary modules and functions
const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils.js')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

// PORT optionality allows app to be run locally or deployed on a platform 
const PORT = process.env.port || 3001; 

const app = express();

// middleware to be able to POST JSON and form data
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

// POST route for /api/notes to create a new note when the user clicks the "save note" button
app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;
// if the request body exists, create a new note using the body, give it an id, and add it to db.json
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

// DELETE route for a specific note that a user clicks the delete button for
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
// reads from the db.json file to get the data so that the note IDs can be accessed and compared
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res.json({ error: 'Failed to read data.' });
        }

        let notes = JSON.parse(data);
// makes a new array of notes that have an ID  that DOES NOT match the note clicked by the user
        const filteredNotes = notes.filter(note => note.note_id !== id);
        console.log(filteredNotes);
// overwrites file with the new array that no longer has the deleted note
        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 2), err => {
            if (err) {
                console.error(err);
                return res.json('Failed to rewrite to db.json.' );
            }
            res.json("Successfully deleted the specified note.");
        });
    });
});


// wildcard GET route that delivers index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);



// tells the application to listen at either port 3001 or whatever port render chooses
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);