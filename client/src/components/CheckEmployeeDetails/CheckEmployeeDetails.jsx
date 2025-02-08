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
      <span className='allergypart1 text-[#513174] font-semibold'>{part1}</span>
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

async function handleSaveEmployeeAllergies(event) {
  event.preventDefault();
  const newEmployee = {
    identity,
    selectedAllergies,
  };
  setEmployeeData(newEmployee);
}

function CheckEmployeeDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeData = location.state?.employeeData || {};
  const { identity } = employeeData;

  const [employeeName, setEmployeeName] = useState('Sebastian King');

  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [allergies, setAllergies] = useState([]);
  // chosen employee allergies
  const [chosenEmployeeAllergiesList, setChosenEmployeeAllergiesList] =
    useState([]);
  const [defaultAllergiesList, setDefaultAllergiesList] = useState([]);
  const [defaultAllergiesListIndeces, setDefaultAllergiesListIndeces] =
    useState([]);
  const [optionsState, setOptionsState] = useState([]);

  const [defaultOptions, setDefaultOptions] = useState([]);
  // const [viewEditAllergies, setViewEditAllergies] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const chosenEmployee = await getEmployeeByName(employeeName);
        if (chosenEmployee && chosenEmployee.employee) {
          setChosenEmployeeAllergiesList(chosenEmployee.employee.allergies);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    if (employeeName) {
      fetchEmployeeData();
    }
  }, [employeeName]);

  //navigate('/manage-allergies');

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

  const updateEmployeeAllergies = async (employeeId, changedAllergies) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}/allergies`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ allergies: changedAllergies }),
      });

      const responseData = await response.json();
    } catch (error) {
      console.error('Error updating allergies:', error);
    }
  };

  // get default allergies
  const getDefaultEmployeeAllergies = (
    allergiesList,
    chosenEmployeeAllergiesList
  ) => {
    return allergiesList.filter((allergy) =>
      chosenEmployeeAllergiesList.includes(allergy.value)
    );
  };

  useEffect(() => {
    setAllergies(chosenEmployeeAllergiesList);
    const updatedDefaultAllergies = getDefaultEmployeeAllergies(
      allergiesList,
      chosenEmployeeAllergiesList
    );
    setDefaultAllergiesList(updatedDefaultAllergies);
    setSelectedAllergies(defaultAllergiesList);
  }, [chosenEmployeeAllergiesList]);

  useEffect(() => {
    if (chosenEmployeeAllergiesList.length > 0 && allergiesList.length > 0) {
      const getDefaultAllergiesListIndeces = allergiesList
        .map((allergy, index) => {
          const isMatch = chosenEmployeeAllergiesList.includes(allergy.value);
          return isMatch ? index : -1;
        })
        .filter((index) => index !== -1);
      setDefaultAllergiesListIndeces(getDefaultAllergiesListIndeces);
    } else {
    }
  }, [chosenEmployeeAllergiesList, allergiesList]);

  useEffect(() => {
    if (defaultAllergiesListIndeces.length > 0) {
      const updatedState = new Array(14).fill(false);
      defaultAllergiesListIndeces.forEach((index) => {
        updatedState[index] = true;
      });
      setOptionsState(updatedState);
    }
  }, [defaultAllergiesListIndeces]);

  // preselected options based on optionsState
  const getPreselectedOptions = () => {
    return optionsState
      .map((isSelected, index) => (isSelected ? allergiesList[index] : null))
      .filter(Boolean);
  };

  async function handleEditAllergiesPage(event) {
    event.preventDefault();
    await updateEmployeeAllergies(employeeId, selectedAllergies);
    setFormSubmitted(true);
  }

  const handleSelectAllergies = (select) => {
    // find selected allergies
    const selectedAllergies = select
      ? select.map((option) => option.value)
      : [];

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

  const allergenIconURL =
    'https://res.cloudinary.com/dspxn4ees/image/upload/v1738655655/';

  if (optionsState.length > 0) {
    return (
      <div className={`flex flex-col justify-center ${formContainer}`}>
        <h1 className={`text-[#513174] font-bold`}>
          Check Collaborator Details
        </h1>
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
              <h2
                className={`${formContainerTitle} text-[#513174] font-bold text-xl uppercase font-shantell`}
              >
                Manage Allergies
              </h2>
              <div className='buttons-container flex flex-col m-0.5 flex-wrap'>
                <h4 className='text-[#513174] font-semibold uppercase mt-4'>
                  Allergies
                </h4>
                <Select
                  defaultValue={getPreselectedOptions()}
                  isMulti
                  name='allergiesList'
                  options={allergiesList}
                  onChange={handleSelectAllergies}
                  className='basic-multi-select'
                  classNamePrefix='select'
                  styles={selectStyles}
                  getOptionLabel={(e) => getAllergyLabel(e.value)}
                  // getOptionLabel={(e) => e.value}
                />
                <button
                  type='submit'
                  id='submitButton'
                  // onClick={handleGetEmployeeByName}
                  className={`${formContainerButton}
            w-fit
            rounded-full
            border-none
            p-[10px_20px]
            box-border
            bg-yellow-400
            hover:bg-white
            text-purple-800
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
                  // onClick={handleGetEmployeeByName}
                  className={`${formContainerButton}
            w-fit
            rounded-full
            border-none
            p-[10px_20px]
            box-border
            bg-yellow-400
            hover:bg-white
            text-purple-800
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
}

export default CheckEmployeeDetails;
