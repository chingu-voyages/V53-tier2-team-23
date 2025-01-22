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

  if (httpMethod === 'GET' && path.endsWith('/employees')) {
    try {
      const { employees, employeesNumber } = await getEmployees();
      console.log(employees);

      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          data: {
            employees,
            employeesNumber,
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

  if (
    httpMethod === 'GET' &&
    path.includes('/employees/') &&
    !path.includes('/dishes')
  ) {
    const employeeId = path.split('/')[4]; // Extract employee ID // Extract employee id from path
    console.log(employeeId);
    try {
      const employee = await getEmployee(employeeId);
      if (!employee) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Employee not found' }),
        };
      }
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          data: {
            employee,
            employeeId,
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

  if (
    httpMethod === 'GET' &&
    path.includes('/employees/') &&
    path.includes('/dishes')
  ) {
    try {
      const employeeId = path.split('/')[4]; // '/employees/{id}/dishes'
      const { employee, dishes } = await getEmployeeDishes(employeeId);
      console.log('httpreq:', employeeId);
      if (!dishes) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            message: 'Dishes not found for Employee with id: ' + employeeId,
          }),
        };
      }
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({
          success: true,
          data: {
            employee,
            dishes,
            employeeId,
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

// GET request handler for all employees
async function getEmployees() {
  try {
    const db = await getDb(); // Get the database connection

    // Fetch all employees using Mongoose
    const foundEmployees = await Employee.find({})
      .populate('allergies', 'allergenName -_id') // Populate allergies with allergenName and exclude _id
      .lean();

    const employees = foundEmployees.map((employee) => ({
      ...employee,
      allergies: employee.allergies || [], // if array allergies empty
    }));

    console.log(employees);
    const employeesNumber = await Employee.countDocuments(); // Get total employees

    return {
      employees,
      employeesNumber,
    };
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw new Error('Failed to fetch employees');
  }
}

// GET request handler for employee with id
async function getEmployee(employeeId) {
  try {
    const db = await getDb();
    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      // check if valid mongodb id
      // https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/
      // throw new Error('employee id not valid');
    }

    // Find employee by _id using with findById() method
    // const mongooseEmployeeId = new mongoose.Types.ObjectId(employeeId); // create the ObjectId
    // const employee = await Employee.findById(mongooseEmployeeId);
    const foundEmployee = await Employee.findById(employeeId)
      .populate('allergies', 'allergenName -_id') // Populate allergies with allergenName and exclude _id
      .lean();

    const employee = {
      ...foundEmployee,
      allergies: foundEmployee.allergies || [],
    };
    // console.log('employeeId:', employeeId);
    // console.log('employee:', employee);
    return employee || null;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw new Error('Error fetching employee');
  }
}

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

async function getEmployeeDishes(employeeId) {
  try {
    const db = await getDb();
    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      console.log(employeeId);
      // check if valid mongodb id [ https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/ ]
      throw new Error('employee id not valid');
    }

    // Find employee by _id using with findById() method
    // const mongooseEmployeeId = new mongoose.Types.ObjectId(employeeId); // create the ObjectId
    // const employee = await Employee.findById(mongooseEmployeeId);
    const employee = await Employee.findById(employeeId)
      .populate('allergies') // replace referenced ObjectIDs with actual values from allergens [ https://www.geeksforgeeks.org/mongoose-populate-method/ ]
      .exec(); // executes the query and returns a Promise [ https://dev.to/asim_khan_cbe65e41bcbbc65/the-power-of-exec-in-mongoose-unlocking-better-query-execution-17fd ]

    const dietaryRestrictions = employee.dietaryRestrictions; // get employee dietaryRestrictions
    const allergyIds = employee.allergies.map((allergen) => allergen._id); // get employee allergy ids

    // https://www.mongodb.com/docs/manual/reference/operator/query/nin/
    // https://www.mongodb.com/docs/manual/reference/operator/query/in/
    const dishes = await Dish.find({
      category: { $in: dietaryRestrictions }, // Match categories
      allergens: { $nin: allergyIds }, // Exclude allergens
    });
    // console.log('employeeId:', employeeId);
    // console.log('employee:', employee);
    return (
      {
        employee,
        dishes,
      } || null
    );
  } catch (error) {
    console.error('Error fetching employee:', error);
    console.log(employeeId);
    throw new Error('Error fetching employee');
  }
}

// create class Employee
class EmployeeObject {
  constructor(reqBody, allergens) {
    this.employeeName = reqBody.employeeName;
    this.allergies = allergens;
    this.dietaryRestrictions = reqBody.dietaryRestrictions;
  }
}

// POST request handler to create employee
async function createEmployee(body) {
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

    // Create the employee object with the allergens and dietary restrictions
    const employeeData = new EmployeeObject(reqBody, allergenIds);
    // const employeeData = {
    //   employeeName: reqBody.employeeName,
    //   allergies: allergens, // Include the ObjectIds of the allergens
    //   dietaryRestrictions: reqBody.dietaryRestrictions, // Dietary restrictions as they are
    // };

    const newEmployee = new Employee(employeeData); // create an new employee from model

    const savedEmployee = await newEmployee.save(); // save to database

    // Populate the allergies field to get the full allergen documents
    const employee = await Employee.findById(savedEmployee._id)
      .populate('allergies') // replace ObjectIds with Allergen
      .exec();

    // Return the new employee
    return employee;
  } catch (error) {
    console.error('Error adding new employee:', error);

    // Return error response
    throw new Error('Error adding new employee');
  }
}

module.exports.handler = handler;
