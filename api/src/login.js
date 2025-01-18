const jwt = require('jsonwebtoken');

// CREDENTIALS ✅
const manager = {
  username: process.env.REACT_APP_MANAGER_USERNAME,
  password: process.env.REACT_APP_MANAGER_PASSWORD,
};

exports.handler = async (event) => {
  // set request object
  const request = {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body ? JSON.parse(event.body) : null,
    query: event.queryStringParameters,
  };

  // Handle OPTIONS preflight request
  if (request.method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
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
        password: password,
        token: token,
      };

      return {
        statusCode: 200,
        body: JSON.stringify({ userData }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Credentials don't match' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
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
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      };
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Token not accepted' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };
};
