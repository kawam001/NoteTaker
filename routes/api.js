const express = require('express');
const router = express.Router();
const fs = require('fs');
let notes = require('../db/db.json');
const { v4: uuidv4 } = require('uuid');
// console.log(uuidv4()); 

// GET /api/notes (return db.json)
router.get('/notes', (req, res) => {
    res.json(notes);
});

// POST /api/notes (return new note, add to db.json, return to client, give note unique ID when saved)
router.post('/notes', (req, res) => {

    //submit title and text for request body
    const { title, text } = req.body;

    // if title and text present, add unique ID
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        // push new note into notes (JSON)
        notes.push(newNote);

        // convert notes (notes + new note) into string 
        let notesString = JSON.stringify(notes, null, 3);

        // rewrite file with all notes using string
        fs.writeFile(`./db/db.json`, notesString, (err) =>
            err
                ? console.error(err)
                : console.log(`New note has been added!`)
        );

        // give success response or report errors
        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        // 201 = request has succeeded and has led to the creation of a resource
        res.status(201).json(response);
    } else {
        // 500 = server-side error
        res.status(500).json('Error in adding note');
    }
});

// DELETE /api/notes/:id 
router.delete('/notes/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile("./db/db.json", "utf8", (error, data) =>
        error ? console.error(error) : (notes = JSON.parse(data))
    );

    const deletedNote = notes.filter(note => note.id === req.params.id)

    if (deletedNote) {
        let filteredNotes = notes.filter(note => note.id != req.params.id)
        let notesString = JSON.stringify(filteredNotes, null, 3);
        fs.writeFile(`./db/db.json`, notesString, (err) =>
            err
                ? console.error(err)
                : console.log(`Note deleted!`));

        res.status(200).json(filteredNotes);
    } else {
        res.status(500).json('Error deleting note');
    }
});

module.exports = router;