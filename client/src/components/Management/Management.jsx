import { React, useState } from 'react';
import DatePicker from '../DatePicker/DatePicker';

function Managemenet({ username }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState('');

  // to reveal the calendar for user to select week
  const handleButtonClick = (action) => {
    setButtonText(action);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className='font-shantell'>Welcome {username}!</h1>

      {/* Menu Section */}
      <div>
        <p className='font-shantell'>Plan your weekly menu</p>
        <div className='group relative flex flex-col'>
          <p className='border-secondary border-2 rounded-full w-fit px-16'>
            Menus
          </p>
          <div className='hidden group-hover:flex flex-col gap-3 mt-2 w-fit'>
            <button onClick={() => handleButtonClick('Generate')}>
              Generate Menus
            </button>
            <button onClick={() => handleButtonClick('View')}>
              View Menus
            </button>
          </div>
        </div>
      </div>

      {/* Allergy Section */}
      <div>
        <p className='font-shantell'>Need to edit allergies of an employee?</p>
        <div className='group relative flex flex-col'>
          <p className='border-secondary border-2 rounded-full w-fit px-16'>
            Allergies
          </p>
          <div className='hidden group-hover:flex flex-col gap-3 mt-2 w-fit'>
            <button>Select an Employee</button>
            <button>Add an Employee</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div>
          <DatePicker
            className='flex justify-between'
            setIsModalOpen={setIsModalOpen}
            action={buttonText}
            isViewMode={buttonText === 'View'}
          />
        </div>
      )}
    </div>
  );
}

export default Managemenet;
