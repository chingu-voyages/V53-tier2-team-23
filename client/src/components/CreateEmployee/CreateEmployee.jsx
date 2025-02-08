import React from 'react';
import Select from 'react-select';
import { useState } from 'react';
import styles from './CreateEmployee.module.css';
import ViewEmployee from './../ViewEmployee/ViewEmployee';

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

function CreateEmployee() {
  const [identity, setIdentity] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    employeeName: '',
    allergies: [],
  });

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

  const handleIdentity = (event) => {
    setIdentity(event.target.value);
  };

  async function submitForm(event) {
    event.preventDefault();
    const data = await handleCreateEmployee(identity, selectedAllergies);
    setEmployeeData({
      employeeName: data.employeeName,
      allergies: data.allergies,
    });
    setFormSubmitted(true);
  }

  return (
    <>
      {formSubmitted ? (
        <ViewEmployee employeeData={employeeData} />
      ) : (
        <div className={`flex flex-col ${formContainer}`}>
          <h2 className={`${formContainerTitle} text-[#513174] font-bold`}>
            Add Collaborator Details
          </h2>
          <form
            onSubmit={submitForm}
            className={`${formContainerForm} shadow-md border-[#fdd053] px-4 py-4 border-4 rounded-[10px]`}
          >
            <h4 className='text-[#513174] font-semibold uppercase mt-4'>
              Identity
            </h4>
            <input
              onChange={handleIdentity}
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
              //defaultValue={allergiesList[0]}
              isMulti
              name='allergiesList'
              options={allergiesList}
              onChange={handleSelectAllergies}
              className='basic-multi-select'
              classNamePrefix='select'
              styles={selectStyles}
              getOptionLabel={(e) => getAllergyLabel(e.value)}
            />
            <div className='buttons-container flex flex-row m-0.5 flex-wrap'>
              <button
                type='submit'
                id='loginButton'
                type='submit'
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
      )}
    </>
  );
}

export default CreateEmployee;
