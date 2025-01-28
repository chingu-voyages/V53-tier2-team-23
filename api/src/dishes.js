const mongoose = require('mongoose');
const getDb = require('./db_config/database.config.js'); // import getDatabase database from connection
const Employee = require('./models/employee.model'); // Import employee model
const Dish = require('./models/dish.model'); // Import dish model

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const handleError = (error, method) => {
  console.error(`Error ${method} employee: `, error);
  return {
    statusCode: 500,
    body: JSON.stringify({ error: error.message }),
  };
};

async function handler(event, context) {
  const { httpMethod, path, queryStringParameters, body } = event;

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers, // Return CORS headers for preflight
      body: JSON.stringify({ success: true }),
    };
  }

  // getting all dishes excluding allergens based on ingredients

  if (httpMethod === 'GET' && path.endsWith('/dishes')) {
    try {
      const { dishes, allergens, unsafeIngredients } = await getDishes();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: {
            dishes,
            allergens,
            unsafeIngredients,
          },
        }),
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
}

async function getDishes() {
  try {
    const db = await getDb(); // Get the database connection
    const limit = 10;

    // get employees
    const employees = await Employee.find({}).exec();

    // get employees allergies
    const employeesAllergensArray = employees.flatMap(
      (employee) => employee.allergies || []
    );

    // get dishes from the database
    const databaseDishes = await Dish.find({})
      // limit if needed
      //.limit(limit)
      .exec();

    const allergensSet = new Set(employeesAllergensArray); // collection of unique values from employees allergens

    // Fetch all dishes excluding allergens
    const safeDishes = databaseDishes.filter(
      (dish) =>
        !dish.allergens.some((dishAllergen) => allergensSet.has(dishAllergen))
    );

    const dishes = safeDishes.map((dish, index) => {
      return {
        ...dish.toObject(),
      };
    });

    console.log(employeesAllergensArray);
    return {
      dishes,
      allergens: [...allergensSet],
    };
  } catch (error) {
    console.error('Error fetching dishes:', error);
    throw new Error('Error fetching dishes');
  }
}

module.exports.handler = handler;
