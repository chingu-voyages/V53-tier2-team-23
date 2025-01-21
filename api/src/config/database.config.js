const mongoose = require('mongoose');

// using dotenv just for local testing as I don't have access to netlify
// const dotenv = require('dotenv');
// dotenv.config();

let client = null; // Cache for database connection

const connectDatabase = async () => {
  if (client) {
    return client; // Return cached connection
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'eato_database',
      autoIndex: false,
      bufferCommands: false, // Disable Mongoose buffering for serverless
      keepAlive: true, // Maintain the connection in serverless
      // for better performace in serverless environments
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to DB:', mongoose.connection.db.databaseName);

    client = connection; // Cache the Mongoose connection
    console.log('MongoDB connected succesfully');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

module.exports = connectDatabase;
