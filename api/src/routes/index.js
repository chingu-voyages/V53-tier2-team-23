const EmployeeController = require('../controllers/employee.controllers');
const AllergenController = require('../controllers/allergen.controllers');

function setRoutes(app) {
  const employeeController = new EmployeeController();
  const allergenController = new AllergenController();

  app.post(
    '/employee',
    employeeController.createEmployee.bind(employeeController)
  );

  app.get('/employee', employeeController.getEmployee.bind(employeeController));

  app.post(
    '/allergen',
    allergenController.createAllergen.bind(allergenController)
  );
}

module.exports = setRoutes;
