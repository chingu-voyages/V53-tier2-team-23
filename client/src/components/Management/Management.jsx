import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuSection from '../MenuSection/MenuSection';
import EmployeeSection from '../EmployeeSection/EmployeeSection';

function Management() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  // to navigate to the calendar for user to select week
  const handleMenuButtonClick = (action) => {
    navigate('/calendar', { state: { action, isViewMode: action === 'View' } });
  };

  const handleEmployeeSelect = (employee) => {
    sessionStorage.setItem('clearSession', 'true');
    navigate('/manage-allergies', {
      state: {
        employeeData: {
          employeeId: employee._id,
          identity: employee.employeeName,
        },
      },
    });
  };

  const handleAddEmployee = () => {
    navigate('/create-employee');
  };

  return (
    <div className='custom-bg md:h-[995px] lg:h-[907px]'>
      <div className='relative z-10 flex flex-col items-center gap-10 md:mt-1 lg:mt-0 '>
        <h1 className='font-shantell text-[24px] sm:hidden'>
          Welcome {username}!
        </h1>
        <h1 className='font-shantell text-[36px] font-bold text-primary text-center hidden sm:block lg:text-[48px]'>
          Welcome {username}, <br className='hidden md:block lg:hidden' />
          <span className='hidden md:inline'>Plan your weekly menu!</span>
        </h1>

        <div className='flex flex-col gap-24 justify-center items-center mb-10 mt-5 md:mt-[0.9rem] md:gap-14 md:py-[98px] md:bg-white md:w-[465px] md:h-[570px] md:rounded-3xl lg:py-[115px] lg:gap-24'>
          {/* Menu Section */}
          <div className='flex flex-col gap-3'>
            <p className='font-shantell text-primary text-[24px] font-bold text-center'>
              Plan your weekly menu
            </p>
            <div className='group focus:outline-none relative w-[340px] shadow-gray-400 shadow-md rounded-full hover:shadow-none'>
              <p className='border-secondary border-[5px] bg-white rounded-full px-16 h-[56px] text-2xl font-semibold text-primary text-center flex items-center justify-center'>
                MENUS
              </p>
              <div className='flex flex-col justify-center items-center'>
                <MenuSection
                  onGenerate={() => handleMenuButtonClick('Generate')}
                  onView={() => handleMenuButtonClick('View')}
                />
              </div>
            </div>
          </div>

          {/* Allergy Section */}
          <div className='flex flex-col gap-3 items-center justify-center h-full p-16 md:p-0'>
            <p className='font-shantell text-primary max-w-[283px] text-[24px] font-bold text-center'>
              Need to edit allergies of an employee?
            </p>
            <div className='group relative w-[340px] shadow-gray-400 shadow-md rounded-full hover:shadow-none'>
              <p className='border-secondary border-[5px] bg-white rounded-full px-16 h-[56px] text-2xl font-semibold text-primary text-center flex items-center justify-center'>
                ALLERGIES
              </p>
              <div className='flex flex-col justify-center items-center'>
                <EmployeeSection
                  onSelectEmployee={handleEmployeeSelect}
                  onAddEmployee={handleAddEmployee}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Management;
