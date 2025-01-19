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

// example of the menu
/* {
  "weekStartDate": "2025-01-22",
  "days": [
    {
      "date": "2025-01-22",
      "dish": "ObjectId('64a76d1e2f8b2c39fc123456')" // References a dish
    },
    {
      "date": "2025-01-23",
      "dish": "ObjectId('64a76d1e2f8b2c39fc123457')"
    },
    {
      "date": "2025-01-24",
      "dish": "ObjectId('64a76d1e2f8b2c39fc123458')"
    },
    {
      "date": "2025-01-25",
      "dish": null // No dish assigned (Day Off)
    },
    {
      "date": "2025-01-26",
      "dish": "ObjectId('64a76d1e2f8b2c39fc123459')"
    },
    {
      "date": "2025-01-27",
      "dish": "ObjectId('64a76d1e2f8b2c39fc123460')"
    },
    {
      "date": "2025-01-28",
      "dish": "ObjectId('64a76d1e2f8b2c39fc123461')"
    }
  ]
} */

module.exports = mongoose.model('Employee', employeeSchema);
