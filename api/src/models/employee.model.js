const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Employee Schema to represent employee data.
 * @typedef {Object} Employee
 * @property {string} employeeId - The unique identifier for the employee.
 * @property {string} employeeName - The name of the employee.
 * @property {Array<ObjectId>} allergies - Array of ObjectIds referencing allergens.
 * @property {Array<string>} dietaryRestrictions - Array of dietary restrictions.
 */
const employeeSchema = new Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  allergies: [
    {
      type: Schema.Types.ObjectId, // Represents a MongoDB ObjectId, used for referencing other documents
      ref: 'Allergen',
      required: false,
    },
  ],
  dietaryRestrictions: [
    {
      type: String,
      enum: [
        'vegetarian',
        'vegan',
        'pescatarian',
        'keto',
        'paleo',
        'glutenFree',
        'standard',
        'lactose-free',
        'diabetes-friendly',
      ], // only take a specific set of values
      required: false,
    },
  ],
});

// Explicitly ensure indexes use `createIndexes()`
employeeSchema.set('autoIndex', true);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
