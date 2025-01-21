const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  weekStartDate: {
    type: Date, // the start date of the week for which the menu is planned
    required: true,
  },
  days: [
    {
      date: {
        type: Date,
        required: true,
      },
      dish: {
        type: Schema.Types.ObjectId, // Reference to the dishScehma
        ref: 'Dish',
        default: null, // Allow null for "Day Off"
      },
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

module.exports = mongoose.model('Menu', menuSchema);
