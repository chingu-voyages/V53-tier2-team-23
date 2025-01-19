const mongoose = require('mongoose');
const employee = require('./models/employee.model'); // Import employee model
const getDb = require('./db_config/database.config.js'); // import getDatabase database from connection
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

  if (httpMethod === 'GET' && path.endsWith('/employees')) {
    try {
      const employees = await getData('employees');
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          data: {
            employees: employees,
            employeesLength: employees.length,
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

  if (httpMethod === 'GET' && path.includes('/employees/')) {
    const employeeId = path.split('/').pop(); // Extract employee id from path

    try {
      const employee = await getEmployee(employeeId, 'employees');
      if (!employeeId || !ObjectId.isValid(employeeId)) {
        // check if valid mongodb id
        // https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'employee not found' }),
        };
      }
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          employeeId: employeeId,
          data: employee,
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

  if (httpMethod === 'POST' && path.startsWith('/employees/create')) {
    // Set headers for the response
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    try {
      const employee = await createEmployee(body);
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({ success: true, data: employee.data }),
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

// GET request handler for all employees
async function getData(collectionValue) {
  // const db = await getDb();

  // const collection = await db.collection(collectionValue);
  // const data = await collection.find({}).toArray();

  const data = await employee.find({}); // Fetch all employees using Mongoose

  // Debugging output to check the fetched data
  // console.log('Fetched employees:', data);

  return data;
}

// GET request handler for employee with id
async function getEmployee(employeeId, collectionValue) {
  // const db = await getDb();
  // const collection = await db.collection(collectionValue);
  // const query = { _id: new ObjectId(employeeId) }; // set new query employee id based on entry in the database having the _id field
  /* [ https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/ ]
    findOne(query) looks for a single document in the collection that matches the criteria in query (_id).
   */
  const employee = await collection.findOne(query);
  return employee;
}

// POST request handler to create project

async function createEmployee(body) {
  try {
    // Parse the body
    const reqbody = JSON.parse(body); // Parse JSON string into an object
    const newEmployee = new Employee(reqBody); // create an new employee from model
    const employees_db = await getdb();
    const collection = await projects_db.collection('employees');

    const employee = await collection.insertOne(newEmployee);

    newEmployee._id = employee.insertedId;

    // Return the new project along with its MongoDB _id
    return {
      success: true,
      data: newEmployee,
    };
  } catch (error) {
    console.error('Error adding new project:', error);

    // Return error response
    throw new Error('Error adding new project');
  }
}

module.exports.handler = handler;
