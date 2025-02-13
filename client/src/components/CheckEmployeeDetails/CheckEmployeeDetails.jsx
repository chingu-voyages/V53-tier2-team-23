import React from 'react';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './CheckEmployeeDetails.module.css';
import AddedAllergiesNotification from './../AddedAllergiesNotification/AddedAllergiesNotification';

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

const selectStyles = {
  control: (styles) => ({
    ...styles,
    borderColor: '#6b23a6',
    borderWidth: '2px',
    borderRadius: '5px',
    '&:hover': {
      borderColor: '#fdd053',
    },
    '&:focus': {
      borderColor: '#ff9900',
      boxShadow: '0 0 0 2px rgba(255, 153, 0, 0.3)',
    },
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    display: 'block',
    backgroundImage:
      'url("https://res.cloudinary.com/dspxn4ees/image/upload/v1738866259/chevrondown.svg")',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    padding: '8px',
    svg: {
      display: 'none',
    },
    width: '20px',
    height: '20px',
    margin: '0 10px',
    color: '#6b23a6',
    ':hover': {
      backgroundImage:
        'url("https://res.cloudinary.com/dspxn4ees/image/upload/v1738866259/chevrondown.svg")',
    },
  }),
};

function CheckEmployeeDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedEmployee = sessionStorage.getItem('employeeData');
  const storedOptionsState = sessionStorage.getItem('optionsState');
  const initialEmployeeData =
    location.state?.employeeData ||
    (storedEmployee ? JSON.parse(storedEmployee) : {});
  const initialOptionsState = storedOptionsState
    ? JSON.parse(storedOptionsState)
    : [];

  const [employeeData, setEmployeeData] = useState(initialEmployeeData);
  const [optionsState, setOptionsState] = useState(initialOptionsState);
  const [selectedAllergies, setSelectedAllergies] = useState(
    initialEmployeeData.allergies || []
  );
  // const employeeDataFromLocation = location.state?.employeeData || {};
  const { identity, allergies, employeeId } = initialEmployeeData;
  // const [employeeData, setEmployeeData] = useState(employeeDataFromLocation);
  // const [selectedAllergies, setSelectedAllergies] = useState(allergies || []);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const updateEmployeeAllergies = async (employeeId, changedAllergies) => {
    try {
      const response = await fetch(
        `https://eato-meatplanner.netlify.app/.netlify/functions/employees/allergies/${employeeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ allergies: changedAllergies }),
          mode: 'cors',
        }
      );

      const responseData = await response.json();
    } catch (error) {
      console.error('Error updating allergies:', error);
    }
  };

  async function handleSaveAllergies(event) {
    event.preventDefault();
    await updateEmployeeAllergies(employeeId, selectedAllergies);
    setFormSubmitted(true);
  }

  // // Update state when receiving new data
  // useEffect(() => {
  //   // Update employeeData and selectedAllergies when navigating back
  //   if (location.state?.employeeData) {
  //     setEmployeeData(location.state.employeeData);
  //     setSelectedAllergies(location.state.employeeData.allergies || []);
  //   }
  // }, [location.state?.employeeData]);
  useEffect(() => {
    // Update state with sessionStorage values on component mount if data exists
    const storedEmployeeData = sessionStorage.getItem('employeeData');
    const storedOptionsState = sessionStorage.getItem('optionsState');

    console.log(storedEmployeeData);

    if (storedEmployeeData) {
      setEmployeeData(JSON.parse(storedEmployeeData));
    }

    if (storedOptionsState) {
      setOptionsState(JSON.parse(storedOptionsState));
    }
  }, [location.state]); // Re-fetch from sessionStorage if location state changes

  const handleEditAllergies = () => {
    sessionStorage.setItem('clearSession', 'false');
    navigate('/manage-allergies', {
      state: {
        employeeData: { ...employeeData, allergies: selectedAllergies },
      },
    });
  };

  const allergenIconURL =
    'https://res.cloudinary.com/dspxn4ees/image/upload/v1738655655/';

  return (
    <div className={`flex flex-col justify-center ${formContainer}`}>
      <h1 className={`text-[#513174] font-bold`}>Check Employee Details</h1>
      <div className={`flex flex-col gap-10 justify-center ${formContainer}`}>
        <div
          className={`shadow-md border-[#fdd053] px-4 py-3 border-4 rounded-[10px]`}
        >
          <h2
            className={`${formContainerTitle} text-[#513174] font-bold uppercase`}
          >
            Employee Allergies Overview
          </h2>
          <div className='flex items-center gap-8'>
            <span className='pl-10 py-10'>
              <img
                className={profileIcon}
                src='https://res.cloudinary.com/dspxn4ees/image/upload/v1738656644/profil-icon.svg'
                alt='profile-icon'
              />
            </span>
            <h4 className='text-[#513174] font-semibold capitalize mt-4'>
              {identity}
            </h4>
          </div>
          <AddedAllergiesNotification
            allergies={employeeData.allergies || []} // Fallback to an empty array
          />
        </div>
        <div
          className={`shadow-md border-[#fdd053] px-4 py-3 border-4 rounded-[10px]`}
        >
          <form
            // onSubmit={handleSubmitEmployeeData}
            className={`${formContainerForm} px-4 py-4 rounded-[10px]`}
          >
            {formSubmitted ? (
              <div className={customStyles.formContainerResponse}>
                Employee allergies changed succesfully ✅
              </div>
            ) : (
              ''
            )}
            <div className='buttons-container flex flex-col m-0.5 flex-wrap'>
              <button
                type='submit'
                id='submitButton'
                onClick={handleSaveAllergies}
                className={`${formContainerButton}
                  w-fit
                  rounded-full
                  border-none
                  p-[10px_20px]
                  box-border
                  bg-yellow-400
                  hover:bg-purple-800
                  text-purple-800
                  hover:text-yellow-400
                  hover:outline-2
                  hover:outline-solid
                  hover:outline-purple-800
                  uppercase
                  font-bold
                  shadow-[0px_4px_4px_0px_#00000040]
                  `}
              >
                Save Changes
              </button>
              <button
                type='submit'
                id='submitButton'
                onClick={handleEditAllergies}
                className={`${formContainerButton}
                  w-fit
                  rounded-full
                  border-none
                  p-[10px_20px]
                  box-border
                  bg-white
                  hover:bg-purple-800
                  text-purple-800
                  hover:text-white
                  hover:outline-2
                  hover:outline-solid
                  hover:outline-purple-800
                  uppercase
                  font-bold
                  shadow-[0px_4px_4px_0px_#00000040]
                  `}
              >
                Edit Allergies
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckEmployeeDetails;
