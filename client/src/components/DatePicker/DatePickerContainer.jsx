import DatePicker from './DatePicker';
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
        />
      </div>
    </div>
  );
}

export default DatePickerContainer;
