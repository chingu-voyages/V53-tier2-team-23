const mongoose = require('mongoose');
const connectDatabase = require('../config/database.config');
const Menus = require('../models/menu.models');
const Dishes = require('../models/dishes.models');
const dishesModels = require('../models/dishes.models');

const handleError = (error, method) => {
  console.error(`Error ${method} menu: `, error);
  return {
    statusCode: 500,
    body: JSON.stringify({ error: error.message }),
  };
};

const sendResponse = (statusCode, message, data = null) => ({
  statusCode,
  body: JSON.stringify(data ? { message, data } : { message }),
});

exports.handler = async (event) => {
  await connectDatabase();
  const { httpMethod, path, body, queryStringParameters } = event;

  // create new Menu
  if (httpMethod === 'POST' && path.endsWith('/menus')) {
    try {
      const { weekStartDate, days } = JSON.parse(body);

      // Validate input
      if (!weekStartDate || !Array.isArray(days) || days.length === 0) {
        return sendResponse(
          400,
          'Week start date and day arrays are required.'
        );
      }

      for (const day of days) {
        if (!day.date) {
          return sendResponse(400, 'Each day must have a date');
        }

        if (day.dish) {
          const dishExists = await Dishes.findById(day.dish);
          if (!dishExists) {
            return sendResponse(400, `Dish with ID ${day.dish} does not exist`);
          }
        }
      }

      const newMenu = await Menus.create({
        weekStartDate,
        days,
      });

      return sendResponse(200, newMenu);
    } catch (error) {
      return handleError(error, 'creating');
    }
  }

  // getting menu with the startDate
  if (httpMethod === 'GET' && path.endsWith(`/menus`)) {
    try {
      const { weekStartDate } = queryStringParameters;

      if (!weekStartDate) {
        return sendResponse(400, 'weekStartDate query parameter is required.');
      }

      const menu = await Menus.findOne({
        weekStartDate: new Date(weekStartDate),
      }).populate('days.dish');

      if (!menu) {
        return sendResponse(404, 'Menu not found for the given weekStartDate.');
      }

      return sendResponse(200, 'Menu fetched successfully', menu);
    } catch (error) {
      return handleError(error, 'fetching');
    }
  }

  // editing menu
  if (httpMethod === 'PUT' && path.endsWith(`/menus`)) {
    try {
      const { weekStartDate, date, dish } = JSON.parse(body);

      // Validate input
      if (!weekStartDate || !date) {
        return sendResponse(400, 'weekStartDate and date are required.');
      }

      const menu = await Menus.findOne({
        weekStartDate: new Date(weekStartDate),
      });

      if (!menu) {
        return sendResponse(404, 'Menu not found for the given weekStartDate');
      }

      // Find the specific day to update
      const dayToUpdate = menu.days.find(
        (day) =>
          new Date(day.date).toISOString() === new Date(date).toISOString()
      );

      if (!dayToUpdate) {
        return sendResponse(404, `No day found for the date: ${date}`);
      }

      if (dish) {
        const dishExists = await Dishes.findById(dish);
        if (!dishExists) {
          return sendResponse(400, `Dish with ID ${dish} does not exist.`);
        }
      }

      dayToUpdate.dish = dish || null;

      const updatedMenu = await menu.save();

      return sendResponse(200, 'Menu updated successfully', updatedMenu);
    } catch (error) {
      return handleError(error, 'updating specific day');
    }
  }

  // delete menu
  if (httpMethod === 'DELETE' && path.endsWith(`/menus`)) {
    try {
      const { weekStartDate } = queryStringParameters;

      if (!weekStartDate) {
        return sendResponse(400, 'weekStartDate query parameter is required.');
      }

      const deletedMenu = await Menus.findOneAndDelete({
        weekStartDate: new Date(weekStartDate),
      });

      if (!deletedMenu) {
        return sendResponse(404, 'Menu not found for the given weekStartDate');
      }

      return sendResponse(200, 'Menu deleted successfully');
    } catch (error) {
      handleError(error, 'deleting');
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed.' }),
  };
};
