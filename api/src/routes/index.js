const EmployeeController = require('../controllers/employee.controllers');
const AllergenController = require('../controllers/allergen.controllers');

function setRoutes(app) {
  const employeeController = new EmployeeController();
  const allergenController = new AllergenController();

  app.post(
    '/employee',
    employeeController.createEmployee.bind(employeeController)
  );

  app.get(
    '/employee',
    employeeController.getAllEmployee.bind(employeeController)
  );

  app.get(
    '/employee/:employeeId',
    employeeController.getEmployee.bind(employeeController)
  );

  app.put(
    '/employee/:employeeId',
    employeeController.editEmployee.bind(employeeController)
  );

  app.delete(
    '/employee/:employeeId',
    employeeController.deleteEmployee.bind(employeeController)
  );

  app.post(
    '/allergen',
    allergenController.createAllergen.bind(allergenController)
  );

  app.get(
    '/allergen',
    allergenController.getAllAllergen.bind(allergenController)
  );
}

module.exports = setRoutes;
