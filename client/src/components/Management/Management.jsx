import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Management() {
  const [buttonText, setButtonText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state?.username || {};

  // to navigate to the calendar for user to select week
  const handleMenuButtonClick = (action) => {
    setButtonText(action);
    navigate('/calendar', { state: { action, isViewMode: action === 'View' } });
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
            <button onClick={() => handleMenuButtonClick('Generate')}>
              Generate Menus
            </button>
            <button onClick={() => handleMenuButtonClick('View')}>
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
            <button onClick={() => navigate('/create-employee')}>
              Add an Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Management;
