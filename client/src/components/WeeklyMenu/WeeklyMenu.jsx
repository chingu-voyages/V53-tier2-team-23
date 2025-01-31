import { useEffect, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa6';
import DayNavigator from '../DayNavigator/DayNavigator';

function WeeklyMenu() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [menu, setMenu] = useState(null);
  const [dish, setDish] = useState(null);
  const [weekDates, setWeekDates] = useState([]);

  // to fetch weekly menu
  const fetchWeeklyMenu = async (weekStart) => {
    try {
      const response = await fetch(
        `http://localhost:8888/.netlify/functions/menus?weekStartDate=${weekStart}`
      );
      const data = await response.json();
      setMenu(data.data);

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
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const weekStart = monday.toISOString().split('T')[0];

    fetchWeeklyMenu(weekStart);
  }, []);

  // Update dish when selectedDate changes
  useEffect(() => {
    if (menu && selectedDate) {
      const selectedDay = menu.days.find((day) =>
        day.date.startsWith(selectedDate)
      );
      setDish(selectedDay?.dish || null);
    }
  }, [selectedDate, menu]);

  return (
    <div>
      <DayNavigator
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        weekDates={weekDates}
      />
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
              src={dish.imageUrl}
              alt={dish.dishName}
              className='rounded-xl border-[3px] border-primary object-cover h-full w-full'
            />
          </div>
          <div className='mt-4 text-left mx-5'>
            <h2 className='font-bold text-[20px]'>Ingredients</h2>
            <div className='grid grid-cols-2 gap-5 mt-6'>
              {dish.ingredients.map((item) => (
                <div key={item} className='flex items-center gap-2'>
                  <span className='text-[20px]'>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className='mt-7 flex justify-start mx-3'>
            <div className='bg-secondary text-black font-bold py-[0.5rem] px-3 inline-block'>
              Calories: {dish.calories}
            </div>
          </div>
          <div className='mt-6 flex flex-col gap-7 items-center'>
            <button className='bg-primary text-white p-1 px-6 rounded-full text-[24px] flex items-center justify-center gap-2 shadow-lg w-fit'>
              EXPORT WEEKLY PLAN <FaArrowDown />
            </button>
            <button className='border-[1px] border-primary text-primary py-1 px-4 rounded-full font-semibold text-[24px] font-shantell shadow-lg w-fit'>
              EDIT MEAL
            </button>
          </div>
        </div>
      ) : (
        <p className='text-center mt-5'>No meal planned for this date.</p>
      )}
    </div>
  );
}

export default WeeklyMenu;
