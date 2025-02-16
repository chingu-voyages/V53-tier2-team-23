import React from 'react';
import PropTypes from 'prop-types';

const MenuSection = ({ onGenerate, onView }) => {
  return (
    <div className='hidden group-hover:flex group-focus:flex flex-col w-[320px]'>
      <button
        onClick={onGenerate}
        className='border-[1px] border-primary text-2xl h-[56px] bg-white'
      >
        Generate Menus
      </button>
      <button
        onClick={onView}
        className='border-[1px] border-primary text-2xl h-[56px] bg-white'
      >
        View Menus
      </button>
    </div>
  );
};

MenuSection.propTypes = {
  onGenerate: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default MenuSection;
