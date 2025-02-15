import React from 'react';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ManageAllergies.module.css';
import AlertPopUp from './../AlertPopUp/AlertPopUp';

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
  control: (styles, { selectProps }) => {
    const constrolHasOptionDisabled = selectProps.value?.some(
      (option) => option.isDisabled
    );
    return {
      ...styles,
      filter: constrolHasOptionDisabled ? 'blur(2px)' : 'none',
      backgroundColor: constrolHasOptionDisabled ? '#facc15' : 'white',
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
    };
  },
  option: (styles, { isDisabled }) => ({
    ...styles,
    filter: isDisabled ? 'blur(2px)' : 'none',
    backgroundColor: isDisabled ? '#facc15' : 'white',
    color: isDisabled ? 'lightgray' : 'green',
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

function ManageAllergies() {
  const navigate = useNavigate();
  const location = useLocation();

  const [allergiesList, setAllergiesList] = useState([
    { value: 'no allergies', label: 'no allergies', isdisabled: false },
    { value: 'gluten', label: 'Gluten', isdisabled: false },
    { value: 'dairy', label: 'Dairy', isdisabled: false },
    { value: 'egg', label: 'Egg', isdisabled: false },
    { value: 'seafood', label: 'Seafood', isdisabled: false },
    { value: 'soy', label: 'Soy', isdisabled: false },
    { value: 'tree nuts', label: 'Tree Nuts', isdisabled: false },
    { value: 'peanuts', label: 'Peanuts', isdisabled: false },
    { value: 'legumes', label: 'Legumes', isdisabled: false },
    { value: 'sesame seeds', label: 'Sesame Seeds', isdisabled: false },
    { value: 'corn', label: 'Corn', isdisabled: false },
    { value: 'mustard', label: 'Mustard', isdisabled: false },
    { value: 'allium', label: 'Allium', isdisabled: false },
    { value: 'coconut', label: 'Coconut', isdisabled: false },
    { value: 'fruits', label: 'Fruits', isdisabled: false },
  ]);

  const clearSession = sessionStorage.getItem('clearSession') === 'true';

  if (clearSession) {
    sessionStorage.removeItem('employeeData');
    sessionStorage.removeItem('optionsState');
    sessionStorage.setItem('clearSession', 'false'); // Reset flag after clearing
  }

  // Check sessionStorage for existing employee data
  const storedEmployeeData = sessionStorage.getItem('employeeData');
  const storedOptionsState = sessionStorage.getItem('optionsState');
  const initialEmployeeData =
    location.state?.employeeData ||
    (storedEmployeeData ? JSON.parse(storedEmployeeData) : {});
  const initialOptionsState = storedOptionsState
    ? JSON.parse(storedOptionsState)
    : [];

  const employeeDataFromLocation = initialEmployeeData;
  const { identity } = employeeDataFromLocation;
  const [employeeId, setEmployeeId] = useState('');
  const [employeeData, setEmployeeData] = useState(employeeDataFromLocation);

  const [employeeName, setEmployeeName] = useState(identity);

  const [selectedAllergies, setSelectedAllergies] = useState(
    employeeData.allergies || []
  );
  const [allergies, setAllergies] = useState([]);
  // chosen employee allergies
  const [chosenEmployeeAllergiesList, setChosenEmployeeAllergiesList] =
    useState([]);
  const [defaultAllergiesList, setDefaultAllergiesList] = useState([]);
  const [defaultAllergiesListIndeces, setDefaultAllergiesListIndeces] =
    useState([]);
  const [optionsState, setOptionsState] = useState(initialOptionsState || []);

  const [defaultOptions, setDefaultOptions] = useState([]);
  const [isLoadedAllergies, setIsLoadedAllergies] = useState(true);

  const isAnyAllergySelected = optionsState.some((value) => value === true);
  const isNoAllergiesSelected =
    chosenEmployeeAllergiesList.length === 1 &&
    chosenEmployeeAllergiesList[0] === 'no allergies';

  const [showAlert, setShowAlert] = useState({ message: '', status: false });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const chosenEmployee = await getEmployeeByName(employeeName);
        if (chosenEmployee && chosenEmployee.employee) {
          setEmployeeId(chosenEmployee.employeeId);
          if (chosenEmployee.employee.allergies.length > 0) {
            setChosenEmployeeAllergiesList(chosenEmployee.employee.allergies);
          }
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    if (employeeName) {
      fetchEmployeeData();
    }
  }, [employeeName]);

  async function handleSaveEmployeeAllergies(event) {
    event.preventDefault();

    setEmployeeData((prevData) => ({
      ...prevData,
      identity,
      allergies: selectedAllergies,
    }));

    setTimeout(() => {
      handleViewEmployee();
    }, 100);
  }

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
    }
  }, [chosenEmployeeAllergiesList, allergiesList]);

  useEffect(() => {
    if (defaultAllergiesListIndeces.length === 0) {
      setOptionsState([]);
      //setIsLoadedNoAllergies(true);
    } else if (defaultAllergiesListIndeces.length > 0) {
      const updatedState = new Array(14).fill(false);
      defaultAllergiesListIndeces.forEach((index) => {
        updatedState[index] = true;
      });
      setOptionsState(updatedState);

      setIsLoadedAllergies(true);
    }
  }, [defaultAllergiesListIndeces, allergiesList]);

  // Ensure the component is updated when sessionStorage data changes or location state updates
  useEffect(() => {
    const clearSession = sessionStorage.getItem('clearSession') === 'true';

    if (clearSession) {
      sessionStorage.removeItem('employeeData');
      sessionStorage.removeItem('optionsState');
      sessionStorage.setItem('clearSession', 'false'); // Reset flag after clearing
    }
    if (!isLoadedAllergies) return;

    const storedEmployeeData = sessionStorage.getItem('employeeData');
    const storedOptionsState = sessionStorage.getItem('optionsState');

    if (storedEmployeeData) {
      setEmployeeData(JSON.parse(storedEmployeeData));
      setSelectedAllergies(JSON.parse(storedEmployeeData).allergies || []);
    }
    if (storedOptionsState) {
      setOptionsState(JSON.parse(storedOptionsState));
    }
  }, [location.state, isLoadedAllergies]);

  const handleViewEmployee = () => {
    if (selectedAllergies.length === 0) {
      setShowAlert({
        message:
          "Please select either no allergies if the employee doesn't have any allergies or one + multiple allergies.",
        status: true,
      });
      return;
    } else if (
      selectedAllergies.includes('no allergies') &&
      selectedAllergies.length > 1
    ) {
      setShowAlert({
        message:
          "Please select only no allergies if the employee doesn't have any allergies or any valid allergies from the list, not both.",
        status: true,
      });
      return;
    } else {
      setShowAlert({ message: '', status: false });
    }

    sessionStorage.setItem('clearSession', 'false');
    const employeeData = {
      employeeId,
      identity,
      allergies: selectedAllergies,
    };

    sessionStorage.setItem('employeeData', JSON.stringify(employeeData));
    sessionStorage.setItem('optionsState', JSON.stringify(optionsState));

    navigate('/check-employee-details', {
      state: {
        employeeData: employeeData,
        optionsState: optionsState,
      },
    });
  };

  // preselected options based on optionsState
  const getPreselectedOptions = () => {
    return optionsState
      .map((isSelected, index) => (isSelected ? allergiesList[index] : null))
      .filter(Boolean);
  };

  const handleSelectAllergies = (select) => {
    const selectedAllergies = select
      ? select.map((option) => option.value)
      : [];

    setSelectedAllergies((prev) => {
      const allergiesSelected = prev.filter((allergy) =>
        selectedAllergies.includes(allergy)
      );

      const allergiesNotSelected = selectedAllergies.filter(
        (allergy) => !prev.includes(allergy)
      );

      const allSelectedAllergies = [
        ...allergiesSelected,
        ...allergiesNotSelected,
      ];

      const updatedAllergiesList = allergiesList.map((allergy) => {
        if (selectedAllergies.includes('no allergies')) {
          return {
            ...allergy,
            isdisabled: allergy.value !== 'no allergies',
          };
        } else if (selectedAllergies.length === 0) {
          return {
            ...allergy,
            isdisabled: false,
          };
        } else {
          return {
            ...allergy,
            isdisabled: allergy.value === 'no allergies',
          };
        }
      });

      setAllergiesList(updatedAllergiesList);

      return allSelectedAllergies;
    });
  };

  const allergenIconURL =
    'https://res.cloudinary.com/dspxn4ees/image/upload/v1738655655/';

  if (optionsState.length > 0 && isAnyAllergySelected) {
    return (
      // {optionsState.some((value) => value === true) ? (
      <div className={`flex flex-col justify-center ${formContainer}`}>
        {showAlert.status && (
          <AlertPopUp setShowAlert={setShowAlert} showAlert={showAlert} />
        )}
        <h1 className={`text-[#513174] font-bold`}>
          Check Employee Details (
          {isNoAllergiesSelected ? 'no allergies' : 'with allergies'})
        </h1>
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
            <form className={`${formContainerForm} px-4 py-4 rounded-[10px]`}>
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
                  isOptionDisabled={(option) => option.isdisabled}
                  name='allergiesList'
                  options={allergiesList}
                  onChange={handleSelectAllergies}
                  className='basic-multi-select'
                  classNamePrefix='select'
                  styles={selectStyles}
                  getOptionLabel={(e) => getAllergyLabel(e.value, e.isdisabled)}
                />
                <button
                  type='submit'
                  id='submitButton'
                  onClick={handleSaveEmployeeAllergies}
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
                  Preview Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageAllergies;
