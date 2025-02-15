import mongoose from 'mongoose';
import Dishes from '../models/dishes.models';
import Employee from '../models/employee.models';
import Image from '../models/image.model';
import connectDatabase from '../config/database.config';
import authenticate from '../functions/authMiddleware';

const allowedOrigins = [
  'https://chingu-voyages.github.io',
  'https://eato-meatplanner.netlify.app',
  'https://eatodishes.netlify.app',
  'http://localhost:5173',
];

// const getAllowedOrigin = (event) => {
//   const origin = event.headers?.origin || '';
//   return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
// };

const getAllowedOrigin = () => '*';

const handleError = (error, method, event) => {
  const allowedOrigin = getAllowedOrigin(event);
  console.error(`Error ${method} employee: `, error);
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
    body: JSON.stringify({ error: error.message }),
  };
};

const sendResponse = (statusCode, message, data = null, event) => {
  const allowedOrigin = getAllowedOrigin(event);
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
    body: JSON.stringify(data ? { message, data } : { message }),
  };
};

exports.handler = async (event) => {
  await connectDatabase();
  const { httpMethod, path } = event;
  const dishesId = path.split('/').pop();

  const allowedOrigin = getAllowedOrigin(event);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
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
      return sendResponse(200, 'Dishes fetched successfully', dishes, event);
    } catch (error) {
      return handleError(error, 'fetching', event);
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

      return sendResponse(
        200,
        'Filtered dishes fetched successfully',
        { dishes, allergens },
        event
      );
    } catch (error) {
      return handleError(error, 'fetching', event);
    }
  }

  // getting specific dish
  if (httpMethod === 'GET' && path.endsWith(`/dishes/${dishesId}`)) {
    try {
      const dish = await Dishes.findById(dishesId);
      if (!dish) {
        return sendResponse(404, 'Dish not found', null, event);
      }
      return sendResponse(200, 'Dish fetched successfully', dish, event);
    } catch (error) {
      return handleError(error, 'fetching', event);
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed.' }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': getAllowedOrigin(event),
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
