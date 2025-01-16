const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  employeeId: {
    type: Number,
    required: true,
    uniqure: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  allergies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Allergen',
    },
  ],
});

module.exports = mongoose.model('Employee', employeeSchema);
