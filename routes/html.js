const express = require('express');
const router = express.Router();

// node:path module provides utilities for working with file and directory paths
const path = require('path');

// GET * (return index.html)
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/../routes/public/index.html'));
});

// GET /notes (return notes.html)
router.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/../public/notes.html'));
});

module.exports = router;