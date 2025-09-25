const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;
const FILE_PATH = './notes.json';

function readNotes() {
    if (!fs.existsSync(FILE_PATH)) return [];
    return JSON.parse(fs.readFileSync(FILE_PATH));
}

function writeNotes(notes) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(notes, null, 2));
}

app.get('/notes', (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title & content required' });

    const notes = readNotes();
    const newNote = { id: Date.now(), title, content };
    notes.push(newNote);
    writeNotes(notes);

    res.status(201).json(newNote);
});

app.get('/notes/:id', (req, res) => {
    const notes = readNotes();
    const note = notes.find(n => n.id == req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
});

app.put('/notes/:id', (req, res) => {
    const { title, content } = req.body;
    const notes = readNotes();
    const noteIndex = notes.findIndex(n => n.id == req.params.id);

    if (noteIndex === -1) return res.status(404).json({ message: 'Note not found' });

    notes[noteIndex] = { ...notes[noteIndex], title, content };
    writeNotes(notes);
    res.json(notes[noteIndex]);
});

app.delete('/notes/:id', (req, res) => {
    let notes = readNotes();
    const noteIndex = notes.findIndex(n => n.id == req.params.id);

    if (noteIndex === -1) return res.status(404).json({ message: 'Note not found' });

    notes.splice(noteIndex, 1);
    writeNotes(notes);
    res.json({ message: 'Note deleted' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
