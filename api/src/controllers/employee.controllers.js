const Employee = require('../models/employee.models');

class EmployeeController {
  async createEmployee(req, res) {
    const { employeeId, employeeName, allergies, dietaryRestrictions } =
      req.body;

    if (!employeeId) {
      return res.status(400).send('Employee Id is required');
    }
    if (!employeeName) {
      return res.status(400).send('Employee Name is required');
    }

    try {
      const newEmployee = await Employee.create({
        employeeId,
        employeeName,
        allergies,
        dietaryRestrictions,
      });
      res.status(200).send(newEmployee);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getEmployee(req, res) {
    try {
      const employees = await Employee.find()
        .populate('allergies') // Populates the allergies field with the actual Allergen documents referenced by their ObjectId
        .exec(); // Executes the query asynchronously and returns the resulting data, which includes the fully populated employee details
      const employeesObject = employees.map((employee) => employee.toObject()); // Convert each employee document to plain plain JavaScript objects, preserving Mongoose methods.
      res.send(employeesObject);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = EmployeeController;
