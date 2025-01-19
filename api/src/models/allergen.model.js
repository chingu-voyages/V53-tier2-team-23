const mongoose = require('mongoose');

const allergenSchema = new mongoose.Schema({
  allergenName: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate allergen names
    trim: true, // To remove leading/trailing spaces when adding new allergy
    lowercase: true, // ensures consistent casing
  },
});

module.exports = mongoose.model('Allergen', allergenSchema);
