const jwt = require('jsonwebtoken');

const allowedOrigins = [
  'https://chingu-voyages.github.io',
  'https://eato-meatplanner.netlify.app',
  'https://eatodishes.netlify.app',
];

const authenticate = (event) => {
  const token = event.headers.authorization?.replace('Bearer ', '');
  const origin = allowedOrigins.includes(event.headers.origin)
    ? event.headers.origin
    : 'https://chingu-voyages.github.io';
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
  };

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Token not found' }),
      headers,
    };
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    return {
      statusCode: 200,
      user: verified,
      headers,
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid token' }),
      headers,
    };
  }
};

module.exports = authenticate;
