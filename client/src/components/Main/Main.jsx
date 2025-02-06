import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './../LoginPage/LoginPage.module.css';
import '../../index.css';

function Main() {
  const customStyles = {
    form: styles.form,
    formContainer: styles['form-container'],
    formContainerTitle: styles['form-container__title'],
    formContainerForm: styles['form-container__form'],
    formContainerInput: styles['form-container__input'],
    formContainerButton: styles['form-container__button'],
    formContainerResponse: styles['form-container__response'],
    welcome: styles['welcome'],
  };

  const {
    form,
    formContainer,
    formContainerTitle,
    formContainerForm,
    formContainerInput,
    formContainerButton,
    formContainerResponse,
    welcome,
  } = customStyles;

  const navigate = useNavigate();

  const handleEnterManagerDashboard = (event) => {
    event.preventDefault();
    navigate('/login');
  };

  return (
    <main className='flex flex-grow flex-col bg-gray-100'>
      <button
        onClick={handleEnterManagerDashboard}
        id='loginButton'
        type='button'
        className={`${formContainerButton}
          rounded-md
          hover:border-yellow-300
          p-[10px_20px]
          box-border
          border-yellow-400
          bg-white
          text-black
          border-4
          border-solid
          uppercase
          `}
      >
        Go to Manager Dashboard
      </button>
      <div className='h-[872px] md:h-[990px] lg:h-[907px] bg-gray-200 rounded-md flex items-center justify-center'>
        <p className='text-lg text-gray-600'>Placeholder Content</p>
      </div>
    </main>
  );
}

export default Main;
