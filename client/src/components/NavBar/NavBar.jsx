import React, { useEffect, useState, useRef } from 'react';
import { CgProfile } from 'react-icons/cg'; // placeholder for profile icon
import Logo from '../../assets/logo5.svg';
import MenuSection from '../MenuSection/MenuSection';
import EmployeeSection from '../EmployeeSection/EmployeeSection';
import LogOut from '../LogOut.jsx/LogOut';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const menuRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    navigate(token ? '/management' : '/');
  };

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
    <nav className='flex gap-16 justify-between p-[0.55rem] pt-3.5 pb-[1.7rem] md:px-8 md:pt-7 md:pb-[1.6rem] lg:pl-[5.5rem] lg:pt-[0.5rem] lg:pb-[2.1rem]'>
      <div className='flex cursor-pointer' onClick={handleLogoClick}>
        <img
          src={Logo}
          alt='MenuHelp logo'
          className='w-15 h-15 md:w-16 md:h-16 lg:w-[4.68rem] lg:h-[4.68rem] '
        />
        <div className='pt-[1rem] font-bold text-[28px] text-primary md:pt-[1.3rem] md:pl-[1rem] lg:pt-[2rem] lg:pl-[0.9rem] font-shantell'>
          MenuHelp
        </div>
      </div>
      {isLoggedIn && (
        <div>
          <div className='items-center gap-8 hidden sm:flex '>
            <ul className='flex gap-[1rem] px-[0.4rem] pt-2  lg:gap-[4.7rem] lg:pt-[2rem] lg:pr-10'>
              <div className='group relative'>
                <li className='relative'>
                  <p className='cursor-pointer text-primary text-[24px] font-medium lg:font-semibold'>
                    Menu
                  </p>
                  <div className='absolute right-0 top-full z-20'>
                    <MenuSection
                      onGenerate={() => handleMenuButtonClick('Generate')}
                      onView={() => handleMenuButtonClick('View')}
                    />
                  </div>
                </li>
              </div>
              {/*  will need to later hide Allergies if no user log in */}
              <div className='group relative'>
                <li className='relative'>
                  <p className='cursor-pointer text-primary text-[24px] font-medium lg:font-semibold'>
                    Allergies
                  </p>
                  <div className='absolute right-0 top-full z-20'>
                    <EmployeeSection
                      onSelectEmployee={handleEmployeeSelect}
                      onAddEmployee={handleAddEmployee}
                    />
                  </div>
                </li>
              </div>
            </ul>
          </div>
          <div ref={menuRef} className='relative sm:hidden'>
            <CgProfile
              size={40}
              className='absolute top-4 right-7 text-primary'
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
              <div className='absolute right-0 top-14 z-20 bg-white shadow-md rounded-md'>
                <LogOut />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
