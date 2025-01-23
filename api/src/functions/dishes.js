const mongoosee = require('mongoose');
const Dishes = require('../models/dishes.models');
const connectDatabase = require('../config/database.config');
const authenticate = require('../functions/authMiddleware');

const handleError = (error, method) => {
  console.error(`Error ${method} employee: `, error);
  return {
    statusCode: 500,
    body: JSON.stringify({ error: error.message }),
  };
};

exports.handler = async (event) => {
  await connectDatabase();
  const { httpMethod, path } = event;
  const dishesId = path.split('/').pop();

  // Check authentication
  const authResult = authenticate(event);
  if (authResult.statusCode !== 200) {
    return authResult; // Return early if authentication fails
  }

  // Proceed if authenticated
  const user = authResult.user;

  // getting all dishes
  if (httpMethod === 'GET' && path.endsWith('/dishes')) {
    try {
      const dishes = await Dishes.find();
      return {
        statusCode: 200,
        body: JSON.stringify(dishes),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    } catch (error) {
      return handleError(error, 'fetching');
    }
  }

  // getting specific dish
  if (httpMethod === 'GET' && path.endsWith(`/dishes/${dishesId}`)) {
    try {
      const dish = await Dishes.findById(dishesId);
      if (!dish) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Dish not found' }),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(dish),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    } catch (error) {
      return handleError(error, 'fetching');
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed.' }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };
};
