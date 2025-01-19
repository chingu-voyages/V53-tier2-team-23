const mongoose = require('mongoose'); // Import Mongoose
const uri = process.env.MONGODB_URI; // get Atlas URI from env file

if (!uri) {
  throw new Error('MongoDB URI is not defined!');
}

let client = null; // Cache for database connection

// Function to get a cached or new connection
const getDb = async () => {
  // If the database is cached, return it
  if (client) {
    return client;
  }

  try {
    // Use Mongoose to connect to the MongoDB database
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    client = mongoose.connection; // Cache the Mongoose connection
    console.log('MongoDB connection established successfully');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; // Handle error properly
  }
};

module.exports = getDb;
