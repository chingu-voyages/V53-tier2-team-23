const mongoose = require('mongoose');

const imageUrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  ,
  { collection: 'imagesurl' }
});

module.exports = mongoose.model('Image', imageUrlSchema);
