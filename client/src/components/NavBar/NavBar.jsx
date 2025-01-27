import React from 'react';
import { CgProfile } from 'react-icons/cg'; // placeholder for profile icon
import Logo from '../../assets/logo5.svg';

function NavBar() {
  return (
    <nav className='flex gap-16 justify-between p-2 pt-3.5 pb-[1.7rem] md:px-9 md:pt-9 md:pb-[1.1rem] lg:pl-[5.5rem] lg:pt-[0.5rem] lg:pb-[1.8rem]'>
      <div className='flex gap-2'>
        <img
          src={Logo}
          alt='MenuHelp logo'
          className='w-15 h-15 md:w-16 md:h-16 lg:w-[4.68rem] lg:h-[4.68rem] '
        />
        <div className='pt-[1.1rem] pl-[0.9rem] font-bold text-[19px] text-primary md:pt-[1.95rem] md:pl-[1.3rem] lg:pt-[2.25rem] lg:pl-[1.75rem] lg:text-[20px]'>
          MenuHelp
        </div>
      </div>
      <div className='items-center gap-8 hidden sm:flex'>
        <ul className='flex gap-[1.55rem] font-poppins text-[24px] font-medium px-4 pt-5 lg:gap-[4rem] lg:pt-[2.7rem] lg:pr-10'>
          <li>Menus</li>
          {/*  will need to later hide Allergies if no user log in */}
          <li>Allergies</li>
          <li className='relative right-[0.1rem] lg:right-[0.2rem]'>Weeks</li>
          {/* to make it pixel perfect as only the weeks is a little off */}
        </ul>
      </div>
      <div className='relative sm:hidden '>
        <CgProfile size={40} className='absolute top-3 right-8 text-primary' />
      </div>
    </nav>
  );
}

export default NavBar;
