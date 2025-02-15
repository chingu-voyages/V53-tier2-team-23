const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

// CREDENTIALS ✅
const manager = {
  username: process.env.REACT_APP_MANAGER_USERNAME,
  password: process.env.REACT_APP_MANAGER_PASSWORD,
};

const allowedOrigins = [
  'http://localhost:5173',
  'https://chingu-voyages.github.io/V53-tier2-team-23',
  'https://eato-meatplanner.netlify.app',
  'https://eatodishes.netlify.app',
];

exports.handler = async (event) => {
  const origin = event.headers.origin;
  const isAllowedOrigin = allowedOrigins.includes(origin);

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[1],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  // set request object
  const request = {
    method: event.httpMethod,
    headers: event.headers,
    body: undefined,
    query: event.queryStringParameters,
  };

  if (event.body) {
    try {
      request.body = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid JSON format' }),
        headers,
      };
    }
  }

  // Handle OPTIONS preflight request
  if (request.method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
    };
  }

  //POST METHOD for user login

  if (request.method === 'POST') {
    const { username, password } = request.body;

    if (username === manager.username && password === manager.password) {
      const token = jwt.sign(
        { username: manager.username },
        process.env.JWT_SECRET
      );

      // Create a data object to send as the response
      const userData = {
        username: username,
        token: token,
      };

      return {
        statusCode: 200,
        body: JSON.stringify({ userData }),
        headers,
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Credentials don't match" }),
        headers,
      };
    }
  }

  // GET METHOD verify the JWT token sent by the client
  if (request.method === 'GET') {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Token not found' }),
        headers,
      };
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      const responseBody = JSON.stringify({
        username: verified.username,
      });

      return {
        statusCode: 200,
        body: responseBody,
        headers,
      };
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Token not accepted' }),
        headers,
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
    headers,
  };
};
