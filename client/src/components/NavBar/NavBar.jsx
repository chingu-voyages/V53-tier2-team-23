import React from 'react';
import { CgProfile } from 'react-icons/cg'; // placeholder for profile icon

function NavBar() {
  return (
    <nav className='flex gap-16 justify-between p-4 md:px-16 lg:px-32'>
      <div className='flex gap-2'>
        <img
          src='https://fakeimg.pl/40x40/cccccc/909090'
          alt='logo placeholder'
        />
        <div className='pt-2'>Eato</div>
      </div>
      <div className='items-center gap-8 hidden sm:flex'>
        <ul className='flex gap-8'>
          <li>Menu</li>
          {/*  will need to later hide Allergies if no user log in */}
          <li>Allergies</li>
        </ul>
      </div>
      <div className='flex sm:hidden'>
        <CgProfile size={40} />
      </div>
    </nav>
  );
}

export default NavBar;
