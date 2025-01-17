const express = require('express');
const connectDatabase = require('./config/database.config');
const setRoutes = require('./routes/index');

const app = express();

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(express.json()); // for JSON parser
app.use(express.urlencoded({ extended: true })); // URL-encoded data parser

// Initialize routes
setRoutes(app);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
