import HomeIcon from '../../assets/Home.svg';
import MenuIcon from '../../assets/Menu.svg';
import { CgProfile } from 'react-icons/cg';
import LogOut from '../LogOut.jsx/LogOut';
import MenuSection from '../MenuSection/MenuSection';
import EmployeeSection from '../EmployeeSection/EmployeeSection';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function Footer() {
  const navigate = useNavigate();
  const [showNavOptions, setShowNavOptions] = useState(false);
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
    setShowNavOptions(false);
    navigate('/calendar', { state: { action, isViewMode: action === 'View' } });
  };

  const handleEmployeeSelect = (employee) => {
    sessionStorage.setItem('clearSession', 'true');
    setShowNavOptions(false);
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
    setShowNavOptions(false);
    navigate('/create-employee');
  };

  const toggleNavOptions = () => {
    setShowNavOptions((prev) => !prev);
  };

  return (
    <footer className='relative flex items-center justify-between px-6 py-5 md:py-[0.9rem] md:px-9 lg:px-[2.35rem] lg:py-4 bg-white border-t border-primary'>
      {/* Footer Content */}
      <div className='flex space-x-14 pl-1 pb-2 md:pl-[0.7rem] md:pt-[0.2rem] md:space-x-16 lg:pt-[0.55rem] lg:space-x-10'>
        <button onClick={handleLogoClick}>
          <img
            src={HomeIcon}
            alt='Home button'
            className='w-10 h-10 md:w-12 md:h-12'
          />
        </button>

        <a
          href='https://github.com/chingu-voyages/V53-tier2-team-23/tree/main'
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary text-[20px] font-medium relative pt-2 md:pt-[0.85rem] md:pl-[0.85rem] lg:pl-[2.8rem]'
        >
          View Our GitHub
        </a>
      </div>

      {isLoggedIn && (
        <div>
          <div ref={menuRef} className='relative sm:flex hidden'>
            <CgProfile
              className='w-14 h-14 lg:w-16 lg:h-16 text-primary'
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
              <div className='absolute right-0 bottom-14 z-20 bg-white shadow-md rounded-md'>
                <LogOut />
              </div>
            )}
          </div>

          <button
            onClick={toggleNavOptions}
            className='text-primary relative sm:hidden'
          >
            <img
              src={MenuIcon}
              className='w-10 h-10 md:w-12 md:h-12'
              alt='Menu'
            />
          </button>
        </div>
      )}

      {/* Dropdown Menu */}
      {showNavOptions && (
        <div className='absolute bottom-full right-0 w-full bg-white shadow-lg border-t border-gray-300 transition-transform z-20'>
          <div className='group relative'>
            <p className='cursor-pointer block w-full p-4 text-primary font-medium text-2xl bg-white border-[1px] border-primary text-center'>
              Menus
            </p>
            <div className='absolute left-1/2 bottom-full -translate-x-1/2 z-20'>
              <MenuSection
                onGenerate={() => handleMenuButtonClick('Generate')}
                onView={() => handleMenuButtonClick('View')}
              />
            </div>
          </div>

          <div className='group relative'>
            <p className='cursor-pointer block w-full p-4 text-primary font-medium text-2xl bg-white border-[1px] border-primary text-center'>
              Allergies
            </p>
            <div className='absolute left-1/2 bottom-full -translate-x-1/2 z-20'>
              <EmployeeSection
                onSelectEmployee={handleEmployeeSelect}
                onAddEmployee={handleAddEmployee}
              />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
