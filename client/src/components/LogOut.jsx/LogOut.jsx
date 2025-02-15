import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
  const navigate = useNavigate();

  function logoutUser() {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      navigate('/');
    } else {
      alert('You cannot log out if you are not logged in');
    }
  }

  return (
    <div className='hidden group-hover:flex group-focus:flex flex-col w-[320px]'>
      <button
        onClick={logoutUser}
        className='border-[1px] border-primary text-2xl h-[56px] bg-white'
      >
        Log Out
      </button>
    </div>
  );
};

export default LogOut;
