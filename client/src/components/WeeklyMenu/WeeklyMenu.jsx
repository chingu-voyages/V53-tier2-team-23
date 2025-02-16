import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaArrowDown } from 'react-icons/fa6';
import { LuCircleArrowRight, LuCircleArrowLeft } from 'react-icons/lu';
import ExportToPDF from '../ExportToPDF/ExportToPDF';
import ExportToExcel from '../ExportToExcel/ExportToExcel';
import EditMealModal from '../EditMeal/EditMeal';
import DishCard from './DishCard';
import AlertPopUp from '../AlertPopUp/AlertPopUp';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Controller } from 'swiper/modules';
import 'swiper/css';

function WeeklyMenu() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const location = useLocation();
  const { weekStartDate } = location.state || {};
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWeekStartDate, setCurrentWeekStartDate] =
    useState(weekStartDate);
  const [isNextWeekDisabled, setIsNextWeekDisabled] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: '', status: false });
  const token = localStorage.getItem('token');

  const dishSwiperRef = useRef(null);
  const dateSwiperRef = useRef(null);
  const exportMenuRef = useRef(null);
  const editMenuRef = useRef(null);
  const editButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target)
      ) {
        setIsExportMenuOpen(false);
      }

      if (
        editMenuRef.current &&
        !editMenuRef.current.contains(event.target) &&
        !editButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getIngredientEmoji = (ingredient) => {
    for (const [category, ingredients] of Object.entries(ingredientCategories))
      if (ingredients.includes(ingredient)) {
        return ingredientEmojis[category] || '🍴';
      }
    return '🍽️';
  };

  const handleNotice = (message) => {
    setShowAlert({ message: message, status: true });
  };

  // to fetch weekly menu
  const fetchWeeklyMenu = async (weekStart) => {
    try {
      const response = await fetch(
        `https://eato-meatplanner.netlify.app/.netlify/functions/menus?weekStartDate=${weekStart}`
      );
      const data = await response.json();
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
      handleNotice('Error fetching weekly menu');
      // console.error('Error fetching weekly menu:', error);
    }
  };

  // to get the start of the current week
  const getWeekStartDate = (date = new Date()) => {
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(monday.getDate()).padStart(2, '0')}`;
  };

  // fetch the weekly menu
  const fetchMenuForDate = useCallback((weekStartDate) => {
    if (weekStartDate) {
      fetchWeeklyMenu(weekStartDate);
    }
  }, []);

  // Fetch menu on mount and when currentWeekStartDate changes
  useEffect(() => {
    const weekStart =
      currentWeekStartDate || weekStartDate || getWeekStartDate();
    if (weekStart) {
      fetchMenuForDate(weekStart);
    }
  }, [weekStartDate, currentWeekStartDate, fetchMenuForDate]);

  // to pass as props to EditMealModal to refresh the menu after updating
  const refreshMenu = () => fetchMenuForDate(weekStartDate);

  // for previous and next week button
  const currentWeekStart = getWeekStartDate(new Date());

  // next week button
  const handleNextWeekClick = async () => {
    const nextWeekStart = new Date(currentWeekStartDate);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const nextWeekStartDate = nextWeekStart.toISOString().split('T')[0];

    try {
      const response = await fetch(
        `https://eato-meatplanner.netlify.app/.netlify/functions/menus?weekStartDate=${nextWeekStartDate}`
      );
      const data = await response.json();

      if (data.data && data.data.days.length > 0) {
        setCurrentWeekStartDate(nextWeekStartDate);
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
        setIsNextWeekDisabled(false);
      } else {
        handleNotice('There is no menu for the next week.');
        setIsNextWeekDisabled(true);
      }
    } catch (error) {
      handleNotice('An error occurred while fetching the menu.');
      // console.error('Error fetching the menu:', error);
    }
  };

  // previous week button
  const handlePreviousWeekClick = () => {
    const previousWeekStart = new Date(currentWeekStartDate);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const previousWeekStartDate = previousWeekStart.toISOString().split('T')[0];

    setCurrentWeekStartDate(previousWeekStartDate);
    setIsNextWeekDisabled(false); // Re-enable the "Next Week" button
    fetchWeeklyMenu(previousWeekStartDate); // Fetch the menu for the previous week
  };

  const getImageURL = (imageUrl) => {
    if (!imageUrl) {
      // return a default image if imageUrl is not provided
      return 'https://placehold.it/400x300';
    }

    const imageBasePath = 'https://res.cloudinary.com/dspxn4ees/image/upload/';
    const imageName = imageUrl.replace('imagesPath/', '').replace('.jpg', '');
    const imageExt = '.jpg';
    const imageURL = `${imageBasePath}${imageName}${imageExt}`;
    return imageURL;
  };

  // for menu regen
  const regenerateMenu = async (token) => {
    if (!weekDates.length) return;

    try {
      const filteredDishes = await fetch(
        'https://eato-meatplanner.netlify.app/.netlify/functions/dishes/filtered',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredDishesRes = await filteredDishes.json();
      const dishIds = filteredDishesRes.data.dishes.map((dish) => dish._id);

      if (dishIds.length === 0) {
        return;
      }

      const usedDishes = new Set();

      const getRandomDish = () => {
        if (usedDishes.size >= dishIds.length) return null;

        let randomDish;
        do {
          const randomIndex = Math.floor(Math.random() * dishIds.length);
          randomDish = dishIds[randomIndex];
        } while (usedDishes.has(randomDish));

        usedDishes.add(randomDish);
        return randomDish;
      };

      const updatePromises = weekDates
        .filter((day) => day.dish !== null)
        .map(async (day) => {
          const newDish = getRandomDish();
          if (!newDish) return;

          await fetch(
            'https://eato-meatplanner.netlify.app/.netlify/functions/menus',
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                weekStartDate: weekDates[0]?.fullDate,
                date: day.fullDate,
                dish: newDish,
              }),
            }
          );
        });
      await Promise.all(updatePromises);

      // Refresh menu after updates
      fetchMenuForDate(currentWeekStartDate);
    } catch (error) {
      handleNotice('Error regenerating weekly menu');
      // console.error('Error regenerating weekly menu:', error);
    }
  };

  return (
    <>
      <div className='custom-bg'>
        <div className='relative z-10'>
          <h1 className='text-center text-primary font-bold text-[36px] mt-[0.8rem] lg:mt-[0.5rem] font-shantell hidden md:block pb-1'>
            Check this Week&apos;s Meals
          </h1>
          <div className='md:bg-white md:pb-10'>
            {/* Date selector */}
            <div className='flex flex-col items-center bg-white border-t-2 border-b-2 md:border-2 lg:border-2 border-secondary shadow-md md:shadow-none mt-[-5px] pb-[0.6rem] md:pb-[0.15rem] md:w-[503px] md:h-[74px] md:mt-[-6px] lg:mt-[-15px] mx-auto '>
              {/* next/prev week with weeek start date */}
              <div className='flex items-center justify-center w-full px-[1.35rem] md:px-[4rem] lg:px-[4.2rem] gap-24 md:gap-14 '>
                {weekStartDate && (
                  <button
                    className={`text-primary relative ${
                      currentWeekStartDate === currentWeekStart
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    } `}
                    onClick={handlePreviousWeekClick}
                    disabled={currentWeekStartDate === currentWeekStart}
                  >
                    <LuCircleArrowLeft className='w-12 h-12' />
                  </button>
                )}
                <div className='text-center pt-[0.3rem] md:pt-[0.4rem] flex flex-col md:flex-row md:gap-1 md:text-nowrap lg:pt-3'>
                  <div className='text-[16.23px]'>Week of </div>
                  <div className='text-[16.23px] font-bold'>
                    {weekDates.length > 0 &&
                      new Date(weekDates[0].fullDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                  </div>
                </div>
                {weekStartDate && (
                  <button
                    className={`text-primary relative ${
                      isNextWeekDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    } `}
                    onClick={handleNextWeekClick}
                    disabled={isNextWeekDisabled}
                  >
                    <LuCircleArrowRight className='w-12 h-12' />
                  </button>
                )}
              </div>
              <div className='bg-white md:hidden'>
                {/* --- DATE SWIPER --- */}
                {weekDates.length > 0 && (
                  <div className=''>
                    <Swiper
                      modules={[Controller]}
                      slidesPerView='auto'
                      spaceBetween={20}
                      className='w-full h-auto max-w-[90vw] mt-1 ml-0'
                      onSwiper={(swiper) => (dateSwiperRef.current = swiper)}
                    >
                      {weekDates.map((item, index) => {
                        const isDisabled = item.dish === null;
                        const isSelected = selectedDate === item.fullDate;

                        return (
                          <SwiperSlide
                            key={item.fullDate}
                            style={{ width: '71px' }}
                          >
                            <div
                              onClick={() => {
                                if (!isDisabled) {
                                  setSelectedDate(item.fullDate);
                                  dishSwiperRef.current?.slideTo(index);
                                }
                              }}
                              className={`cursor-pointer flex flex-col items-center justify-center w-[71px] h-[71px] pt-[3px] border border-black rounded-md ${
                                isDisabled
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : isSelected
                                  ? 'text-white bg-primary'
                                  : 'bg-[#F0EBF6]'
                              }`}
                            >
                              <div className='text-[12px] font-extrabold'>
                                {item.day}
                              </div>
                              <div className='text-[12px] font-extrabold'>
                                {item.date}
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                )}
              </div>
            </div>

            <h1 className='text-center text-primary font-bold text-[24px] mt-[2.5rem] mb-3 font-shantell md:hidden'>
              Check this Week&apos;s Meals
            </h1>
            {/* Dish details for small screen*/}
            <div className='md:hidden min-h-[620px]'>
              <Swiper
                modules={[Controller, Navigation]}
                slidesPerView={1}
                spaceBetween={0}
                loop={false}
                onSwiper={(swiper) => (dishSwiperRef.current = swiper)}
                onSlideChange={(swiper) => {
                  const newDate = weekDates[swiper.activeIndex]?.fullDate;
                  setSelectedDate(newDate);
                  dateSwiperRef.current?.slideTo(swiper.activeIndex);
                }}
                className='h-full'
              >
                {weekDates.map((item) => (
                  <SwiperSlide key={item.fullDate}>
                    <DishCard
                      item={item}
                      getImageURL={getImageURL}
                      getIngredientEmoji={getIngredientEmoji}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {/* Dish details for medium and large screens */}
            <div className='hidden md:block min-h-[620px] '>
              <Swiper
                modules={[Navigation]}
                navigation={true}
                slidesPerView={'2.5'}
                spaceBetween={40}
                loop={false}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 1.5,
                  },
                  1024: {
                    slidesPerView: 2.5,
                  },
                  1280: {
                    slidesPerView: 3,
                  },
                }}
                className='h-full'
              >
                {weekDates.map((item) => (
                  <SwiperSlide key={item.fullDate}>
                    <div className='w-[430px] h-full'>
                      <DishCard
                        item={item}
                        getImageURL={getImageURL}
                        getIngredientEmoji={getIngredientEmoji}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Edit & Export  */}
          {weekStartDate && (
            <div className='mt-5 md:mt-0 flex justify-between items-center border-t-2 border-b-2 border-primary px-3 pt-2 pb-1 bg-white'>
              <div
                className={`relative flex flex-col items-center ${
                  currentWeekStartDate === currentWeekStart
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={currentWeekStartDate === currentWeekStart}
              >
                <p
                  ref={editButtonRef}
                  className='bg-primary text-white p-1 px-6 rounded-full text-[24px] flex items-center justify-center gap-2 shadow-lg w-fit cursor-pointer shadow-gray-400'
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  disabled={currentWeekStartDate === currentWeekStart}
                >
                  Menu
                </p>
                {isMenuOpen && (
                  <div
                    ref={editMenuRef}
                    className='flex flex-col mt-2 absolute bottom-[100%] z-20'
                  >
                    {/* Edit */}
                    <button
                      className='border-[1px] border-primary text-[24px] h-[45px] w-[115px] bg-white'
                      onClick={() => setIsModalOpen(true)}
                      disabled={currentWeekStartDate === currentWeekStart}
                    >
                      Edit
                    </button>
                    {/* Regen */}
                    <button
                      className='border-[1px] border-primary text-[24px] h-[45px] w-[115px] bg-white'
                      onClick={() => regenerateMenu(token)}
                      disabled={currentWeekStartDate === currentWeekStart}
                    >
                      Regen
                    </button>
                  </div>
                )}
              </div>

              {/* Export buttons */}
              <div
                ref={exportMenuRef}
                className='relative flex flex-col items-center'
              >
                <p
                  className='bg-primary text-white p-1 px-6 rounded-full text-[24px] flex items-center justify-center  shadow-lg w-fit cursor-pointer shadow-gray-400'
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                >
                  Export Menu <FaArrowDown />
                </p>
                {isExportMenuOpen && (
                  <div className='flex flex-col mt-2 absolute bottom-[100%] left-2 right-0 z-20'>
                    <ExportToPDF
                      weekDates={weekDates}
                      getImageURL={getImageURL}
                      getIngredientEmoji={getIngredientEmoji}
                    />
                    <ExportToExcel weekDates={weekDates} />
                  </div>
                )}
              </div>
            </div>
          )}

          {isModalOpen && (
            <EditMealModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              weekDates={weekDates}
              refreshMenu={refreshMenu}
            />
          )}
        </div>
      </div>
      {showAlert.status && (
        <AlertPopUp setShowAlert={setShowAlert} showAlert={showAlert} />
      )}
    </>
  );
}

export default WeeklyMenu;
