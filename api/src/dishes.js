const mongoose = require('mongoose');
const getDb = require('./db_config/database.config.js'); // import getDatabase database from connection
const Allergen = require('./models/allergen.model'); // Import the Allergen model
const Dish = require('./models/dish.model'); // Import dish model
const { ObjectId } = require('mongodb'); // import ObjectId method to convert the _id field value to string [ https://www.mongodb.com/docs/manual/reference/method/ObjectId/ ]

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const handler = async (event, context) => {
  //async function handler(event, context) {
  const { httpMethod, path, queryStringParameters, body } = event;

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers, // Return CORS headers for preflight
      body: JSON.stringify({ success: true }),
    };
  }

  if (httpMethod === 'GET' && path.endsWith('/dishes')) {
    try {
      const { dishes, dishesNumber } = await getDishes();

      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          data: {
            dishes: dishes,
            dishesNumber: dishesNumber,
          },
        }),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'An internal server error occurred.',
          error: error.message, // Include error details for debugging
        }),
      };
    }
  }

  if (httpMethod === 'GET' && path.includes('/dishes/')) {
    const dishId = path.split('/').pop(); // Extract dish id from path
    try {
      const dish = await getDish(dishId);
      if (!dish) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'dish not found' }),
        };
      }
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          data: {
            dish: dish,
            dishId: dishId,
          },
        }),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'An internal server error occurred.',
          error: error.message, // Include error details for debugging
        }),
      };
    }
  }

  if (httpMethod === 'POST' && path.endsWith('/dishes/create')) {
    try {
      const dish = await createdish(body);
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          data: dish.data,
        }),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'An internal server error occurred.',
          error: error.message, // Include error details for debugging
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers, // Include the headers in the response
    body: JSON.stringify({
      success: false,
      message: 'Method Not Allowed',
    }),
  };
};

// GET request handler for all dishes
async function getDishes() {
  try {
    const db = await getDb(); // Get the database connection

    // Fetch all dishes using Mongoose
    const dishes = await Dish.find({});
    const dishesNumber = await Dish.countDocuments(); // Get total dishes

    return {
      dishes: dishes,
      dishesNumber: dishesNumber,
    };
  } catch (error) {
    console.error('Error fetching dishes:', error);
    throw new Error('Failed to fetch dishes');
  }
}

// GET request handler for dish with id
async function getDish(dishId) {
  try {
    const db = await getDb();
    if (!dishId || !ObjectId.isValid(dishId)) {
      // check if valid mongodb id
      // https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/
      throw new Error('dish id not valid');
    }

    // Find dish by _id using with findById() method
    // const mongoosedishId = new mongoose.Types.ObjectId(dishId); // create the ObjectId
    // const dish = await dish.findById(mongoosedishId);
    const dish = await Dish.findById(dishId);
    // console.log('dishId:', dishId);
    // console.log('dish:', dish);
    return dish || null;
  } catch (error) {
    console.error('Error fetching dish:', error);
    throw new Error('Error fetching dish');
  }
}

// create class dish
class dishObject {
  constructor(reqBody) {
    this.category = reqBody.category;
    this.dishName = reqBody.dishName;
    this.ingrediends = reqBody.ingrediends;
    this.allergens = reqBody.allergens;
    this.calories = reqBody.calories;
    this.imageUrl = reqBody.imageUrl;
  }
}

// POST request handler to create dish
async function createDish(body) {
  try {
    const db = await getDb();

    // Parse the body
    const reqBody = JSON.parse(body); // Parse JSON string into an object

    // Fetch all allergens [ https://www.mongodb.com/docs/manual/reference/operator/query/in/ ]
    // $in  → Finds all documents where allergenName is in the provided array.
    const allergens = await Allergen.find({
      allergenName: {
        $in: reqBody.allergies.map((allergen) => allergen.toLowerCase()),
      },
    });

    // allergens ids
    const allergenIds = allergens.map((allergen) => allergen._id);

    // Create the dish object with the allergens and dietary restrictions
    const dishData = new dishObject(reqBody, allergenIds);
    // const dishData = {
    //   dishName: reqBody.dishName,
    //   allergies: allergens, // Include the ObjectIds of the allergens
    //   dietaryRestrictions: reqBody.dietaryRestrictions, // Dietary restrictions as they are
    // };

    const newdish = new dish(dishData); // create an new dish from model

    const saveddish = await newdish.save(); // save to database

    // Populate the allergies field to get the full allergen documents
    const dish = await dish
      .findById(saveddish._id)
      .populate('allergies') // replace ObjectIds with Allergen
      .exec();

    // Return the new dish
    return dish;
  } catch (error) {
    console.error('Error adding new dish:', error);

    // Return error response
    throw new Error('Error adding new dish');
  }
}

module.exports.handler = handler;
