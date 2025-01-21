const mongoose = require('mongoose');
const connectDatabase = require('../config/database.config');
const Employee = require('../models/employee.models');

exports.handler = async (event) => {
  await connectDatabase();

  if (event.httpMethod === 'POST') {
    try {
      const { employeeId, employeeName, allergies, dietaryRestrictions } =
        JSON.parse(event.body);

      if (!employeeId || !employeeName) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Employee ID and Employeee Name are required.',
          }),
        };
      }

      const newEmployee = await Employee.create({
        employeeId,
        employeeName,
        allergies,
        dietaryRestrictions,
      });

      return {
        statusCode: 200,
        body: JSON.stringify(newEmployee),
      };
    } catch (error) {
      console.error('Error creating employee: ', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed.' }),
  };
};
