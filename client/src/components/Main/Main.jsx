import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './../LoginPage/LoginPage.module.css';
import Mainstyles from './Main.module.css';
import '../../index.css';

function Main() {
  const customStyles = {
    form: styles.form,
    formContainer: styles['form-container'],
    formContainerTitle: styles['form-container__title'],
    formContainerForm: styles['form-container__form'],
    formContainerInput: styles['form-container__input'],
    formContainerResponse: styles['form-container__response'],
    welcome: styles['welcome'],
  };

  const {
    form,
    formContainer,
    formContainerTitle,
    formContainerForm,
    formContainerInput,
    formContainerResponse,
    welcome,
  } = customStyles;

  const bgStyles = {
    customBg: Mainstyles['custom-bg'],
  };

  const buttonStyles = {
    MainButton: styles['main-button'],
  };

  const { customBg } = bgStyles;

  const { MainButton } = buttonStyles;

  const navigate = useNavigate();

  const handleEnterManagerDashboard = (event) => {
    event.preventDefault();
    navigate('/login');
  };

  const handleEnterEmployeeView = (event) => {
    event.preventDefault();
    navigate('/menu');
  };

  return (
    <main
      className={`${customBg} w-full mt-[20px] flex flex-grow flex-col bg-gray-100`}
    >
      <span
        className={`${welcome}  mt-[20px] text-center text-lg text-[#492470] font-bold`}
      >
        Welcome back! 👋
      </span>
      <h2 className={`${formContainerTitle} text-[#492470] text-4xl font-bold`}>
        Weekly menu Home page
      </h2>
      <div className='buttons-container flex flex-col flex-wrap gap-10 bg-white min-w-[250px] p-10 my-[5%] mx-auto h-auto box-border w-1/2 min-h-[30vh] items-center justify-center'>
        <button
          onClick={handleEnterEmployeeView}
          type='button'
          className={`${MainButton}
          rounded-md
          bg-[#492470] 
          hover:bg-[#67369c] 
          p-[10px_50px]
          box-border
          border-none
          text-white
          uppercase
          xs:text-xl
          text-sm
          `}
        >
          Enter as an Employee
        </button>
        <button
          onClick={handleEnterManagerDashboard}
          type='button'
          className={`${MainButton}
          rounded-[6px]
          bg-white
          hover:bg-slate-200     
          p-[10px_50px]
          border-[#492470]
          box-border
          border-2
          border-solid
          text-[#492470]
          uppercase
          xs:text-xl
          text-sm
          `}
        >
          Enter as a Manager
        </button>
      </div>
    </main>
  );
}

export default Main;
