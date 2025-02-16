// to have our own dish api since we need to associate the allergy tag and can also put image link
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishesSchema = new Schema({
  // use MongoDB ObjectId for dishId?
  /*   dishId: {
    type: String,
    required: true,
    unique: true,
  }, */
  dishName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String], // an array of strings
    required: true,
  },
  allergens: {
    type: [String],
    required: false,
  },
  calories: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Dishes', dishesSchema);
