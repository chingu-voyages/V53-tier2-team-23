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
import 'react-day-picker/dist/style.css';

export default function DatePicker() {
  const [selectedDaysOff, setSelectedDaysOff] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [formattedNextWeekStart, setFormattedNextWeekStart] = useState('');
  const [formattedNextWeekEnd, setFormattedNextWeekEnd] = useState('');
  const [highlightedDaysOff, setHighlightedDaysOff] = useState(null); // Store the highlighted day
  const weekdaysArray = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const today = new Date();
  // Get next week's Monday start and Sunday end
  const nextWeekStart = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
  const nextWeekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 1 });

  useEffect(() => {
    setSelectedWeek({ from: nextWeekStart, to: nextWeekEnd });
    console.log(selectedWeek);
    setFormattedNextWeekStart(format(nextWeekStart, 'MMMM d, yyyy'));
    setFormattedNextWeekEnd(format(nextWeekEnd, 'MMMM d, yyyy'));
  }, []);

  // single day off
  // const handleSelectedDayOffClick = (day) => {
  //   toggle ? setSelectedDayoff(day) : setSelectedDayoff('');
  //   setToggle(!toggle);
  // };

  const handleSelectedDaysOffClick = (event, day) => {
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

  const handleSubmit = (event) => {
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

    console.log('Week:', selectedWeekRange);
    console.log('Weekdays:', selectedWeekDays);

    return selectedWeekData;
  };

  const handleReset = (event) => {
    event.preventDefault();
    setSelectedWeek({ from: nextWeekStart, to: nextWeekEnd });
    setFormattedNextWeekStart(format(nextWeekStart, 'MMMM d, yyyy'));
    setFormattedNextWeekEnd(format(nextWeekEnd, 'MMMM d, yyyy'));
    setSelectedDaysOff([]);
  };

  return (
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
          disabled={{ before: nextWeekStart }}
          //broadcastCalendar
          captionLayout='dropdown'
          fromYear={2000}
          toYear={2030}
          mode='range'
          selected={selectedWeek}
          onSelect={setSelectedWeek} // Automatically handles selection
          defaultMonth={selectedWeek?.from} // Start at the preselected week
          onDayClick={handleDayClick} // Ensure manual selection works
          //showWeekNumber
          className='custom-day-picker' // Custom class for styling
        />
        <div className='days-off-container flex align-center flex-wrap justify-center gap-3 max-sm:p-[0px_0px_25px] sm:p-[0px_0px_25px] md::p-[0px_28px_25px] lg:p-[0px_28px_25px] bg-white'>
          <span className='days-off-text text-black bg-gray-500 p-[5px_10px] rounded-[25px] border-2 border-black text-sm'>
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
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
