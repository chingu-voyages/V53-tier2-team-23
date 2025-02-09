import React from 'react';

function generateAllergyMessage(allergies) {
  if (allergies.length === 0) {
    return `no allergies have been added`;
  } else if (allergies.length === 1) {
    return `${allergies} has been added`;
  } else if (allergies.length > 1) {
    const lastAllergyRemovedArray = allergies.slice(0, -1);
    const lastAllergyIndex = allergies[allergies.length - 1];

    const lastAllergyRemovedList = lastAllergyRemovedArray
      .map((allergy) => (typeof allergy === 'object' ? allergy.value : allergy))
      .join(', ');

    const lastAllergy =
      typeof lastAllergyIndex === 'object'
        ? lastAllergyIndex.value
        : lastAllergyIndex;
    return `${lastAllergyRemovedList} and ${lastAllergy} have been added`;
  }
  return '';
}

function AddedAllergiesNotification({ allergies }) {
  const addedAllergies = generateAllergyMessage(allergies);

  return (
    <div className='flex flex-row items-center justify-center flex-wrap'>
      <p className='text-[#0DB14B] font-poppins'>{addedAllergies}</p>
      <img
        className='w-[48px]'
        src='https://res.cloudinary.com/dspxn4ees/image/upload/v1738836515/Check.svg'
        alt='check'
      />
    </div>
  );
}

export default AddedAllergiesNotification;
