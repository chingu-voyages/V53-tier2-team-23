import React from 'react';
import { CgProfile } from 'react-icons/cg'; // placeholder for profile icon
import Logo from '../../assets/logo5.svg';

function NavBar() {
  return (
    <nav className='flex gap-16 justify-between p-2 pt-3.5 md:px-16 lg:px-32'>
      <div className='flex gap-2'>
        <img src={Logo} alt='MenuHelp logo' className='w-15 h-15' />
        <div className='pt-4 pl-3.5 font-bold text-[19px] text-primary'>
          MenuHelp
        </div>
      </div>
      <div className='items-center gap-8 hidden sm:flex'>
        <ul className='flex gap-8'>
          <li>Menu</li>
          {/*  will need to later hide Allergies if no user log in */}
          <li>Allergies</li>
        </ul>
      </div>
      <div className='relative sm:hidden '>
        <CgProfile size={40} className='absolute top-3 right-8 text-primary' />
      </div>
    </nav>
  );
}

export default NavBar;
