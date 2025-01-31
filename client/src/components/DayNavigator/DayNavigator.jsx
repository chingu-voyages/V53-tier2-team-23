import { useRef, useEffect } from 'react';
import { LuCircleArrowRight, LuCircleArrowLeft } from 'react-icons/lu';

function DayNavigator({ selectedDate, setSelectedDate, weekDates }) {
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

  return (
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
  );
}

export default DayNavigator;
