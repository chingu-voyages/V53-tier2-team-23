import React from 'react';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ViewEmployee.module.css';
import CreateEmployeeNotification from './../CreateEmployeeNotification/CreateEmployeeNotification';

const customStyles = {
  profileIcon: styles['profile-icon'],
  allergyIcon: styles['allergy-icon'],
  form: styles.form,
  formContainerForm: styles['form-container__form'],
  formContainer: styles['form-container'],
  formContainerTitle: styles['form-container__title'],
  formContainerInput: styles['form-container__input'],
  formContainerButton: styles['form-container__button'],
  formContainerResponse: styles['form-container__response'],
};

const {
  form,
  formContainer,
  formContainerTitle,
  formContainerForm,
  formContainerInput,
  formContainerButton,
  formContainerResponse,
  profileIcon,
  allergyIcon,
} = customStyles;

function ViewEmployee() {
  const location = useLocation();
  const employeeData = location.state?.employeeData || {};
  const { identity, selectedAllergies } = employeeData;
  const [employeeName, setEmployeeName] = useState(identity);
  const [allergies, setAllergies] = useState(selectedAllergies || []);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (formSubmitted) {
      setTimeout(() => {
        setFormSubmitted(false);
        navigate('/management');
      }, 3000);
    }
  }, [formSubmitted]);

  async function handleCreateEmployee(identity, selectedAllergies) {
    const response = await fetch(
      'https://eato-meatplanner.netlify.app/.netlify/functions/employees',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeName: identity,
          allergies: selectedAllergies,
        }),
        mode: 'cors',
      }
    );

    const responseData = await response.json();
    return responseData.data;
  }

  async function handleSubmitEmployeeData(event) {
    event.preventDefault();
    const result = await handleCreateEmployee(employeeName, allergies);
    if (result) {
      setFormSubmitted(true);
    }
  }

  const allergenIconURL =
    'https://res.cloudinary.com/dspxn4ees/image/upload/v1738655655/';

  return (
    <div className={`flex flex-col ${formContainer}`}>
      <h1 className={`text-[#513174] font-bold`}>Check Collaborator Details</h1>
      <div
        className={`shadow-md border-[#fdd053] px-4 py-3 border-4 rounded-[10px]`}
      >
        <h2
          className={`${formContainerTitle} text-[#513174] font-bold uppercase`}
        >
          Collaborator Allergies Overview
        </h2>
        <div className='flex flex-wrap items-center gap-8'>
          <span className='pl-10 py-10'>
            <img
              className={profileIcon}
              src='https://res.cloudinary.com/dspxn4ees/image/upload/v1738656644/profil-icon.svg'
              alt='profile-icon'
            />
          </span>
          <h4 className='text-[#513174] font-semibold capitalize mt-4'>
            {employeeName}
          </h4>
        </div>
        {
          <ul className='flex mt-5 mb-24 gap-5 px-10'>
            {allergies.map((allergy, index) => (
              <li className='flex flex-wrap gap-2' key={index}>
                <span>
                  <img
                    className={allergyIcon}
                    src={`${allergenIconURL}${allergy.replace(' ', '_')}.svg`}
                    alt={allergy}
                  />
                </span>
                <span>{allergy}</span>
              </li>
            ))}
          </ul>
        }
        <form
          onSubmit={handleSubmitEmployeeData}
          className={`${formContainerForm} px-4 py-4 rounded-[10px]`}
        >
          {formSubmitted ? (
            <CreateEmployeeNotification employeeData={employeeData} />
          ) : (
            <div className='buttons-container flex flex-col m-0.5 flex-wrap'>
              <button
                type='submit'
                id='submitButton'
                className={`${formContainerButton}
                w-fit
                rounded-full
                border-none
                p-[10px_20px]
                box-border
                bg-yellow-400
                hover:bg-white
                text-purple-800
                hover:border-2
                hover:border-solid
                hover:border-purple-800
                uppercase
                font-bold
                shadow-md
                `}
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ViewEmployee;
