import React from 'react';
import Select from 'react-select';
import { useState } from 'react';
import styles from './ViewEmployee.module.css';

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

function ViewEmployee({ employeeData }) {
  const { employeeName, allergies = [] } = employeeData;
  return (
    <div className={`flex flex-col ${formContainer}`}>
      <h2 className={`${formContainerTitle} text-[#513174] font-bold`}>
        Check Collaborator Details
      </h2>
      <div
        className={`${formContainerForm} shadow-md border-[#fdd053] px-4 py-4 border-4 rounded-[10px]`}
      >
        <h4 className='text-[#513174] font-semibold uppercase mt-4'>
          {employeeName}
        </h4>
        <h4 className='text-[#513174] font-semibold uppercase mt-4'>
          Allergies
        </h4>
        {
          <ul>
            {allergies.map((allergy, index) => (
              <li key={index}>{getAllergyLabel(allergy)}</li>
            ))}
          </ul>
        }
      </div>
    </div>
  );
}

export default ViewEmployee;
