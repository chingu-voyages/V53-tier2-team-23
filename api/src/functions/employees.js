const mongoose = require('mongoose');
const connectDatabase = require('../config/database.config');
const authenticate = require('../functions/authMiddleware');
const Employee = require('../models/employee.models');

// Validations
const validAllergies = [
  'peanuts',
  'shellfish',
  'fish',
  'corn',
  'soy',
  'egg',
  'dairy',
  'tree nuts',
  'legumes',
  'sesame seeds',
  'milk',
  'wheat',
  'mustard',
  'gluten',
  'coconut',
];

/* const validDiet = [
  'vegetarian',
  'vegan',
  'pescatarian',
  'keto',
  'paleo',
  'glutenFree',
  'standard',
  'lactose-free',
  'diabetes-friendly',
]; */

// helper function to validate items against a valid list
const validateItems = (items, validItems) => {
  return items.filter((item) => !validItems.includes(item));
};

const handleError = (error, method) => {
  console.error(`Error ${method} employee: `, error);
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ error: error.message }),
  };
};

const sendResponse = (statusCode, message, data = null) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*', // Allows all origins
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
  body: JSON.stringify(data ? { message, data } : { message }),
});

// helper function to update the employee's field if provided
// const updateEmployeeField = (employee, field, value) => {
//   if (val) {
//     employee[field] = value;
//   }
// };

// helper function to update allergies and diet based on input
const updateEmployeeAllergiesAndDiet = (
  employee,
  allergiesToAdd,
  allergiesToRemove,
  dietToAdd,
  dietToRemove
) => {
  if (allergiesToAdd) {
    const invalidAllergies = validateItems(allergiesToAdd, validAllergies);
    if (invalidAllergies.length > 0) {
      return { error: `Invalid allergies: ${invalidAllergies.join(', ')}` };
    }
    employee.allergies.push(...allergiesToAdd);
  }
  if (allergiesToRemove) {
    employee.allergies = employee.allergies.filter(
      (allergy) => !allergiesToRemove.includes(allergy)
    );
  }

  if (dietToAdd) {
    const invalidDiet = validateItems(dietToAdd, validDiet);
    if (invalidDiet.length > 0) {
      return { error: `Invalid diet: ${invalidDiet.join(', ')}` };
    }
    employee.dietaryRestrictions.push(...dietToAdd);
  }

  if (dietToRemove) {
    employee.dietaryRestrictions = employee.dietaryRestrictions.filter(
      (diet) => !dietToRemove.includes(diet)
    );
  }

  return null; // No errors
};

exports.handler = async (event) => {
  await connectDatabase();
  const { httpMethod, path, body, queryStringParameters } = event;

  // Handle CORS Preflight Requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  // Check authentication for all methods except GET
  if (httpMethod !== 'GET') {
    const authResult = authenticate(event);
    if (authResult.statusCode !== 200) {
      return authResult; // Return early if authentication fails
    }

    // Proceed if authenticated
    const user = authResult.user;
  }

  const employeeId = path.split('/').pop(); // get the employeeId from the URL path

  // create new employee. removed employeId since database didn't include it
  if (httpMethod === 'POST' && path.endsWith('/employees')) {
    try {
      const { employeeName, allergies } = JSON.parse(body);

      if (!employeeName) {
        return sendResponse(400, 'Employeee Name is required.');
      }

      const newEmployee = await Employee.create({
        employeeName,
        allergies,
      });

      return sendResponse(200, 'Employee created successfully', newEmployee);
    } catch (error) {
      return handleError(error, 'creating');
    }
  }

  // getting all employees
  if (httpMethod === 'GET' && path.endsWith('/employees')) {
    try {
      const employees = await Employee.find();
      return {
        statusCode: 200,
        body: JSON.stringify(employees),
      };
    } catch (error) {
      return handleError(error, 'fetching');
    }
  }

  // getting employee info with the id, e.g. /.netlify/functions/employees/678d1c696b29fd6dada99317
  if (httpMethod === 'GET' && path.endsWith(`/employees/${employeeId}`)) {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Employee not found' }),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(employee),
      };
    } catch (error) {
      return handleError(error, 'fetching');
    }
  }

  // editing employee info
  if (httpMethod === 'PUT' && path.endsWith(`/employees/${employeeId}`)) {
    try {
      const {
        employeeName,
        allergiesToAdd,
        allergiesToRemove,
        dietToAdd,
        dietToRemove,
      } = JSON.parse(body);

      // Fetch the employee from the database
      const employee = await Employee.findById(employeeId);

      if (!employee) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Employee not found.' }),
        };
      }

      // update name if provided
      if (employeeName) {
        employee.employeeName = employeeName;
      }

      const error = updateEmployeeAllergiesAndDiet(
        employee,
        allergiesToAdd,
        allergiesToRemove,
        dietToAdd,
        dietToRemove
      );
      if (error) {
        return { statusCode: 400, body: JSON.stringify({ error: error }) };
      }

      // Save the updated employee
      const updatedEmployee = await employee.save();

      return {
        statusCode: 200,
        body: JSON.stringify(updatedEmployee),
      };
    } catch (error) {
      return handleError(error, 'editing');
    }
  }

  // delete employee info
  if (httpMethod === 'DELETE' && path.endsWith(`/employees/${employeeId}`)) {
    try {
      const employee = await Employee.findOneAndDelete(employeeId);
      if (!employee) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Employee not found' }),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Employee deleted successfully' }),
      };
    } catch (error) {
      return handleError(error, 'deleting');
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed.' }),
  };
};
