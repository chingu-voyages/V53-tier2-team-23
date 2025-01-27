const mongoose = require('mongoose');
const getDb = require('./db_config/database.config.js'); // import getDatabase database from connection
const Employee = require('./models/employee.model'); // Import employee model
const Dish = require('./models/dish.model'); // Import dish model

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
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
            dishes: dishes,
            allergens: allergensSet,
            unsafeIngredients: unsafeIngredients,
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

    const employees = await Employee.find({}).exec();

    const allergensArray = employees.flatMap(
      (employee) => employee.allergies || []
    );

    const databaseDishes = await Dish.find({})
      // limit if needed
      //.limit(limit)
      .exec();

    const ingredientsArray = databaseDishes.flatMap(
      (dish) => dish.ingredients.map((ingredient) => ingredient.toLowerCase()) // return ingredients in lowercase
    );

    const allergensSet = new Set(allergensArray); // collection of unique values
    const ingredientsSet = new Set(ingredientsArray);

    // Fetch all dishes excluding allergens
    const safeDishes = databaseDishes.filter((dish) =>
      dish.ingredients.every((ingredient) =>
        allergensArray.every(
          (allergen) => !ingredient.toLowerCase().includes(allergen) // Ensure allergen is not part of the ingredient
        )
      )
    );

    const unsafeIngredients = [...ingredientsSet].filter((ingredient) =>
      [...allergensSet].some(
        (allergen) => ingredient.includes(allergen) // Check if allergen is a substring of the ingredient
      )
    );

    const dishes = safeDishes.map((dish, index) => {
      return {
        ...dish.toObject(),
      };
    });

    return {
      dishes,
      allergens: [...allergensSet],
      unsafeIngredients,
    };
  } catch (error) {
    console.error('Error fetching dishes:', error);
    throw new Error('Error fetching dishes');
  }
}

module.exports.handler = handler;
