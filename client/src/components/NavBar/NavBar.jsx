import React from 'react';
import { CgProfile } from 'react-icons/cg'; // placeholder for profile icon
import Logo from '../../assets/logo5.svg';

function NavBar() {
  return (
    <nav className='flex gap-16 justify-between p-[0.55rem] pt-3.5 pb-[1.7rem] md:px-8 md:pt-7 md:pb-[1.6rem] lg:pl-[5.5rem] lg:pt-[0.5rem] lg:pb-[2.1rem]'>
      <div className='flex '>
        <img
          src={Logo}
          alt='MenuHelp logo'
          className='w-15 h-15 md:w-16 md:h-16 lg:w-[4.68rem] lg:h-[4.68rem] '
        />
        <div className='pt-[1rem] font-bold text-[28px] text-primary md:pt-[1.3rem] md:pl-[1rem] lg:pt-[2rem] lg:pl-[0.9rem] font-shantell'>
          MenuHelp
        </div>
      </div>
      <div className='items-center gap-8 hidden sm:flex text-primary'>
        <ul className='flex gap-[1rem] text-[24px] font-medium px-[0.4rem] pt-2 lg:font-semibold lg:gap-[4.7rem] lg:pt-[2rem] lg:pr-10'>
          <li>Menus</li>
          {/*  will need to later hide Allergies if no user log in */}
          <li>Allergies</li>
        </ul>
      </div>
      <div className='relative sm:hidden '>
        <CgProfile size={40} className='absolute top-4 right-7 text-primary' />
      </div>
    </nav>
  );
}

export default NavBar;
