const mongoose = require('mongoose');
const connectDatabase = require('../config/database.config');
const authenticate = require('../functions/authMiddleware');
const Employee = require('../models/employee.models');

// Validations
const validAllergies = [
  'no allergies',
  'gluten',
  'dairy',
  'egg',
  'seafood',
  'soy',
  'tree nuts',
  'peanuts',
  'legumes',
  'sesame seeds',
  'corn',
  'mustard',
  'allium',
  'coconut',
  'fruits',
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
      'Access-Control-Allow-Origin':
        'http://localhost:5173, https://chingu-voyages.github.io/V53-tier2-team-23',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
    body: JSON.stringify({ error: error.message }),
  };
};

const sendResponse = (statusCode, message, data = null) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin':
      'http://localhost:5173, https://chingu-voyages.github.io/V53-tier2-team-23',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
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

// https://www.geeksforgeeks.org/mongoose-queries-model-findbyidandupdate-function/
// https://www.geeksforgeeks.org/mongoose-findbyidandupdate-function/
async function updateEmployeeAllergies(employeeId, changedAllergies) {
  try {
    const updatedEmployeeAllergies = await Employee.findByIdAndUpdate(
      employeeId,
      { allergies: changedAllergies }, // update allergies
      { new: true } // new: This is a boolean-type option. If true, return the modified document rather than the original.
    );

    if (!updatedEmployeeAllergies) {
      return { error: 'Employee not found.' };
    }

    return updatedEmployeeAllergies;
  } catch (error) {
    console.error('Error updating allergies:', error);
    return { error: 'Error updating allergies.' };
  }
}

exports.handler = async (event) => {
  await connectDatabase();
  const { httpMethod, path, body, queryStringParameters } = event;

  const allowedOrigins = [
    'http://localhost:5173',
    'https://chingu-voyages.github.io/V53-tier2-team-23',
    'https://eato-meatplanner.netlify.app',
    'https://eatodishes.netlify.app',
    'http://localhost:5173',
  ];

  const origin = event.headers.origin;

  console.log('Received Authorization Header:', event.headers.authorization);
  console.log('Received Authorization origin:', origin);

  // Handle CORS Preflight Requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content
      headers: {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin)
          ? origin
          : '',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: '',
    };
  }

  //Check authentication for all methods except GET
  if (httpMethod !== 'GET') {
    const authResult = authenticate(event);
    console.log('authResult: ', authResult);
    if (authResult.statusCode !== 200) {
      return authResult; // Return early if authentication fails
    }

    // Proceed if authenticated
    const user = authResult.user;
    console.log(`Authenticated user: ${user.id}`);
  }

  const employeeId = path.split('/').pop(); // get the employeeId from the URL path
  const employeeName = path.split('/').pop(); // get the employeeName from the URL path

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
      return sendResponse(200, 'Employees retrieved successfully', employees);
    } catch (error) {
      return handleError(error, 'fetching');
    }
  }

  // getting employee info with the name, e.g. /.netlify/functions/employees/Leon
  if (httpMethod === 'GET' && path.endsWith(`/employees/${employeeName}`)) {
    try {
      const employee = await Employee.findOne({ employeeName });
      const employeeId = employee._id;
      if (!employee) {
        return sendResponse(404, 'Employee not found.');
      }
      return sendResponse(200, 'Employee retrieved successfully', {
        employee,
        employeeId,
      });
    } catch (error) {
      return handleError(error, 'fetching');
    }
  }

  // edit employee allergies
  if (
    httpMethod === 'PUT' &&
    path.endsWith(`/employees/allergies/${employeeId}`)
  ) {
    try {
      const { allergies } = JSON.parse(body);

      if (!employeeId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing employeeId' }),
        };
      }

      if (!Array.isArray(allergies)) {
        return sendResponse(400, 'Invalid allergies data. Expected an array.');
      }

      const updatedEmployee = await updateEmployeeAllergies(
        employeeId,
        allergies
      );

      if (!updatedEmployee) {
        return sendResponse(404, 'Employee not found.');
      }

      // Successfully updated the employee's allergies
      return sendResponse(
        200,
        'Employee allergies updated successfully',
        updatedEmployee
      );
    } catch (error) {
      return handleError(error, 'editing');
    }
  }

  // getting employee info with the id, e.g. /.netlify/functions/employees/678d1c696b29fd6dada99317
  if (httpMethod === 'GET' && path.endsWith(`/employees/${employeeId}`)) {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return sendResponse(404, 'Employee not found.');
      }
      return sendResponse(200, 'Employee retrieved successfully', employee);
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
        return sendResponse(400, 'Invalid input', error);
      }

      // Save the updated employee
      const updatedEmployee = await employee.save();

      return sendResponse(
        200,
        'Employee updated successfully',
        updatedEmployee
      );
    } catch (error) {
      return handleError(error, 'editing');
    }
  }

  // delete employee info
  if (httpMethod === 'DELETE' && path.endsWith(`/employees/${employeeId}`)) {
    try {
      const employee = await Employee.findOneAndDelete(employeeId);
      if (!employee) {
        return sendResponse(404, 'Employee not found.');
      }
      return sendResponse(200, 'Employee deleted successfully');
    } catch (error) {
      return handleError(error, 'deleting');
    }
  }

  return sendResponse(405, 'Method not allowed.');
};
