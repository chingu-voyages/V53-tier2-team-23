const jwt = require('jsonwebtoken');

// using dotenv just for local testing as I don't have access to netlify
const dotenv = require('dotenv');
dotenv.config();

const authenticate = (event) => {
  const token = event.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Token not found' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    return {
      statusCode: 200,
      user: verified,
    }; // Return decoded token if valid
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid token' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

module.exports = authenticate;
