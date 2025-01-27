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
        ref: 'Dishes',
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
      "dish": "678cc09c2dc717b2d7754bf4" 
    },
    {
      "date": "2025-01-23",
      "dish": "678cc09c2dc717b2d7754bf5"
    },
    {
      "date": "2025-01-24",
      "dish": "678cc09c2dc717b2d7754bdb"
    },
    {
      "date": "2025-01-25",
      "dish": null 
    },
    {
      "date": "2025-01-26",
      "dish": "678cc09c2dc717b2d7754bdd"
    },
    {
      "date": "2025-01-27",
      "dish": "678cc09c2dc717b2d7754bdf"
    },
    {
      "date": "2025-01-28",
      "dish": "678cc09c2dc717b2d7754be0"
    }
  ]
} */

module.exports = mongoose.model('Menu', menuSchema);
