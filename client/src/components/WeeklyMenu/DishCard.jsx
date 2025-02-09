const DishCard = ({ item }) => {
  const ingredientCategories = {
    Mushrooms: ['Portobello Mushroom', 'Mushrooms'],
    Herbs: [
      'Chives',
      'Cilantro',
      'Basil',
      'Thyme',
      'Coriander',
      'Rosemary',
      'Basil Pesto',
      'Parsley',
      'Wasabi',
    ],
    Green: [
      'Spinach',
      'Celery',
      'Zucchini',
      'Lettuce',
      'Asparagus',
      'Cabbage',
      'Peas',
      'Romaine Lettuce',
    ],
    Cheese: [
      'Mozzarella',
      'Ricotta Cheese',
      'Mozzarella Cheese',
      'Vegan Cheese',
      'Parmesan Cheese',
      'Parmesan',
      'Cheese',
      'Cheddar Cheese',
      'Vegan Cheese Sauce',
      'Blue Cheese',
    ],
    Garlic: ['Garlic', 'Garlic Powder'],
    Olives: ['Olive Oil', 'Olives'],
    Rice: ['Quinoa', 'Arborio Rice', 'Rice'],
    Avocados: ['Avocado', 'Guacamole'],
    Nori: ['Nori'],
    Flour: ['Flour', 'Almond Flour', 'Gluten-Free Oats', 'Gluten-Free Flour'],
    Chocolate: ['Cocoa Powder', 'Chocolate Chips'],
    Milk: ['Almond Milk', 'Cream', 'Butter', 'Heavy Cream', 'Milk'],
    Others: [
      'Sugar',
      'Baking Powder',
      'Soy Sauce',
      'Salt',
      'Curry Powder',
      'Taco Seasoning',
      'Cinnamon',
      'Nutritional Yeast',
      'Turmeric',
      'Cumin',
    ],
    Dressing: [
      'Hummus',
      'Caesar Dressing',
      'Mayo',
      'Gluten-Free Soy Sauce',
      'Balsamic Vinegar',
      'Maple Syrup',
      'Tamari Sauce',
      'Vegan Caesar Dressing',
    ],
    Seafood: [
      'Clams',
      'Tuna',
      'Shrimp',
      'Salmon',
      'White Fish',
      'Cod',
      'Lobster',
      'Mussels',
    ],
    Potatoes: ['Potatoes', 'Mashed Potatoes'],
    Onions: ['Onion', 'Shallots'],
    Meat: [
      'Chicken Breast',
      'Beef',
      'Ground Chicken',
      'Pepperoni',
      'Ground Beef',
      'Ground Turkey',
      'Turkey',
      'Chicken',
      'Chicken Thighs',
      'Bacon',
      'Beef Strips',
    ],
    Tomatoes: [
      'Tomato',
      'Tomato Sauce',
      'Tomato Sauce',
      'Tomatoes',
      'Salsa',
      'Cherry Tomatoes',
    ],
    Cucumber: ['Cucumber', 'Pickles'],
    Broth: ['Broth', 'Vegetable Broth'],
    Peppers: ['Bell Pepper', 'Bell Peppers'],
    Chilli: ['Chili Powder', 'Paprika'],
    Bread: [
      'Whole Wheat Bun',
      'Breadcrumbs',
      'Gluten-Free Pizza Dough',
      'Croutons',
      'Whole Wheat Wrap',
      'Gluten-Free Pizza Crust',
      'Pizza Dough',
      'Burger Bun',
      'Vegan Bun',
      'Brioche Bun',
      'Bread',
      'Pastry',
      'Gluten-Free Breadcrumbs',
    ],
    Carrots: ['Carrots'],
    Noodles: [
      'Gluten-Free Pasta',
      'Fettuccine',
      'Linguine',
      'Lasagna Noodles',
      'Spaghetti',
      'Lasagna Sheets',
      'Spaghetti Squash',
      'Pasta',
      'Rice Noodles',
    ],
    Citrus: ['Lemon Juice', 'Lime Juice', 'Lemon', 'Lemon Dressing', 'Lime'],
    Tacos: ['Corn Tortillas', 'Taco Shells', 'Flour Tortilla'],
    Oil: ['Oil'],
    wine: ['White Wine'],
    apples: ['Apples'],
    Nuts: ['Tahini', 'Sesame Seeds', 'Pine Nuts', 'Cashews'],
    Bean: ['Tofu', 'Chickpeas', 'Black Beans', 'Falafel', 'Lentils'],
    Peanuts: ['Peanuts'],
    Egg: ['Egg', 'Eggs'],
    Coconut: [
      'Coconut Oil',
      'Coconut Milk',
      'Coconut Aminos',
      'Coconut Flakes',
    ],
    Eggplants: ['Eggplant'],
    'Sweet Potato': ['Sweet Potatoes'],
    Ginger: ['Ginger'],
    Cauliflower: ['Cauliflower Rice', 'Broccoli', 'Cauliflower'],
  };

  const ingredientEmojis = {
    Mushrooms: '🍄',
    Green: '🥬',
    Herbs: '🌿',
    Cheese: '🧀',
    Garlic: '🧄',
    Olives: '🫒',
    Rice: '🍚',
    Avocados: '🥑',
    Nori: '🍣',
    Flour: '🌾',
    Chocolate: '🍫',
    Milk: '🥛',
    Others: '🧂',
    Dressing: '🫙',
    Seafood: '🐟',
    Potatoes: '🥔',
    Onions: '🧅',
    Meat: '🥩',
    Tomatoes: '🍅',
    Cucumber: '🥒',
    Broth: '🍲',
    Peppers: '🫑',
    Chilli: '🌶️',
    Bread: '🍞',
    Carrots: '🥕',
    Noodles: '🍝',
    Citrus: '🍋',
    Tacos: '🌮',
    Oil: '🛢️',
    wine: '🍷',
    apples: '🍎',
    Nuts: '🌰',
    Bean: '🫘',
    Peanuts: '🥜',
    Egg: '🥚',
    Coconut: '🥥',
    Eggplants: '🍆',
    'Sweet Potato': '🍠',
    Ginger: '🫚',
    Cauliflower: '🥦',
  };

  const getImageURL = (imageUrl) => {
    const imageBasePath = 'https://res.cloudinary.com/dspxn4ees/image/upload/';
    const imageName = imageUrl.replace('imagesPath/', '').replace('.jpg', '');
    const imageExt = '.jpg';
    const imageURL = `${imageBasePath}${imageName}${imageExt}`;
    return imageURL;
  };

  const getIngredientEmoji = (ingredient) => {
    for (const [category, ingredients] of Object.entries(ingredientCategories))
      if (ingredients.includes(ingredient)) {
        return ingredientEmojis[category] || '😊';
      }
    return '🤭';
  };

  const formatSelectedDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const [day, weekday] = formattedDate.split(' ');
    return `${weekday} ${day}`;
  };

  return (
    <div className='w-full md:w-[430px] min-h-[620px] bg-white rounded-3xl md:rounded-none'>
      {/* Ensure width is 430px for md and lg screens */}
      <div className='text-[16px] font-bold text-center pt-8'>
        {formatSelectedDate(item.fullDate)}
      </div>
      {!item.dish ? (
        <div className='text-[16px] font-bold text-center h-full flex justify-center items-center border-8 border-secondary rounded-3xl'>
          No meal planned for this date
        </div>
      ) : (
        <div className='border-8 border-secondary rounded-3xl w-full h-full mt-[0.2rem] p-2 text-center pb-4'>
          <div className='text-primary font-semibold text-[36px] font-shantell'>
            {item.dish.dishName}
          </div>
          <div className='mt-2 h-[217px] mx-1'>
            <img
              src={getImageURL(item.dish.imageUrl)}
              alt={item.dish.dishName}
              className='rounded-xl border-[3px] border-primary object-cover h-full w-full'
            />
          </div>
          <div className='mt-4 text-left mx-5'>
            <h2 className='font-bold text-[20px] text-black'>Ingredients</h2>
            <div className='grid grid-cols-2 gap-5 mt-6'>
              {item.dish.ingredients.map((ingredient) => (
                <li key={ingredient} className='flex items-center gap-2'>
                  {getIngredientEmoji(ingredient)} {ingredient}
                </li>
              ))}
            </div>
          </div>
          <div className='mt-7 flex justify-start mx-3'>
            <div className='bg-secondary text-black font-bold py-[0.5rem] px-3 inline-block'>
              Calories: {item.dish.calories}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishCard;
