import React from 'react';
import Select from 'react-select';
import { useState } from 'react';
import styles from './ViewEmployee.module.css';

const customStyles = {
  profileIcon: styles['profile-icon'],
  allergyIcon: styles['allergy-icon'],
  form: styles.form,
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

function ViewEmployee({ employeeData }) {
  const { employeeName, allergies = [] } = employeeData;
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
        <div className='buttons-container flex flex-col m-0.5 flex-wrap'>
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
            Save Changes
          </button>
          <button
            type='submit'
            id='loginButton'
            type='submit'
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
      </div>
    </div>
  );
}

export default ViewEmployee;
