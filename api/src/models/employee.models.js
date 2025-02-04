const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allergen = [
  'peanuts',
  'shellfish',
  'fish',
  'corn',
  'soy',
  'egg',
  'dairy',
  'tree nuts',
  'legumes',
  'sesame seeds',
  'milk',
  'wheat',
  'mustard',
  'gluten',
  'coconut',
];

const diet = [
  'vegetarian',
  'vegan',
  'pescatarian',
  'keto',
  'paleo',
  'glutenFree',
  'standard',
  'lactose-free',
  'diabetes-friendly',
];

const employeeSchema = new Schema({
  employeeName: {
    type: String,
    required: true,
  },
  // shelved for Should Have, Nice To Have feature of giving user the option to add more allergies
  /*   allergies: [
    {
      type: Schema.Types.ObjectId, // Represents a MongoDB ObjectId, used for referencing other documents
      ref: 'Allergen',
      required: false,
    },
  ], */
  allergies: [
    {
      type: String, // Store the allergy name as a string
      enum: allergen, // Restrict values to the predefined list
      default: [],
    },
  ],
  dietaryRestrictions: [
    {
      type: String,
      enum: diet, // only take a specific set of values
      required: false,
    },
  ],
});

module.exports = mongoose.model('Employee', employeeSchema);
