const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  rating: { type: Number, default: 4.5 }
});

module.exports = mongoose.model('Food', FoodSchema);
