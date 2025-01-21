const mongoose = require('mongoose');
const getDb = require('./db_config/database.config.js'); // import getDatabase database from connection
const Allergen = require('./models/allergen.model'); // Import the Allergen model
const Employee = require('./models/employee.model'); // Import employee model
const Dish = require('./models/dish.model'); // Import dish model
//const { ObjectId } = require('mongodb'); // import ObjectId method to convert the _id field value to string [ https://www.mongodb.com/docs/manual/reference/method/ObjectId/ ]

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

  if (httpMethod === 'GET' && path.includes('/allergens/')) {
    const allergenId = path.split('/')[4]; // Extract allergen ID // Extract allergen id from path
    console.log(path);
    try {
      const allergen = await getAllergen(allergenId);
      if (!allergen) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Allergen not found' }),
        };
      }
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          data: {
            allergen,
            allergenId,
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

// GET request handler for employee with id
async function getAllergen(allergenId) {
  try {
    const db = await getDb();
    if (!allergenId || !mongoose.Types.ObjectId.isValid(allergenId)) {
      console.log(allergenId);
      // check if valid mongodb id
      // https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/
      // throw new Error('employee id not valid');
    }

    // Find employee by _id using with findById() method
    // const mongooseEmployeeId = new mongoose.Types.ObjectId(employeeId); // create the ObjectId
    // const employee = await Employee.findById(mongooseEmployeeId);
    const allergen = await Allergen.findById(allergenId);
    // console.log('employeeId:', employeeId);
    // console.log('employee:', employee);
    return allergen || null;
  } catch (error) {
    console.error('Error fetching allergen:', error);
    throw new Error('Error fetching allergen');
  }
}

module.exports.handler = handler;
