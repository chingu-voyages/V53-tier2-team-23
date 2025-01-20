const Dishes = require('../models/dishes.models');
const Employee = require('../models/employee.models');

class DishesController {
  async getAllDishes(req, res) {
    try {
      const dishes = await Dishes.find().populate('allergens').exec();
      const dishesObject = dishes.map((dish) => dish.toObject());
      res.send(dishesObject);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  // created for testing of other endpoints
  async createDishes(req, res) {
    const { dishName, ingredients, allergens, calories, imageUrl } = req.body;

    try {
      const newDish = await Dishes.create({
        dishName,
        ingredients,
        allergens,
        calories,
        imageUrl,
      });
      res.status(200).send(newDish);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async filteredDishes(req, res) {
    try {
      // to collect all employees allergies
      const employees = await Employee.find().populate('allergies').exec();
      const allergenIds = new Set();
      employees.forEach((employee) => {
        employee.allergies.forEach((allergen) => {
          allergenIds.add(allergen._id.toString());
        });
      });

      // to filter dishes that do not contain any of the collected allergens
      const filterDishes = await Dishes.find({
        allergens: { $nin: Array.from(allergenIds) },
      });
      res.send(filterDishes);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = DishesController;
