import React from 'react';
import DatePicker from './DatePicker';
import { useLocation } from 'react-router-dom';
import styles from './DatePicker.module.css';

const customStyles = {
  datepickerContainer: styles['datepicker-container'],
  customDayPicker: styles['custom-day-picker'],
  daysOffContainer: styles['days-off-container'],
  daysOffText: styles['days-off-text'],
};

const { datepickerContainer, customDayPicker, daysOffContainer, daysOffText } =
  customStyles;

function DatePickerContainer() {
  const location = useLocation();
  const { action, isViewMode } = location.state || {};
  return (
    <div
      className={`${datepickerContainer} lg:p-[20px_70px_26px] flex flex-col flex-wrap items-center`}
    >
      <h1 className='text-white w-full text-4xl text-center h-14'>Calendar</h1>
      <div className='flex justify-between flex-row align-center gap-5'>
        <DatePicker
          customDayPicker={customDayPicker}
          daysOffContainer={daysOffContainer}
          daysOffText={daysOffText}
          action={action}
          isViewMode={isViewMode}
        />
      </div>
    </div>
  );
}

export default DatePickerContainer;
