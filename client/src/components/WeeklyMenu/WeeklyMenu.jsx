import React, { useEffect, useState, useRef } from 'react';
import { FaArrowDown } from 'react-icons/fa6';
import { LuCircleArrowRight, LuCircleArrowLeft } from 'react-icons/lu';
import ExportToPDF from '../ExportToPDF/ExportToPDF';
import ExportToExcel from '../ExportToExcel/ExportToExcel';
import { useLocation } from 'react-router-dom';

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
  Coconut: ['Coconut Oil', 'Coconut Milk', 'Coconut Aminos', 'Coconut Flakes'],
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

function WeeklyMenu() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [menu, setMenu] = useState(null);
  const [dish, setDish] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const location = useLocation();
  const { weekStartDate } = location.state || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDishes, setFilterDishes] = useState([]); // filtered dishes for manager to choose
  const [searchTerms, setSearchTerm] = useState(''); // for search function
  const [selectedDishes, setSelectedDishes] = useState({}); // to store selected dishes for each day
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const dropdownRefs = useRef({}); // to store refs for each dropdown

  // to scroll horizontally when the user interacts withthe scroll wheel for small screen size
  const scrollRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheelScroll = (event) => {
      event.preventDefault();
      scrollContainer.scrollLeft += event.deltaY;
    };

    scrollContainer.addEventListener('wheel', handleWheelScroll);
    return () =>
      scrollContainer.removeEventListener('wheel', handleWheelScroll);
  }, []);

  // to fetch weekly menu
  const fetchWeeklyMenu = async (weekStart) => {
    try {
      const response = await fetch(
        `https://eato-meatplanner.netlify.app/.netlify/functions/menus?weekStartDate=${weekStart}`
      );
      const data = await response.json();
      setMenu(data.data);
      console.log(data.data);
      // Format weekDates with dish info
      const formattedDates = data.data.days.map((day) => ({
        day: new Date(day.date).toLocaleDateString('en-US', {
          weekday: 'short',
        }),
        date: new Date(day.date).getDate(),
        fullDate: day.date.split('T')[0],
        dish: day.dish,
      }));

      setWeekDates(formattedDates);
      setSelectedDate(formattedDates[0]?.fullDate);
    } catch (error) {
      console.error('Error fetching weekly menu:', error);
    }
  };

  // Fetch weekly menu on mount
  useEffect(() => {
    // if there is weekStartDate prop, fetch menu for that week
    if (weekStartDate) {
      fetchWeeklyMenu(weekStartDate);
    } else {
      // If no weekStartDate prop, calculate the current week's start date
      const today = new Date();
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      // using local time instead of ISO as it sometime causes date shift depending on time of usage
      const weekStart =
        monday.getFullYear() +
        '-' +
        String(monday.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(monday.getDate()).padStart(2, '0');
      console.log('weekStartDate: ', weekStart);

      fetchWeeklyMenu(weekStart);
    }
  }, [weekStartDate]);

  // Update dish when selectedDate changes
  useEffect(() => {
    if (menu && selectedDate) {
      const selectedDay = menu.days.find((day) =>
        day.date.startsWith(selectedDate)
      );
      setDish(selectedDay?.dish || null);
    }
  }, [selectedDate, menu]);

  const getImageURL = (imageUrl) => {
    const imageBasePath = 'https://res.cloudinary.com/dspxn4ees/image/upload/';
    const imageName = dish.imageUrl
      .replace('imagesPath/', '')
      .replace('.jpg', '');
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

  const editWeeklyMenu = async (weekStart) => {};

  // to fetch list of filtered dishes free of employee allergen
  useEffect(() => {
    const fetchFilteredDishes = async () => {
      try {
        const response = await fetch(
          'https://eato-meatplanner.netlify.app/.netlify/functions/dishes/filtered',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = await response.json();
        // data.dishes._id (or) dishName

        if (responseData?.data?.dishes) {
          setFilterDishes(responseData.data.dishes);
        } else {
          console.error('Unexpected API error:', responseData);
        }
      } catch (error) {
        console.error('Error fetching filtered dishes: ', error);
      }
    };
    fetchFilteredDishes();
  }, [token]);

  // to handle dish selection from dropdown click
  const handleDishSelect = (date, dishName) => {
    setSelectedDishes((prev) => ({ ...prev, [date]: dishName }));
    setSearchTerm((prev) => ({ ...prev, [date]: dishName })); // Update input field
    setIsDropdownOpen((prev) => ({ ...prev, [date]: false })); // Close dropdown
  };

  // to handle typing in input
  const handleSearchChange = (date, value) => {
    setSearchTerm((prev) => ({ ...prev, [date]: value }));
    setIsDropdownOpen((prev) => ({ ...prev, [date]: true })); // Open dropdown when typing

    if (!value.trim()) {
      setIsDropdownOpen((prev) => ({ ...prev, [date]: false })); // Close dropdown when input is empty
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((date) => {
        if (
          dropdownRefs.current[date] &&
          !dropdownRefs.current[date].contains(event.target)
        ) {
          setIsDropdownOpen((prev) => ({ ...prev, [date]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // save function
  const handleSave = () => {
    console.log('Saved Meal Plan: ', selectedDishes);
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Date selector */}
      <div className='flex flex-col items-center border-t-2 border-b-2 lg:border-2 border-primary rounded-lg shadow-md pb-2 md:pb-[0.15rem] lg:mt-[19px] lg:w-[845px] mx-auto '>
        <div className='flex items-center justify-center w-full px-[1.35rem] md:px-[4rem] lg:px-[4.2rem]  '>
          {weekStartDate && (
            <button className='text-gray-400 relative'>
              <LuCircleArrowLeft className='w-11 h-10 md:w-13 md:h-12' />
            </button>
          )}
          <div className='text-center pt-1 md:pt-[0.4rem]'>
            <div className='text-[16px]'>Week of</div>
            <div className='text-[16px] font-bold'>
              {weekDates.length > 0 &&
                new Date(weekDates[0].fullDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                })}
            </div>
          </div>
          {weekStartDate && (
            <button className='text-primary relative'>
              <LuCircleArrowRight className='w-11 h-10 md:w-13 md:h-12' />
            </button>
          )}
        </div>
        <div
          ref={scrollRef}
          className='overflow-x-auto snap-x scrollbar-hide md:overflow-visible md:snap-none flex w-full mt-1 gap-[19.5px] md:gap-5 ml-4 md:ml-0 md:justify-center md:mt-4'
        >
          {weekDates.map((item) => {
            const isDisabled = item.dish === null;
            const isSelected = selectedDate === item.fullDate;

            return (
              <div
                key={item.fullDate}
                onClick={() => !isDisabled && setSelectedDate(item.fullDate)}
                className={`cursor-pointer snap-start flex flex-col flex-[0_0_auto] items-center justify-center w-[70px] h-[72px] md:h-[70px] pt-[3px] border border-black rounded-md ${
                  isDisabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isSelected
                    ? 'text-white bg-primary'
                    : 'bg-[#F0EBF6]'
                }`}
              >
                <div
                  className={`text-[11px] ${
                    isSelected ? 'font-normal' : 'font-bold'
                  }`}
                >
                  {item.day}
                </div>
                <div
                  className={`text-[11px] ${
                    isSelected ? 'font-normal' : 'font-bold'
                  }`}
                >
                  {item.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dish details */}
      <h1 className='text-center text-primary font-bold text-[24px] mt-[1.35rem] font-shantell'>
        Check this Week&apos;s Meals
      </h1>
      {dish ? (
        <div className='border-[1px] border-primary rounded-3xl w-full mt-[0.9rem] p-2 text-center pb-4'>
          <div className='text-primary font-bold text-[36px] font-shantell'>
            {dish.dishName}
          </div>
          <div className='mt-2 h-[217px] mx-1'>
            <img
              src={getImageURL(dish.imageUrl)}
              alt={dish.dishName}
              className='rounded-xl border-[3px] border-primary object-cover h-full w-full'
            />
          </div>
          <div className='mt-4 text-left mx-5'>
            <h2 className='font-bold text-[20px] text-black'>Ingredients</h2>
            <div className='grid grid-cols-2 gap-5 mt-6'>
              {dish.ingredients.map((item) => (
                <li key={item} className='flex items-center gap-2'>
                  {getIngredientEmoji(item)} {item}
                </li>
              ))}
            </div>
          </div>
          <div className='mt-7 flex justify-start mx-3'>
            <div className='bg-secondary text-black font-bold py-[0.5rem] px-3 inline-block'>
              Calories: {dish.calories}
            </div>
          </div>
        </div>
      ) : (
        <p className='text-center mt-5'>No meal planned for this date.</p>
      )}

      {/* Edit & Export  */}
      {weekStartDate && (
        <div className='mt-6 flex flex-col gap-7 items-center'>
          {/* Export buttons */}
          <div className='group relative flex flex-col items-center'>
            <p className='bg-primary text-white p-1 px-6 rounded-full text-[24px] flex items-center justify-center gap-2 shadow-lg w-fit cursor-pointer'>
              EXPORT WEEKLY PLAN <FaArrowDown />
            </p>
            <div className='hidden group-hover:flex flex-col gap-3 mt-2'>
              <ExportToPDF weekDates={weekDates} />
              <ExportToExcel weekDates={weekDates} />
            </div>
          </div>
          {/* Edit */}
          <button
            className='border-[1px] border-primary text-primary py-1 px-4 rounded-full font-semibold text-[24px] font-shantell shadow-lg w-fit'
            onClick={() => setIsModalOpen(true)}
          >
            EDIT MEAL
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-bold mb-4 text-black'>Edit Meal</h2>
            <div>
              {weekDates.map((item) => {
                const filteredList = filterDishes.filter((dish) =>
                  dish.dishName
                    .toLowerCase()
                    .includes((searchTerms[item.fullDate] || '').toLowerCase())
                );

                return (
                  <div className='flex flex-col mb-3' key={item.fullDate}>
                    {/* Date Box */}
                    <div className='flex items-center justify-between gap-3'>
                      <div className='cursor-pointer flex flex-col items-center justify-center w-[70px] h-[72px] border border-black rounded-md p-2'>
                        <div className='text-[11px]'>{item.day}</div>
                        <div className='text-[11px]'>{item.date}</div>
                      </div>

                      {/* Input Field for Typing & Selecting */}
                      <div
                        className='relative w-full'
                        ref={(el) => (dropdownRefs.current[item.fullDate] = el)}
                      >
                        <input
                          type='text'
                          placeholder='Type or select a dish...'
                          className='border px-2 py-1 w-full rounded-md'
                          value={searchTerms[item.fullDate] || ''}
                          onChange={(e) =>
                            handleSearchChange(item.fullDate, e.target.value)
                          }
                          onFocus={() =>
                            setIsDropdownOpen((prev) => ({
                              ...prev,
                              [item.fullDate]: true,
                            }))
                          }
                        />

                        {/* Dish Dropdown List */}
                        {isDropdownOpen[item.fullDate] &&
                          filteredList.length > 0 && (
                            <div className='absolute bg-white border mt-1 max-h-40 overflow-y-auto w-full rounded-md shadow-lg z-50'>
                              {filteredList.map((dish) => (
                                <div
                                  key={dish._id}
                                  className='p-2 hover:bg-gray-200 cursor-pointer'
                                  onClick={() =>
                                    handleDishSelect(
                                      item.fullDate,
                                      dish.dishName
                                    )
                                  }
                                >
                                  {dish.dishName}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className='mt-4 bg-primary text-white py-2 px-4 rounded-full'
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklyMenu;
