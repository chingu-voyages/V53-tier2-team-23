import React from 'react';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ManageAllergies.module.css';

const allergiesList = [
  { value: 'gluten', label: 'Gluten' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'egg', label: 'Egg' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'soy', label: 'Soy' },
  { value: 'tree nuts', label: 'Tree Nuts' },
  { value: 'peanuts', label: 'Peanuts' },
  { value: 'legumes', label: 'Legumes' },
  { value: 'sesame seeds', label: 'Sesame Seeds' },
  { value: 'corn', label: 'Corn' },
  { value: 'mustard', label: 'Mustard' },
  { value: 'allium', label: 'Allium' },
  { value: 'coconut', label: 'Coconut' },
  { value: 'fruits', label: 'Fruits' },
];

const getAllergyLabel = (allergy) => {
  const part1 = allergy.substring(0, 3);
  const part2 = allergy.substring(3);
  return (
    <>
      <span className='allergypart1 text-[#513174]'>{part1}</span>
      <span className='allergypart2 text-gray-500'>{part2}</span>
    </>
  );
};

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
    color: '#6b23a6',
    ':hover': {
      color: '#fdd053',
    },
  }),
};

const handleSelectAllergies = (select) => {
  // find selected allergies
  const selectedAllergies = select.map((option) => option.value);

  setSelectedAllergies((prev) => {
    // find previous selected allergies
    const allergiesSelected = prev.filter((allergy) =>
      selectedAllergies.includes(allergy)
    );
    // find new selected allergies
    const allergiesNotSelected = selectedAllergies.filter(
      (allergy) => !prev.includes(allergy)
    );

    const allSelectedAllergies = [
      ...allergiesSelected,
      ...allergiesNotSelected,
    ];
    return allSelectedAllergies;
  });
};

async function handleSaveEmployeeAllergies(event) {
  event.preventDefault();
  const newEmployee = {
    identity,
    selectedAllergies,
  };
  setEmployeeData(newEmployee);
}

function ManageAllergies() {
  const [identity, setIdentity] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [employeeName, setEmployeeName] = useState('Grace Robinson');
  const [allergies, setAllergies] = useState([]);
  // const [viewEditAllergies, setViewEditAllergies] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeData } = location.state || {};

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const chosenEmployee = await getEmployeeByName(employeeName);
        const chosenEmployeeAllergiesList = chosenEmployee.employee.allergies;
        if (chosenEmployee) {
          setAllergies(chosenEmployeeAllergiesList);
          console.log(chosenEmployeeAllergiesList);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    if (employeeName) {
      fetchEmployeeData();
    }
  }, [employeeName]);

  //navigate('/create-employee')

  async function getEmployeeByName(identity) {
    const response = await fetch(
      `https://eato-meatplanner.netlify.app/.netlify/functions/employees/${identity}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      }
    );

    const responseData = await response.json();
    return responseData.data;
  }

  async function handleGetEmployeeByName(event) {
    event.preventDefault();
  }

  // async function handleEditAllergiesPage(event) {
  //   event.preventDefault();
  //   await handleCreateEmployee(employeeName, allergies);
  //   setFormSubmitted(true);
  // }

  const allergenIconURL =
    'https://res.cloudinary.com/dspxn4ees/image/upload/v1738655655/';

  return (
    <div className={`flex flex-col justify-center ${formContainer}`}>
      <h1 className={`text-[#513174] font-bold`}>Check Collaborator Details</h1>
      <div className={`flex flex-col gap-10 justify-center ${formContainer}`}>
        <div
          className={`shadow-md border-[#fdd053] px-4 py-3 border-4 rounded-[10px]`}
        >
          <h2
            className={`${formContainerTitle} text-[#513174] font-bold uppercase`}
          >
            Collaborator Allergies Overview
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
              {employeeName}
            </h4>
          </div>
          {
            <ul className='flex flex-col mb-14 gap-5 px-10'>
              {allergies &&
                allergies.map((allergy, index) => (
                  <li className='flex flex-wrap gap-2' key={index}>
                    <span>
                      <img
                        className={allergyIcon}
                        src={`${allergenIconURL}${allergy.replace(
                          ' ',
                          '_'
                        )}.svg`}
                        alt={allergy}
                      />
                    </span>
                    <span>{allergy}</span>
                  </li>
                ))}
            </ul>
          }
        </div>
        <div
          className={`shadow-md border-[#fdd053] px-4 py-3 border-4 rounded-[10px]`}
        >
          <form
            // onSubmit={handleSubmitEmployeeData}
            className={`${formContainerForm} px-4 py-4 rounded-[10px]`}
          >
            <div className='buttons-container flex flex-col m-0.5 flex-wrap'>
              <button
                type='submit'
                id='submitButton'
                onClick={handleGetEmployeeByName}
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
              <button
                id='editAllergiesButton'
                // onClick={handleGetEmployeeByName}
                className={`${formContainerButton}
            w-fit
            rounded-full
            hover:border-none
            p-[10px_20px]
            box-border
            hover:bg-yellow-400
            bg-white
            text-purple-800
            border-2
            border-solid
            border-purple-800
            uppercase
            font-bold
            shadow-md
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

export default ManageAllergies;
