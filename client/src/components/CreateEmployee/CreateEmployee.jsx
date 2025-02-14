import React from 'react';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateEmployee.module.css';
import ViewEmployee from './../ViewEmployee/ViewEmployee';
import AlertPopUp from './../AlertPopUp/AlertPopUp';

const customStyles = {
  form: styles.form,
  formContainer: styles['form-container'],
  formContainerTitle: styles['form-container__title'],
  formContainerForm: styles['form-container__form'],
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
} = customStyles;

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

function CreateEmployee() {
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
  const [identity, setIdentity] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [previewChanges, setPreviewChanges] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [showAlert, setShowAlert] = useState({ message: '', status: false });

  const navigate = useNavigate();

  useEffect(() => {
    if (previewChanges) {
      navigate('/view-employee', {
        state: { employeeData },
      });
    }
  }, [employeeData, previewChanges]);

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

  const handleSaveIdentity = (event) => {
    setIdentity(event.target.value);
  };

  async function handleSaveNewEmployee(event) {
    event.preventDefault();
    const newEmployee = {
      identity,
      selectedAllergies,
    };
    setEmployeeData(newEmployee);
  }

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

    const employeeData = {
      identity,
      allergies: selectedAllergies,
    };

    setPreviewChanges(true);
  };

  return (
    <div className={`flex flex-col ${formContainer}`}>
      {showAlert.status && (
        <AlertPopUp setShowAlert={setShowAlert} showAlert={showAlert} />
      )}
      <h2 className={`${formContainerTitle} text-[#513174] font-bold`}>
        Add Employee Details
      </h2>
      <form
        onSubmit={handleSaveNewEmployee}
        className={`${formContainerForm} shadow-md border-[#fdd053] px-4 py-4 border-4 rounded-[10px]`}
      >
        <h4 className='text-[#513174] font-semibold uppercase mt-4'>
          Identity
        </h4>
        <input
          onChange={handleSaveIdentity}
          type='text'
          id='identity'
          value={identity}
          className={`${formContainerInput} border-[#513174] border-2 rounded-[4px]`}
          placeholder='John Doe'
          required
        />
        <h4 className='text-[#513174] font-semibold uppercase mt-4'>
          Allergies
        </h4>
        <Select
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
        <div className='buttons-container flex flex-row m-0.5 flex-wrap'>
          <button
            onClick={handleViewEmployee}
            id='loginButton'
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
            Preview Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEmployee;
