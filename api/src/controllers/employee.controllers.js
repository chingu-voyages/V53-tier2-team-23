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

  async getAllEmployee(req, res) {
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

  async getEmployee(req, res) {
    try {
      const { employeeId } = req.params;
      const employee = await Employee.findOne({ employeeId })
        .populate('allergies')
        .exec();

      if (!employee) {
        return res.status(404).send('Employee not found');
      }

      res.send(employee);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async editEmployee(req, res) {
    try {
      const { employeeName, allergies, dietaryRestrictions } = req.body;

      // dynamically construct the update object due to the unprovided value in the databse being overwritten with null or undefined
      // e.g. when only changing employeeName, allergen became null
      const updateData = {};
      if (employeeName) updateData.employeeName = employeeName;
      if (allergies) updateData.allergies = allergies;
      if (dietaryRestrictions)
        updateData.dietaryRestrictions = dietaryRestrictions;

      const updatedEmployee = await Employee.findOneAndUpdate(
        { employeeId: req.params.employeeId },
        updateData,
        { new: true }
      );

      if (!updatedEmployee) {
        return res.status(404).send('Employee not found');
      }

      res.send(updatedEmployee);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async deleteEmployee(req, res) {
    try {
      const { employeeId } = req.params;

      const deletedEmployee = await Employee.findOneAndDelete({ employeeId });
      if (!deletedEmployee) {
        return res.status(404).send('Employee not found');
      }

      res.send('Employee has been deleted.');
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = EmployeeController;
