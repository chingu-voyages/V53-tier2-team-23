const getDb = require('./db_config/database.config.js'); // import getDatabase database from connection
const { ObjectId } = require('mongodb'); // import ObjectId method to convert the _id field value to string [ https://www.mongodb.com/docs/manual/reference/method/ObjectId/ ]

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// CreateProject class
class DishesObjectClass {
  constructor(dish) {
    this.id = dish._id;
    this.category = dish.category;
    this.dishName = dish.dishName;
    this.ingredients = dish.ingredients;
    this.allergens = dish.allergens;
    this.imageUrl = dish.imageUrl;
  }
}

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
      const dishesData = await getData('dishes');
      // console.log('dishesData:', dishesData);
      // const parsedDishesData =
      //   typeof dishesData === 'string' ? JSON.parse(dishesData) : dishesData;
      // console.log('parsedDishesData:', parsedDishesData);
      const dishesArray = dishesData.body;
      const dishes = Array.isArray(dishesArray) //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
        ? dishesArray.map((dish) => new DishesObjectClass(dish))
        : []; // else empty array
      console.log('dishes:', dishesArray);
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          data: {
            dishes: dishes,
            dishesLength: dishes.length,
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

  return {
    statusCode: 405,
    headers, // Include the headers in the response
    body: JSON.stringify({
      success: false,
      message: 'Method Not Allowed',
    }),
  };
};

// GET request handler for all projects
async function getData(collection_value) {
  const db = await getDb();
  const collection = await db.collection(collection_value);
  const data = await collection.find({}).toArray();

  // Debugging output to check the fetched data
  // console.log('Fetched dishes:', data);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(data),
  };
}

module.exports.handler = handler;
