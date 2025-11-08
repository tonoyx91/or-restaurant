const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  ratingSum: { type: Number, default: 0 }
});

module.exports = mongoose.model('Food', FoodSchema);
