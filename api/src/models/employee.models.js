const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  employeeId: {
    type: String,
    required: true,
    uniqure: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  allergies: [
    {
      type: Schema.Types.ObjectId, // Represents a MongoDB ObjectId, used for referencing other documents
      ref: 'Allergen',
    },
  ],
  dietaryRestrictions: [
    {
      type: String,
      enum: [
        'Lactose-free',
        'Gluten-free',
        'Vegetarian',
        'Vegan',
        'Diabetes-friendly',
      ], // only take a specific set of values
      required: false,
    },
  ],
});

module.exports = mongoose.model('Employee', employeeSchema);
