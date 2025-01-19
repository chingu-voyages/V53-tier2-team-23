const mongoose = require('mongoose');
const getDb = require('./db_config/database.config.js'); // import getDatabase database from connection
const Employee = require('./models/employee.model'); // Import employee model
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
      const employees = await getEmployees();
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
    console.log('getemployeeId: ', employeeId);
    try {
      const employee = await getEmployee(employeeId);
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          employeeId: employeeId,
          data: employee.data,
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

  if (httpMethod === 'POST' && path.endsWith('/employees/create')) {
    try {
      const employee = await createEmployee(body);
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          data: employee.data,
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

// GET request handler for all employees
async function getEmployees() {
  try {
    const db = await getDb(); // Get the database connection

    // Fetch all employees using Mongoose
    const data = await Employee.find({});

    return data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw new Error('Failed to fetch employees');
  }
}

// GET request handler for employee with id
async function getEmployee(employeeId) {
  try {
    if (!employeeId || !ObjectId.isValid(employeeId)) {
      // check if valid mongodb id
      // https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'employeeId not found' }),
      };
    }

    const db = await getDb();
    // Find employee by _id using with findById() method
    const mongooseEmployeeId = new mongoose.Types.ObjectId(employeeId); // Use `new` to create the ObjectId
    const employee = await Employee.findById(mongooseEmployeeId);
    console.log('employeeId:', employeeId);
    console.log('employee:', employee);
    if (!employee) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Employee not found' }),
      };
    }
    return employee;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw new Error('Error fetching employee');
  }
}

// POST request handler to create employee

async function createEmployee(body) {
  try {
    const db = await getDb();
    // Parse the body
    const reqbody = JSON.parse(body); // Parse JSON string into an object
    const newEmployee = new Employee(reqBody); // create an new employee from model

    const employee = await newEmployee.save();

    // Return the new employee along with its MongoDB _id
    return employee;
  } catch (error) {
    console.error('Error adding new project:', error);

    // Return error response
    throw new Error('Error adding new project');
  }
}

module.exports.handler = handler;
