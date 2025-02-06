import React from 'react';

function CreateEmployeeNotification({ employeeData }) {
  console.log(employeeData);
  return (
    <div className={`flex flex-row items-center justify-center flex-wrap`}>
      <p className='text-[#0DB14B] font-poppins'>
        {employeeData.identity} has been added
      </p>
      <img
        className='w-[48px]'
        src='https://res.cloudinary.com/dspxn4ees/image/upload/v1738836515/Check.svg'
        alt='check'
      />
    </div>
  );
}

export default CreateEmployeeNotification;
