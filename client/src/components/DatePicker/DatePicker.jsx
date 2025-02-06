import React, { useState, useEffect } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  eachDayOfInterval,
} from 'date-fns';
import { DayPicker, useDayPicker } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';
import 'react-day-picker/dist/style.css';
import WeeklyMenu from '../WeeklyMenu/WeeklyMenu';

export default function DatePicker({
  customDayPicker,
  daysOffContainer,
  daysOffText,
  action,
  isViewMode,
}) {
  const [selectedDaysOff, setSelectedDaysOff] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [formattedNextWeekStart, setFormattedNextWeekStart] = useState('');
  const [formattedNextWeekEnd, setFormattedNextWeekEnd] = useState('');
  const [highlightedDaysOff, setHighlightedDaysOff] = useState(null); // Store the highlighted day
  // const [selectedWeekData, setSelectedWeekData] = useState(null);
  const [selectedWeekStart, setSelectedWeekStart] = useState(null); // to store the startWeekDate
  const [result, setResult] = useState(false);
  const weekdaysArray = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const navigate = useNavigate();

  const handleNotice = (message) => {
    alert(message);
  };

  const today = new Date();

  // Get current week's Monday start and Sunday end
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 });

  // Get next week's Monday start and Sunday end
  const nextWeekStart = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
  const nextWeekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 1 });

  // select current week in view mode else select next week
  useEffect(() => {
    if (isViewMode) {
      setSelectedWeek({ from: currentWeekStart, to: currentWeekEnd });
      setFormattedNextWeekStart(format(currentWeekStart, 'MMMM d, yyyy'));
      setFormattedNextWeekEnd(format(currentWeekEnd, 'MMMM d, yyyy'));
    } else {
      setSelectedWeek({ from: nextWeekStart, to: nextWeekEnd });
      setFormattedNextWeekStart(format(nextWeekStart, 'MMMM d, yyyy'));
      setFormattedNextWeekEnd(format(nextWeekEnd, 'MMMM d, yyyy'));
    }
  }, [isViewMode]);

  // single day off
  // const handleSelectedDayOffClick = (day) => {
  //   toggle ? setSelectedDayoff(day) : setSelectedDayoff('');
  //   setToggle(!toggle);
  // };

  const handleSelectedDaysOffClick = (event, day) => {
    event.preventDefault();
    const clickedDay = event.currentTarget.getAttribute('data-day');

    if (selectedWeek) {
      const dayOfWeek = weekdaysArray.indexOf(day);
      const targetDay = addDays(selectedWeek.from, dayOfWeek);
      const currentDay = format(targetDay, 'yyyy-MM-dd');

      if (selectedDaysOff.includes(currentDay)) {
        // Remove the day if already selected
        setSelectedDaysOff((previousSelectedDayOff) =>
          previousSelectedDayOff.filter((day) => day !== currentDay)
        );
      } else {
        // Add the day only if less than 2 are selected
        if (selectedDaysOff.length < 2) {
          setSelectedDaysOff((previousSelectedDayOff) => [
            ...previousSelectedDayOff,
            currentDay,
          ]);
        }
      }
    }
  };

  const handleDayClick = (day) => {
    const newStart = startOfWeek(day, { weekStartsOn: 1 });
    const newEnd = endOfWeek(day, { weekStartsOn: 1 });

    if (selectedWeek && selectedWeek.from.getTime() === newStart.getTime()) {
      setSelectedWeek(null);
      setSelectedDaysOff([]); // Clear selected days off
    } else {
      setSelectedWeek({ from: newStart, to: newEnd });
      setSelectedDaysOff([]); // Reset days off when changing the week
    }

    const weekDates = getWeekDates(newStart, newEnd);

    setHighlightedDaysOff(weekDates);

    setFormattedNextWeekStart(format(newStart, 'MMMM d, yyyy'));
    setFormattedNextWeekEnd(format(newEnd, 'MMMM d, yyyy'));
  };

  // Get all the days in the selected week
  const getWeekDates = (newStart, newEnd) => {
    return eachDayOfInterval({
      //https://date-fns.org/v4.1.0/docs/eachDayOfInterval
      start: newStart,
      end: newEnd,
    });
  };

  // create form object
  class SelectedWeekObject {
    constructor(newStart, newEnd, selectedDaysOff) {
      this.newStart = newStart;
      this.newEnd = newEnd;
      this.selectedDaysOff = selectedDaysOff;
      this.formattedSelectedWeek = this.formatWeekDates();
      this.selectedWeek = this.createSelectedWeekObject();
    }

    // get all days between the start - end
    getSelectedWeekDates() {
      return eachDayOfInterval({
        start: this.newStart,
        end: this.newEnd,
      });
    }

    // format dates
    formatWeekDates() {
      const from = format(this.newStart, 'yyyy-MM-dd');
      const to = format(this.newEnd, 'yyyy-MM-dd');

      return {
        from,
        to,
      };
    }

    // create the week object with days and dayOff status
    createSelectedWeekObject() {
      const selectedWeekDaysList = this.getSelectedWeekDates();

      const selectedWeekDays = selectedWeekDaysList.map((day) => {
        const formattedDay = format(day, 'yyyy-MM-dd'); // 2025-02-01
        const dayName = format(day, 'eeee'); // "Monday"
        const dayOffStatus = this.selectedDaysOff.includes(formattedDay); // Check if it's a day off
        return {
          date: formattedDay,
          day: dayName,
          dayOff: dayOffStatus,
        };
      });

      return {
        selectedWeekRange: {
          from: this.formattedSelectedWeek.from,
          to: this.formattedSelectedWeek.to,
        },
        selectedWeekDays: selectedWeekDays,
      };
    }
  }

  // generate menu for the selected week
  const createMenu = async (requestData, token, selectedDaysOff) => {
    try {
      // fetch filtered dishes
      const filteredDishes = await fetch(
        'https://eato-meatplanner.netlify.app/.netlify/functions/dishes/filtered',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Debugging
      /*       console.log('Response Status:', filteredDishes.status);
      if (!filteredDishes.ok) {
        const errorData = await filteredDishes.json();
        console.log('Error fetching dishes:', errorData);
        handleNotice(`Error: ${errorData.message}`);
        return;
      } */

      const filteredDishesRes = await filteredDishes.json();

      // to extract only the _id of each dish
      const dishIds = filteredDishesRes.data.dishes.map((dish) => dish._id);

      // function to get a random dish
      const getRandomDish = () => {
        if (dishIds.length === 0) {
          return handleNotice('No dishes available');
        }
        const randomIndex = Math.floor(Math.random() * dishIds.length);
        return dishIds[randomIndex];
      };

      // to assign random dishes but null on days off
      const newRequestData = {
        ...requestData,
        days: requestData.days.map((day) => ({
          ...day,
          dish: selectedDaysOff.includes(day.date) ? null : getRandomDish(),
        })),
      };

      // create new menu
      const response = await fetch(
        'https://eato-meatplanner.netlify.app/.netlify/functions/menus',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newRequestData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        // Handle error if the menu already exists or any other issue
        handleNotice(`Error: ${responseData.message}`);
        return null;
      }
      return responseData;
    } catch (error) {
      handleNotice(`Error: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a new Selected Week object
    const newSelectedWeekObject = new SelectedWeekObject(
      selectedWeek.from,
      selectedWeek.to,
      selectedDaysOff
    );

    // Get the selectedWeekData from the created week
    const selectedWeekData = newSelectedWeekObject.selectedWeek;

    const { selectedWeekRange, selectedWeekDays } = selectedWeekData;

    // console.log('Week:', selectedWeekRange);
    // console.log('Weekdays:', selectedWeekDays);

    if (isViewMode) {
      setResult(true);
      setSelectedWeekStart(selectedWeekRange.from);
      navigate('/menu', { state: { weekStartDate: selectedWeekRange.from } });
      return;
    }

    const requestData = {
      weekStartDate: selectedWeekRange.from,
      days: selectedWeekDays.map((day) => ({
        date: day.date,
        dish: null, // temporary placeholder
      })),
    };

    const token = localStorage.getItem('token');

    const responseData = await createMenu(requestData, token, selectedDaysOff);

    if (responseData) {
      setResult(true);
      // setSelectedWeekData(selectedWeekData);
      setSelectedWeekStart(selectedWeekRange.from);
      navigate('/menu', { state: { weekStartDate: selectedWeekRange.from } });
    }
  };

  const handleReset = (event) => {
    event.preventDefault();
    setSelectedWeek({ from: nextWeekStart, to: nextWeekEnd });
    setFormattedNextWeekStart(format(nextWeekStart, 'MMMM d, yyyy'));
    setFormattedNextWeekEnd(format(nextWeekEnd, 'MMMM d, yyyy'));
    setSelectedDaysOff([]);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='mt-6'>
        <div className='mt-2'>
          <div className='weekspointer-container w-full flex align-center justify-start rounded-tr-[25px] rounded-tl-[25px] bg-white p-[15px_50px_22px_0px] box-border border-b-2 border-b-[#e5e5e5]'>
            <span className='flex justify-start p-[8px_0px_8px_25px] text-lg'>
              {formattedNextWeekStart}
            </span>
            <span className='flex justify-center p-[8px_10px] text-lg'>⟶</span>
            <span className='flex justify-end p-[8px_25px_8px_5px] text-lg'>
              {formattedNextWeekEnd}
            </span>
          </div>
          <DayPicker
            modifiers={{
              dayoffbgHighlight: selectedWeek
                ? selectedDaysOff.map((day) => new Date(day))
                : [],
            }}
            modifiersClassNames={{
              dayoffbgHighlight: selectedWeek
                ? 'DayPicker-Day--dayoffbg-highlight'
                : undefined, // Add a custom class for the highlighted days
            }}
            disabled={
              isViewMode
                ? { before: currentWeekStart }
                : { before: nextWeekStart }
            } // allow current week to be selected in view mode
            broadcastCalendar
            captionLayout='dropdown'
            fromYear={2000}
            toYear={2030}
            mode='range'
            selected={selectedWeek}
            onSelect={setSelectedWeek} // Automatically handles selection
            defaultMonth={selectedWeek?.from} // Start at the preselected week
            onDayClick={handleDayClick} // Ensure manual selection works
            //showWeekNumber
            className={`${customDayPicker}`} // Custom class for styling
          />
          <div
            style={{ display: isViewMode ? 'none' : 'flex' }}
            className={`${daysOffContainer} flex align-center flex-wrap justify-center gap-3 max-sm:p-[0px_0px_25px] sm:p-[0px_0px_25px] md::p-[0px_28px_25px] lg:p-[0px_28px_25px] bg-white`}
          >
            <span
              className={`${daysOffText} text-black bg-gray-500 p-[5px_10px] rounded-[25px] border-2 border-black text-sm`}
            >
              Days OFF
            </span>
            {weekdaysArray.map((day, index) => {
              const dayOfWeek = weekdaysArray.indexOf(day); // Get the index of the day
              const targetDay = selectedWeek?.from
                ? addDays(selectedWeek.from, dayOfWeek)
                : null;

              const currentDay = targetDay
                ? format(targetDay, 'yyyy-MM-dd')
                : null;
              return (
                <button
                  key={index}
                  className={`select-none ${
                    // selectedDayoff === day //for one day
                    selectedDaysOff.includes(currentDay)
                      ? 'days-off-text text-black bg-gray-500 p-[5px_10px] rounded-[25px] border-2 border-black text-sm selected'
                      : 'bg-white p-[5px_10px] border-2 border-[#752f62] rounded-[25px] text-xs leading-[1.6]'
                  }`}
                  onClick={(event) => handleSelectedDaysOffClick(event, day)}
                  data-day={currentDay}
                >
                  {day.slice(0, 2)}
                </button>
              );
            })}
          </div>
          <div className='buttons-container w-full flex align-center justify-between rounded-br-[25px] rounded-bl-[25px] bg-white p-[20px_50px_20px] box-border border-t-2 border-t-[#e5e5e5]'>
            <button
              onClick={handleReset}
              className='flex justify-start p-[5px_15px] rounded-[25px] border-2 text-[#752f62] border-[#752f62] text-md'
            >
              Reset
            </button>
            <button
              type='submit'
              className='flex justify-end p-[5px_15px] rounded-[25px] border-2 border-white text-white bg-[#752f62] text-md'
            >
              Save and {action} menu
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

//not needed to show the selected week data
/* {result && selectedWeekData && (
  <>
    <div className='result-container grow'>
      <div className='p-4 bg-gray-100 border rounded-md'>
        <h2 className='text-lg font-bold'>Selected Week</h2>

        <p>From: {selectedWeekData.selectedWeekRange.from}</p>
        <p>To: {selectedWeekData.selectedWeekRange.to}</p>
        <h2 className='text-lg font-bold mt-2'>Weekdays</h2>
        <ul>
          {selectedWeekData.selectedWeekDays &&
          selectedWeekData.selectedWeekDays.length > 0 ? (
              selectedWeekData.selectedWeekDays.map((item, index) => (
                <ul key={index} className='day-item'>
                  <li>{item.date}</li>
                  <li>{item.day}</li>
                  <li>{item.dayoff}</li>
                </ul>
              ))
            ) : (
              <li>No weekdays selected</li>
            )}
        </ul>
      </div>
    </div>
  </>
)} */
