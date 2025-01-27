// getting all dishes excluding allergens based on ingredients

if (httpMethod === 'GET' && path.endsWith('/dishes')) {
  try {
    const { dishes, allergens, unsafeIngredients } = await getDishes();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {
          dishes: dishes,
          allergens: allergensSet,
          unsafeIngredients: unsafeIngredients,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    return handleError(error, 'fetching');
  }
}

async function getDishes() {
  try {
    const db = await getDb(); // Get the database connection
    const limit = 10;

    const allergies = await Allergen.find({}).exec();
    const allergensArray = allergies.map((allergen) => allergen.allergenName);

    const databaseDishes = await Dish.find({}).exec();
    //.limit(limit)
    const ingredientsArray = databaseDishes.flatMap(
      (dish) => dish.ingredients.map((ingredient) => ingredient.toLowerCase()) // return ingredients in lowercase
    );

    const allergensSet = new Set(allergensArray); // collection of unique values
    const ingredientsSet = new Set(ingredientsArray);

    // Fetch all dishes excluding allergens
    const safeDishes = databaseDishes.filter((dish) =>
      dish.ingredients.every((ingredient) =>
        allergensArray.every(
          (allergen) => !ingredient.toLowerCase().includes(allergen) // Ensure allergen is not part of the ingredient
        )
      )
    );

    const unsafeIngredients = [...ingredientsSet].filter((ingredient) =>
      [...allergensSet].some(
        (allergen) => ingredient.includes(allergen) // Check if allergen is a substring of the ingredient
      )
    );

    const dishes = safeDishes.map((dish, index) => {
      return {
        ...dish.toObject(),
      };
    });

    return {
      dishes: dishes,
      allergens: allergensSet,
      unsafeIngredients: unsafeIngredients,
    };
  } catch (error) {
    console.error('Error fetching dishes:', error);
    console.log(dishes);
    throw new Error('Error fetching dishes');
  }
}
