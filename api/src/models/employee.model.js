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
const employeeSchema = new Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },
    // allergies: [
    //   {
    //     type: Schema.Types.ObjectId, // Represents a MongoDB ObjectId, used for referencing other documents
    //     ref: 'Allergen',
    //     required: false,
    //   },
    // ],
    allergies: {
      type: [String],
      default: [],
    },
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
  },
  { collection: 'employees' }
);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
