// to have our own dish api since we need to associate the allergy tag and can also put image link
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
  dishId: {
    type: String,
    required: true,
    unique: true,
  },
  dishName: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String], // an array of strings
    required: true,
  },
  allergens: [
    {
      type: Schema.Types.ObjectId, // Represents a MongoDB ObjectId, used for referencing other documents
      ref: 'Allergen',
    },
  ],
  calories: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Dish', dishSchema);
