import React, { useState } from 'react';
import AlertPopUp from '../AlertPopUp/AlertPopUp';
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
  const [showAlert, setShowAlert] = useState({ message: '', status: false });
  const navigate = useNavigate();

  function logoutUser() {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      navigate('/');
    } else {
      setShowAlert({
        message: 'You cannot log out if you are not logged in',
        status: true,
      });
    }
  }

  return (
    <>
      <div className='flex flex-col w-[200px] md:w-[320px]'>
        <button
          onClick={logoutUser}
          className='border-[1px] border-primary text-2xl h-[56px] bg-white'
        >
          Log Out
        </button>
      </div>
      {showAlert.status && (
        <AlertPopUp setShowAlert={setShowAlert} showAlert={showAlert} />
      )}
    </>
  );
};

export default LogOut;
