import { useRef, useEffect } from 'react';
import { LuCircleArrowRight, LuCircleArrowLeft } from 'react-icons/lu';

const dateMockUp = {
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

function DayNavigator() {
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

  return (
    <div className='flex flex-col items-center border-t-2 border-b-2 lg:border-2 border-primary rounded-lg shadow-md pb-2 md:pb-[0.15rem] lg:mt-[19px] lg:w-[845px] mx-auto '>
      <div className='flex items-center justify-between w-full px-[1.35rem] md:px-[4rem] lg:px-[4.2rem]  '>
        <button className='text-gray-400 relative'>
          <LuCircleArrowLeft className='w-11 h-10 md:w-13 md:h-12' />
        </button>
        <div className='text-center pt-1 md:pt-[0.4rem]'>
          <div className='text-[16px]'>Week of</div>
          <div className='text-[16px] font-bold'>
            {dateMockUp.startWeekDate}
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
        {dateMockUp.items.map((item, index) => (
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
