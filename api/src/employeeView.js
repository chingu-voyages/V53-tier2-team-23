const submitButton = document.querySelector('#submitButton');
const responseContainer = document.querySelector('.form-container__response');
const form = document.querySelector('.form');

async function getDataFromLocalStorage() {
  const localData = localStorage.getItem('employeeData');
  return localData ? JSON.parse(localData) : null; // parse data
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
    console.log(responseData);
    const employeeData = responseData.data;
    console.log(employeeData);
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
    responseContainer.textContent = 'loading...';
    const employeeData = await getEmployee(employeeId);

    const localEmployeeData = await getDataFromLocalStorage();
    const { id, employeeName, allergies, dietaryRestrictions } = employeeData;
    const {
      localid,
      localemployeeName,
      localallergies,
      localdietaryRestrictions,
    } = localEmployeeData;
    if (localEmployeeData && employeeData) {
      if (localid === id && localemployeeName === employeeName) {
        responseContainer.textContent = `${JSON.stringify(localEmployeeData)}`;
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

async function submitForm(event) {
  event.preventDefault();
  const employeeId = document.getElementById('id').value;
  await handleGetEmployeeData(employeeId);
}

submitButton.addEventListener('click', (event) => {
  form.addEventListener('submit', submitForm);
});
