const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// GET /api/foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find().limit(50);
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
