import HomeIcon from '../../assets/Home.svg';
import MenuIcon from '../../assets/Menu.svg';
import { CgProfile } from 'react-icons/cg';
import MenuSection from '../MenuSection/MenuSection';
import EmployeeSection from '../EmployeeSection/EmployeeSection';
import LogOut from '../LogOut.jsx/LogOut';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const token = localStorage.getItem('token');

    if (token) {
      navigate('/management');
    } else {
      navigate('/');
    }
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
    <footer className='flex items-center justify-between px-6 py-5 md:py-[0.9rem] md:px-9 lg:px-[2.35rem] lg:py-4'>
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
          className='text-primary text-[20px] font-medium relative pt-2 md:pt-[0.85rem] md:pl-[0.85rem] lg:pl-[2.8rem]'
        >
          View Our GitHub
        </a>
      </div>

      <div className='hidden sm:flex group'>
        <CgProfile className='md:w-14 md:h-14 lg:w-16 lg:h-16 text-primary' />
        <div className='absolute right-0 top-auto z-20'>
          <LogOut />
        </div>
      </div>
      <button className='sm:hidden '>
        <img src={MenuIcon} alt='Menu Icon' className='w-15 h-15' />
      </button>
    </footer>
  );
}

export default Footer;
