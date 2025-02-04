import React, { useEffect, useState, useRef } from 'react';
import { FaArrowDown } from 'react-icons/fa6';
import { LuCircleArrowRight, LuCircleArrowLeft } from 'react-icons/lu';
import ExportToPDF from '../ExportToPDF/ExportToPDF';
import ExportToExcel from '../ExportToExcel/ExportToExcel';

function WeeklyMenu() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [menu, setMenu] = useState(null);
  const [dish, setDish] = useState(null);
  const [weekDates, setWeekDates] = useState([]);

  // to scroll horizontally when the user interacts withthe scroll wheel for small screen size
  const scrollRef = useRef(null);

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
      <div className='flex flex-col items-center border-t-2 border-b-2 lg:border-2 border-primary rounded-lg shadow-md pb-2 md:pb-[0.15rem] lg:mt-[19px] lg:w-[845px] mx-auto '>
        <div className='flex items-center justify-between w-full px-[1.35rem] md:px-[4rem] lg:px-[4.2rem]  '>
          <button className='text-gray-400 relative'>
            <LuCircleArrowLeft className='w-11 h-10 md:w-13 md:h-12' />
          </button>
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
          <button className='text-primary relative'>
            <LuCircleArrowRight className='w-11 h-10 md:w-13 md:h-12' />
          </button>
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
        </div>
      ) : (
        <p className='text-center mt-5'>No meal planned for this date.</p>
      )}
      <div className='mt-6 flex flex-col gap-7 items-center'>
        <div className='group relative flex flex-col items-center'>
          <p className='bg-primary text-white p-1 px-6 rounded-full text-[24px] flex items-center justify-center gap-2 shadow-lg w-fit cursor-pointer'>
            EXPORT WEEKLY PLAN <FaArrowDown />
          </p>
          <div className='hidden group-hover:flex flex-col gap-3 mt-2'>
            <ExportToPDF weekDates={weekDates} />
            <ExportToExcel weekDates={weekDates} />
          </div>
        </div>

        <button className='border-[1px] border-primary text-primary py-1 px-4 rounded-full font-semibold text-[24px] font-shantell shadow-lg w-fit'>
          EDIT MEAL
        </button>
      </div>
    </div>
  );
}

export default WeeklyMenu;
