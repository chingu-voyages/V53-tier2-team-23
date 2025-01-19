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
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Menu', menuSchema);
