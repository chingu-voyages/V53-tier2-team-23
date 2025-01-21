const submitButton = document.querySelector('#submitButton');
const responseContainer = document.querySelector('.form-container__response');
const form = document.querySelector('.form');

async function getDataFromLocalStorage() {
  const localData = localStorage.getItem('employeeData');
  return localData ? JSON.parse(localData) : null; // parse data
}

async function getEmployeesDataFromLocalStorage() {
  const localEmployeesData = localStorage.getItem('employeesData');
  return localEmployeesData ? JSON.parse(localEmployeesData) : null; // parse data
}

async function getAllEmployees() {
  const URL = `https://eatodishes.netlify.app/.netlify/functions/employees`;
  try {
    const response = await fetch(URL, {
      method: 'GET',
    });

    // check response success
    if (!response.ok) {
      throw new Error(`Failed to fetch employee data: ${response.status}`);
    }

    const responseData = await response.json();

    const employeesData = responseData.data.employees;

    console.log('employeesData: ', employeesData);

    localStorage.setItem('employeesData', JSON.stringify(employeesData));
    return employeesData;
  } catch (error) {
    console.error('Error fetching employee:', error);
    // Return null
    return null;
  }
}

async function getEmployees(employeesData) {
  let index = 0;
  for (const employee of employeesData) {
    let employeeIndex = employeesData.findIndex(
      (index) => index._id == employee._id
    );
    const { _id, employeeName, allergies, dietaryRestrictions } = employee;
    await viewEmployee(
      index + 1,
      employeeIndex,
      _id,
      employeeName,
      allergies,
      dietaryRestrictions
    );
    index++;
  }
}

async function handleGetEmployeesData() {
  try {
    responseContainer.innerHTML = 'loading...';
    const employeesData = await getAllEmployees();
    const localEmployeesData = await getEmployeesDataFromLocalStorage();
    if (employeesData & !localEmployeeDatas) {
      responseContainer.innerHTML = '';

      await getEmployees(employeesData);
    } else if (localEmployeeData && employeeData) {
      if (
        localEmployeeData._id === _id &&
        localEmployeeData.employeeName === employeeName
      ) {
        responseContainer.innerHTML = '';
        await getEmployees(employeesData);
      } else {
        console.log('The data is different');
        responseContainer.textContent = 'Employee data has changed.';
      }
    } else {
      responseContainer.textContent = 'No user';
      console.log('No user');
      localStorage.removeItem('employeeData');
    }
  } catch (error) {
    responseContainer.textContent = `Error:  ${error} , getting employee:`;
    console.error(`Error:  ${error} , getting employee:`);
  }
}

async function handleGetEmployeeData(employeeId) {
  try {
    responseContainer.innerHTML = 'loading...';
    const employeeData = await getEmployee(employeeId);
    console.log('handleGetEmployeeData: ', employeeData);
    const localEmployeeData = await getDataFromLocalStorage();
    console.log('localEmployeeData: ', localEmployeeData);
    const { _id, employeeName, allergies, dietaryRestrictions } = employeeData;
    console.log(
      localEmployeeData._id,
      _id,
      localEmployeeData.employeeName,
      employeeName
    );
    if (employeeData & !localEmployeeData) {
      responseContainer.innerHTML = '';
      await viewEmployee(_id, employeeName, allergies, dietaryRestrictions);
    } else if (localEmployeeData && employeeData) {
      if (
        localEmployeeData._id === _id &&
        localEmployeeData.employeeName === employeeName
      ) {
        responseContainer.innerHTML = '';
        await viewEmployee(_id, employeeName, allergies, dietaryRestrictions);
        //responseContainer.textContent = `${JSON.stringify(localEmployeeData)}`;
      } else {
        console.log('The data is different');
        responseContainer.textContent = 'Employee data has changed.';
      }
    } else {
      responseContainer.textContent = 'No user';
      console.log('No user');
      localStorage.removeItem('employeeData');
    }
  } catch (error) {
    responseContainer.textContent = `Error:  ${error} , getting employee:`;
    console.error(`Error:  ${error} , getting employee:`);
  }
}

async function getEmployee(employeeId) {
  const URL = `https://eatodishes.netlify.app/.netlify/functions/employees/${employeeId}/dishes`;
  try {
    const response = await fetch(URL, {
      method: 'GET',
    });

    // check response success
    if (!response.ok) {
      throw new Error(`Failed to fetch employee data: ${response.status}`);
    }

    const responseData = await response.json();

    const employeeData = responseData.data.employee;

    console.log('employeeData: ', employeeData);

    localStorage.setItem('employeeData', JSON.stringify(employeeData));
    return employeeData;
  } catch (error) {
    console.error('Error fetching employee:', error);
    // Return null
    return null;
  }
}

async function handleGetEmployeeData(employeeId) {
  try {
    responseContainer.innerHTML = 'loading...';
    const employeeData = await getEmployee(employeeId);
    console.log('handleGetEmployeeData: ', employeeData);
    const localEmployeeData = await getDataFromLocalStorage();
    console.log('localEmployeeData: ', localEmployeeData);
    const { _id, employeeName, allergies, dietaryRestrictions } = employeeData;
    console.log(
      localEmployeeData._id,
      _id,
      localEmployeeData.employeeName,
      employeeName
    );
    if (employeeData & !localEmployeeData) {
      responseContainer.innerHTML = '';
      await viewEmployee(_id, employeeName, allergies, dietaryRestrictions);
    } else if (localEmployeeData && employeeData) {
      if (
        localEmployeeData._id === _id &&
        localEmployeeData.employeeName === employeeName
      ) {
        responseContainer.innerHTML = '';
        await viewEmployee(_id, employeeName, allergies, dietaryRestrictions);
        //responseContainer.textContent = `${JSON.stringify(localEmployeeData)}`;
      } else {
        console.log('The data is different');
        responseContainer.textContent = 'Employee data has changed.';
      }
    } else {
      responseContainer.textContent = 'No user';
      console.log('No user');
      localStorage.removeItem('employeeData');
    }
  } catch (error) {
    responseContainer.textContent = `Error:  ${error} , getting employee:`;
    console.error(`Error:  ${error} , getting employee:`);
  }
}

async function viewEmployee(
  index = null,
  employeeIndex = null,
  id,
  employeeName,
  allergies = [],
  dietaryRestrictions = []
) {
  // employee container
  const container = document.createElement('div');
  container.classList.add('employee-container');
  // employee name
  const h2Element = document.createElement('h2');
  h2Element.textContent = `${employeeName}`;
  container.appendChild(h2Element);

  // index
  if (index !== null) {
    const indexElement = document.createElement('p');
    indexElement.textContent = `${index}`;
    container.appendChild(indexElement);
  }

  // employeeIndex
  if (employeeIndex !== null) {
    const employeeIndexElement = document.createElement('p');
    employeeIndexElement.textContent = `EmployeeIndex: ${employeeIndex}`;
    container.appendChild(employeeIndexElement);
  }

  //diet category
  const mainDiet = dietaryRestrictions[0];
  const spanElement = document.createElement('h2');
  spanElement.textContent = `${mainDiet}`;
  container.appendChild(spanElement);

  // allergies list
  const allergiesContainer = document.createElement('div');
  allergiesContainer.classList.add('allergies-container');
  const allergiesTitle = document.createElement('h3');
  allergiesTitle.textContent = 'Allergies:';
  allergiesContainer.appendChild(allergiesTitle);
  const allergiesList = document.createElement('ul');
  allergies.forEach((allergy) => {
    const allergyElement = document.createElement('li');
    allergyElement.textContent = allergy.allergenName;
    allergiesList.appendChild(allergyElement);
  });
  allergiesContainer.appendChild(allergiesList);
  container.appendChild(allergiesContainer);

  // Create and append the dietary restrictions list
  const dietaryRestrictionsContainer = document.createElement('div');
  dietaryRestrictionsContainer.classList.add('dietary-restrictions-container');
  const dietaryRestrictionsTitle = document.createElement('h3');
  dietaryRestrictionsTitle.textContent = 'Dietary Restrictions:';
  dietaryRestrictionsContainer.appendChild(dietaryRestrictionsTitle);
  const dietaryRestrictionsList = document.createElement('ul');
  dietaryRestrictions.forEach((dietaryRestriction) => {
    const dietaryRestrictionElement = document.createElement('li');
    dietaryRestrictionElement.textContent = dietaryRestriction;
    dietaryRestrictionsList.appendChild(dietaryRestrictionElement);
  });
  dietaryRestrictionsContainer.appendChild(dietaryRestrictionsList);
  container.appendChild(dietaryRestrictionsContainer);

  // Finally, append the entire container to the body or another parent element
  responseContainer.appendChild(container);
  return new Promise((resolve) => setTimeout(resolve, 500));
}

async function submitForm(event) {
  event.preventDefault();
  const employeeId = document.getElementById('id').value;
  await handleGetEmployeeData(employeeId);
}

submitButton.addEventListener('click', () => {
  form.addEventListener('submit', submitForm);
});

document.addEventListener('DOMContentLoaded', async function () {
  await handleGetEmployeesData();
});
