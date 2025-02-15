const jwt = require('jsonwebtoken');

// using dotenv just for local testing as I don't have access to netlify
const dotenv = require('dotenv');
dotenv.config();

const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://chingu-voyages.github.io', // Production
];

const authenticate = (event) => {
  const token = event.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Token not found' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigins.includes(
          event.headers.origin
        )
          ? event.headers.origin
          : 'https://chingu-voyages.github.io', // Default to GitHub Pages
      },
    };
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    return {
      statusCode: 200,
      user: verified,
      headers,
    }; // Return decoded token if valid
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid token' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigins.includes(
          event.headers.origin
        )
          ? event.headers.origin
          : 'https://chingu-voyages.github.io', // Default to GitHub Pages
      },
    };
  }
};

module.exports = authenticate;
