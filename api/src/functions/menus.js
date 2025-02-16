const mongoose = require('mongoose');
const connectDatabase = require('../config/database.config');
const Menus = require('../models/menu.models');
const Dishes = require('../models/dishes.models');
const authenticate = require('../functions/authMiddleware');

const allowedOrigins = [
  'http://localhost:5173',
  'https://chingu-voyages.github.io/V53-tier2-team-23',
  'https://chingu-voyages.github.io',
  'https://eato-meatplanner.netlify.app',
  'https://eatodishes.netlify.app',
];

const handleError = (error, method) => {
  console.error(`Error ${method} employee: `, error);
  return {
    statusCode: 500,
    headers: getResponseHeaders(event),
    body: JSON.stringify({ error: error.message }),
  };
};

const getResponseHeaders = (origin = '*') => {
  const allowedOrigin =
    origin && allowedOrigins.includes(origin) ? origin : '*';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
};

const sendResponse = (statusCode, message, origin, data = null) => ({
  statusCode,
  headers: getResponseHeaders(origin), // Use the origin from the request
  body: JSON.stringify(data ? { message, data } : { message }),
});

exports.handler = async (event) => {
  await connectDatabase();
  const { httpMethod, path, body, queryStringParameters } = event;

  const origin = event.headers.origin;

  // Handle CORS Preflight Requests
  if (httpMethod === 'OPTIONS' && allowedOrigins.includes(origin)) {
    return {
      statusCode: 200,
      headers: getResponseHeaders(origin),
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

  // Create new Menu (POST)
  if (httpMethod === 'POST' && path.endsWith('/menus')) {
    try {
      const { weekStartDate, days } = JSON.parse(body);

      // Validate input
      if (!weekStartDate || !Array.isArray(days) || days.length === 0) {
        return sendResponse(
          400,
          'Week start date and day arrays are required.',
          origin
        );
      }

      // to check if a menu already exists
      const existingMenu = await Menus.findOne({
        weekStartDate: new Date(weekStartDate),
      });

      if (existingMenu) {
        return sendResponse(
          409,
          `A menu already exists for the week starting on ${weekStartDate}.`,
          origin
        );
      }

      for (const day of days) {
        if (!day.date) {
          return sendResponse(400, 'Each day must have a date', origin);
        }

        if (day.dish) {
          const dishExists = await Dishes.findById(day.dish);
          if (!dishExists) {
            return sendResponse(
              400,
              `Dish with ID ${day.dish} does not exist`,
              origin
            );
          }
        }
      }

      const newMenu = await Menus.create({
        weekStartDate,
        days,
      });

      return sendResponse(200, 'Menu created successfully', origin, newMenu);
    } catch (error) {
      return handleError(error, 'creating', origin);
    }
  }

  // Edit menu (PUT)
  if (httpMethod === 'PUT' && path.endsWith('/menus')) {
    try {
      const { weekStartDate, date, dish } = JSON.parse(body);

      // Validate input
      if (!weekStartDate || !date) {
        return sendResponse(
          400,
          'weekStartDate and date are required.',
          origin
        );
      }

      const menu = await Menus.findOne({
        weekStartDate: new Date(weekStartDate),
      });

      if (!menu) {
        return sendResponse(
          404,
          'Menu not found for the given weekStartDate',
          origin
        );
      }

      // Find the specific day to update
      const dayToUpdate = menu.days.find(
        (day) =>
          new Date(day.date).toISOString() === new Date(date).toISOString()
      );

      if (!dayToUpdate) {
        return sendResponse(404, `No day found for the date: ${date}`, origin);
      }

      if (dish) {
        const dishExists = await Dishes.findById(dish);
        if (!dishExists) {
          return sendResponse(
            400,
            `Dish with ID ${dish} does not exist.`,
            origin
          );
        }

        const isDishAlreadyAssigned = menu.days.some(
          (day) => day.dish && day.dish.toString() === dish
        );

        if (isDishAlreadyAssigned) {
          console.log(`Dish with ID ${dish} is already assigned in this week.`);
          return sendResponse(
            400,
            `Duplicate dish found. Each dish can only be used once per week.`,
            origin
          );
        }
      } else {
        const nullDishCount = menu.days.filter((day) => !day.dish).length;
        if (nullDishCount >= 2) {
          return sendResponse(
            400,
            'Only 2 days off are allowed per week.',
            origin
          );
        }
      }

      dayToUpdate.dish = dish || null;

      await menu.save();
      const updatedMenu = await Menus.findOne({
        weekStartDate: new Date(weekStartDate),
      }).populate('days.dish');

      return sendResponse(
        200,
        'Menu updated successfully',
        origin,
        updatedMenu
      );
    } catch (error) {
      return handleError(error, 'updating specific day', origin);
    }
  }

  // Delete menu (DELETE)
  if (httpMethod === 'DELETE' && path.endsWith('/menus')) {
    try {
      const { weekStartDate } = queryStringParameters;

      if (!weekStartDate) {
        return sendResponse(
          400,
          'weekStartDate query parameter is required.',
          origin
        );
      }

      const deletedMenu = await Menus.findOneAndDelete({
        weekStartDate: new Date(weekStartDate),
      });

      if (!deletedMenu) {
        return sendResponse(
          404,
          'Menu not found for the given weekStartDate',
          origin
        );
      }

      return sendResponse(200, 'Menu deleted successfully', origin);
    } catch (error) {
      return handleError(error, 'deleting', origin);
    }
  }

  // Get menu with start date (GET) - No Authentication Required
  if (httpMethod === 'GET' && path.endsWith('/menus')) {
    try {
      const { weekStartDate } = queryStringParameters;

      if (!weekStartDate) {
        return sendResponse(
          400,
          'weekStartDate query parameter is required.',
          origin
        );
      }

      const menu = await Menus.findOne({
        weekStartDate: new Date(weekStartDate),
      }).populate('days.dish');

      if (!menu) {
        return sendResponse(
          404,
          'Menu not found for the given weekStartDate.',
          origin
        );
      }

      return sendResponse(200, 'Menu fetched successfully', origin, menu);
    } catch (error) {
      return handleError(error, 'fetching', origin);
    }
  }

  return sendResponse(405, 'Method not allowed.', origin);

  // // Create new Menu (POST)
  // if (httpMethod === 'POST' && path.endsWith('/menus')) {
  //   try {
  //     const { weekStartDate, days } = JSON.parse(body);

  //     // Validate input
  //     if (!weekStartDate || !Array.isArray(days) || days.length === 0) {
  //       return sendResponse(
  //         400,
  //         'Week start date and day arrays are required.'
  //       );
  //     }

  //     // to check if a menu already exists
  //     const existingMenu = await Menus.findOne({
  //       weekStartDate: new Date(weekStartDate),
  //     });

  //     if (existingMenu) {
  //       return sendResponse(
  //         409,
  //         `A menu already exists for the week starting on ${weekStartDate}.`
  //       );
  //     }

  //     for (const day of days) {
  //       if (!day.date) {
  //         return sendResponse(400, 'Each day must have a date');
  //       }

  //       if (day.dish) {
  //         const dishExists = await Dishes.findById(day.dish);
  //         if (!dishExists) {
  //           return sendResponse(400, `Dish with ID ${day.dish} does not exist`);
  //         }
  //       }
  //     }

  //     const newMenu = await Menus.create({
  //       weekStartDate,
  //       days,
  //     });

  //     return sendResponse(200, 'Menu created successfully', newMenu);
  //   } catch (error) {
  //     return handleError(error, 'creating');
  //   }
  // }

  // // Edit menu (PUT)
  // if (httpMethod === 'PUT' && path.endsWith('/menus')) {
  //   try {
  //     const { weekStartDate, date, dish } = JSON.parse(body);

  //     // Validate input
  //     if (!weekStartDate || !date) {
  //       return sendResponse(400, 'weekStartDate and date are required.');
  //     }

  //     const menu = await Menus.findOne({
  //       weekStartDate: new Date(weekStartDate),
  //     });

  //     if (!menu) {
  //       return sendResponse(404, 'Menu not found for the given weekStartDate');
  //     }

  //     // Find the specific day to update
  //     const dayToUpdate = menu.days.find(
  //       (day) =>
  //         new Date(day.date).toISOString() === new Date(date).toISOString()
  //     );

  //     if (!dayToUpdate) {
  //       return sendResponse(404, `No day found for the date: ${date}`);
  //     }

  //     if (dish) {
  //       const dishExists = await Dishes.findById(dish);
  //       if (!dishExists) {
  //         return sendResponse(400, `Dish with ID ${dish} does not exist.`);
  //       }

  //       const isDishAlreadyAssigned = menu.days.some(
  //         (day) => day.dish && day.dish.toString() === dish
  //       );

  //       if (isDishAlreadyAssigned) {
  //         console.log(`Dish with ID ${dish} is already assigned in this week.`);
  //         return sendResponse(
  //           400,
  //           `Duplicate dish found. Each dish can only be used once per week.`
  //         );
  //       }
  //     } else {
  //       const nullDishCount = menu.days.filter((day) => !day.dish).length;
  //       if (nullDishCount >= 2) {
  //         return sendResponse(400, 'Only 2 days off are allowed per week.');
  //       }
  //     }

  //     dayToUpdate.dish = dish || null;

  //     await menu.save();
  //     const updatedMenu = await Menus.findOne({
  //       weekStartDate: new Date(weekStartDate),
  //     }).populate('days.dish');

  //     return sendResponse(200, 'Menu updated successfully', updatedMenu);
  //   } catch (error) {
  //     return handleError(error, 'updating specific day');
  //   }
  // }

  // // Delete menu (DELETE)
  // if (httpMethod === 'DELETE' && path.endsWith('/menus')) {
  //   try {
  //     const { weekStartDate } = queryStringParameters;

  //     if (!weekStartDate) {
  //       return sendResponse(400, 'weekStartDate query parameter is required.');
  //     }

  //     const deletedMenu = await Menus.findOneAndDelete({
  //       weekStartDate: new Date(weekStartDate),
  //     });

  //     if (!deletedMenu) {
  //       return sendResponse(404, 'Menu not found for the given weekStartDate');
  //     }

  //     return sendResponse(200, 'Menu deleted successfully');
  //   } catch (error) {
  //     return handleError(error, 'deleting');
  //   }
  // }

  // // Get menu with start date (GET) - No Authentication Required
  // if (httpMethod === 'GET' && path.endsWith('/menus')) {
  //   try {
  //     const { weekStartDate } = queryStringParameters;

  //     if (!weekStartDate) {
  //       return sendResponse(400, 'weekStartDate query parameter is required.');
  //     }

  //     const menu = await Menus.findOne({
  //       weekStartDate: new Date(weekStartDate),
  //     }).populate('days.dish');

  //     if (!menu) {
  //       return sendResponse(404, 'Menu not found for the given weekStartDate.');
  //     }

  //     return sendResponse(200, 'Menu fetched successfully', menu);
  //   } catch (error) {
  //     return handleError(error, 'fetching');
  //   }
  // }

  // return sendResponse(405, 'Method not allowed.', origin);
};
