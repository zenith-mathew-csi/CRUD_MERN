const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Get all movies
router.get('/movies', async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

// GET movie by id
router.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    console.error('Fetch movie error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create movie
router.post('/movies', async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const saved = await newMovie.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update movie
router.put('/movies/:id', async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete movie by ID
router.delete('/movies/:id', async (req, res) => {
  try {
    const result = await Movie.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: 'Movie deleted' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;