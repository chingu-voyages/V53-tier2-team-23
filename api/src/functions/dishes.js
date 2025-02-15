const mongoosee = require('mongoose');
const Dishes = require('../models/dishes.models');
const Employee = require('../models/employee.models');
const Image = require('../models/image.model');
const connectDatabase = require('../config/database.config');
const authenticate = require('../functions/authMiddleware');

const handleError = (error, method) => {
  console.error(`Error ${method} employee: `, error);
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: JSON.stringify({ error: error.message }),
  };
};

exports.handler = async (event) => {
  await connectDatabase();
  const { httpMethod, path } = event;
  const dishesId = path.split('/').pop();

  // Handle CORS Preflight Requests (added authorization)
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

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
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      };
    } catch (error) {
      return handleError(error, 'fetching');
    }
  }

  // getting filtered dishes excluding employees allergens
  if (
    httpMethod === 'GET' &&
    path.includes('/dishes/') &&
    path.endsWith('/filtered')
  ) {
    try {
      const { dishes, allergens } = await getFilteredDishes();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: {
            dishes,
            allergens,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(dish),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  };
};

async function getFilteredDishes() {
  try {
    // get employees
    const employees = await Employee.find({}).exec();

    // get employees allergies
    const employeesAllergensArray = employees.flatMap((employee) =>
      employee.allergies.filter((allergen) => allergen !== 'no allergies')
    );
    // collection of unique values from employees allergens
    const allergensSet = new Set(employeesAllergensArray);

    // get dishes from the database
    const databaseDishes = await Dishes.find({}).exec();

    const images = await Image.find({}).exec();

    // Fetch all dishes excluding allergens
    const safeDishes = databaseDishes.filter(
      (dish) =>
        !dish.allergens.some((dishAllergen) =>
          [...allergensSet].some(
            (allergen) =>
              dishAllergen.includes(allergen) || allergensSet.has(dishAllergen)
          )
        )
    );

    const dishes = safeDishes.map((dish, index) => {
      const imageUrl = images[index]?.url
        ? `https://res.cloudinary.com/dspxn4ees/image/upload/${images[index].url}.jpg`
        : '';
      return {
        ...dish.toObject(),
        imageUrl,
      };
    });

    console.log(databaseDishes);
    return {
      dishes,
      allergens: [...allergensSet],
    };
  } catch (error) {
    console.error('Error fetching dishes:', error);
    throw new Error('Error fetching dishes');
  }
}
