const Menu = require('../models/menu.models');
const Dish = require('../models/dishes.models');

class MenuController {
  async createMenu(req, res) {
    try {
      const { weekStartDate, days } = req.body;

      if (!weekStartDate || !Array.isArray(days) || days.length === 0) {
        return res
          .status(400)
          .send('Invalid input: weekStartDate and days are required');
      }

      // to validate each day's structure
      for (const day of days) {
        if (!day.date || !day.dish) {
          return res
            .status(400)
            .send('Each day must include a date and a dish ID');
        }

        // to check if the dish exists in the database
        const dishExists = await Dish.findById(day.dish);
        if (!dishExists) {
          return res.status(404).send(`Dish with ID ${day.dish} not found`);
        }
      }

      // to check if a menu for the same week already exists
      const existingMenu = await Menu.findOne({ weekStartDate });
      if (existingMenu) {
        return res.status(409).send('Menu for this week alreeady exists');
      }

      const newMenu = await Menu.create({
        weekStartDate: new Date(weekStartDate),
        days: days.map((day) => ({
          date: new Date(day.date),
          dish: day.dish,
        })),
      });

      res.status(201).send(newMenu);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = MenuController;
