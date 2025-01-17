const mongoose = require('mongoose');

// using dotenv just for local testing as I don't have access to netlify
const dotenv = require('dotenv');
dotenv.config();

const connectDatabase = async () => {
  try {
    // awaiting the connection attempt to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1); // Exit the process if connection fail
  }
};

module.exports = connectDatabase;
