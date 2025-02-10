import React, { useEffect, useState, useRef } from 'react';
import { FaArrowDown } from 'react-icons/fa6';
import { LuCircleArrowRight, LuCircleArrowLeft } from 'react-icons/lu';
import ExportToPDF from '../ExportToPDF/ExportToPDF';
import ExportToExcel from '../ExportToExcel/ExportToExcel';
import EditMealModal from '../EditMeal/EditMeal';
import DishCard from './DishCard';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Controller } from 'swiper/modules';
import 'swiper/css';

function WeeklyMenu() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const location = useLocation();
  const { weekStartDate } = location.state || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWeekStartDate, setCurrentWeekStartDate] =
    useState(weekStartDate);
  const [isNextWeekDisabled, setIsNextWeekDisabled] = useState(false);

  const dishSwiperRef = useRef(null);
  const dateSwiperRef = useRef(null);

  // to fetch weekly menu
  const fetchWeeklyMenu = async (weekStart) => {
    try {
      const response = await fetch(
        `https://eato-meatplanner.netlify.app/.netlify/functions/menus?weekStartDate=${weekStart}`
      );
      const data = await response.json();
      // console.log(data.data);
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
      console.log('weekstart dish', formattedDates);
      setSelectedDate(formattedDates[0]?.fullDate);
    } catch (error) {
      console.error('Error fetching weekly menu:', error);
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
  const fetchMenuForDate = (weekStartDate) => {
    if (weekStartDate) {
      fetchWeeklyMenu(weekStartDate);
    }
  };

  // Fetch weekly menu on mount
  useEffect(() => {
    const weekStart = weekStartDate || getWeekStartDate();
    fetchMenuForDate(weekStart);
  }, [weekStartDate]);

  // Fetch menu on mount and when currentWeekStartDate changes
  useEffect(() => {
    if (currentWeekStartDate) {
      fetchMenuForDate(currentWeekStartDate);
    }
  }, [currentWeekStartDate]);

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
        alert('There is no menu for the next week.');
        setIsNextWeekDisabled(true);
      }
    } catch (error) {
      console.error('Error fetching the menu:', error);
      alert('An error occurred while fetching the menu.');
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

  return (
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
                                dishSwiperRef.current?.slideTo(index); // Move dish swiper
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
                dateSwiperRef.current?.slideTo(swiper.activeIndex); // Move date swiper
              }}
              className='h-full'
            >
              {weekDates.map((item) => (
                <SwiperSlide key={item.fullDate}>
                  <DishCard item={item} getImageURL={getImageURL} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* Dish details for medium and large screens */}
          <div className='hidden md:block min-h-[620px] '>
            {/* --- DISH SWIPER (Desktop) --- */}
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
                    <DishCard item={item} getImageURL={getImageURL} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Edit & Export  */}
        {weekStartDate && (
          <div className='mt-5 md:mt-0 flex justify-between items-center border-t-2 border-b-2 border-primary px-3 pt-2 pb-1 bg-white'>
            {/* Edit */}
            <button
              className={`border-[1px] border-primary text-primary py-1 px-4 rounded-full font-semibold text-[24px] shadow-md shadow-gray-400 w-fit ${
                currentWeekStartDate === currentWeekStart
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={() => setIsModalOpen(true)}
              disabled={currentWeekStartDate === currentWeekStart}
            >
              Edit Menu
            </button>

            {/* Export buttons */}
            <div className='group relative flex flex-col items-center'>
              <p className='bg-primary text-white p-1 px-6 rounded-full text-[24px] flex items-center justify-center gap-2 shadow-lg w-fit cursor-pointer shadow-md shadow-gray-400'>
                Export Menu <FaArrowDown />
              </p>
              <div className='hidden group-hover:flex flex-col mt-2 absolute bottom-[100%] left-2 right-0 z-20'>
                <ExportToPDF weekDates={weekDates} getImageURL={getImageURL} />
                <ExportToExcel weekDates={weekDates} />
              </div>
            </div>
          </div>
        )}

        {/* The modal is rendered conditionally */}
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
  );
}

export default WeeklyMenu;
