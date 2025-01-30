import { useRef, useEffect, useState } from 'react';
import { LuCircleArrowRight, LuCircleArrowLeft } from 'react-icons/lu';

// dateMockUp for pixel perfect layout with design
/* const dateMockUp = {
  startWeekDate: 'March 06',
  items: [
    {
      day: 'Mon',
      date: 6,
    },
    {
      day: 'Tue',
      date: 7,
    },
    {
      day: 'Wed',
      date: 8,
    },
    {
      day: 'Thu',
      date: 9,
    },
    {
      day: 'Fri',
      date: 10,
    },
    {
      day: 'Sat',
      date: 11,
    },
    {
      day: 'Sun',
      date: 12,
    },
  ],
};
 */
function DayNavigator() {
  // to scroll horizontally when the user interacts withthe scroll wheel for small screen size
  const scrollRef = useRef(null);

  // currently for employee view: current week dates and month
  const [weekDates, setWeekDates] = useState([]);
  const [month, setMonth] = useState('');

  const getCurrentWeekDates = () => {
    const today = new Date();

    // get the day of the week (0-6, where 0 is Sunday)
    const dayOfWeek = today.getDay();
    // to create a new Date object for Monday of the current week
    const monday = new Date(today);

    // adjust the date of monday to correct day
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    // to extract the month for the current week starting date
    const monthName = monday.toLocaleDateString('en-US', { month: 'long' });
    setMonth(monthName);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
      };
    });
  };

  useEffect(() => {
    setWeekDates(getCurrentWeekDates());
  }, []);

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

  return (
    <div className='flex flex-col items-center border-t-2 border-b-2 lg:border-2 border-primary rounded-lg shadow-md pb-2 md:pb-[0.15rem] lg:mt-[19px] lg:w-[845px] mx-auto '>
      <div className='flex items-center justify-between w-full px-[1.35rem] md:px-[4rem] lg:px-[4.2rem]  '>
        <button className='text-gray-400 relative'>
          <LuCircleArrowLeft className='w-11 h-10 md:w-13 md:h-12' />
        </button>
        <div className='text-center pt-1 md:pt-[0.4rem]'>
          <div className='text-[16px]'>Week of</div>
          <div className='text-[16px] font-bold'>
            {`${month} ${weekDates[0]?.date}`}
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
        {weekDates.map((item, index) => (
          <div
            key={index}
            className={`snap-start flex flex-col flex-[0_0_auto] items-center justify-center w-[70px] h-[72px] md:h-[70px] pt-[3px] ${
              index === 0 ? 'text-white bg-primary' : 'bg-[#F0EBF6]'
            } border border-black rounded-md `}
          >
            <div
              className={`text-[11px] ${
                index === 0 ? 'font-normal' : 'font-bold'
              }`}
            >
              {item.day}
            </div>
            <div
              className={`text-[11px] ${
                index === 0 ? 'font-normal' : 'font-bold'
              }`}
            >
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DayNavigator;
