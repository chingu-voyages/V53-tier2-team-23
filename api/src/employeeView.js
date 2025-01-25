const submitButton = document.querySelector('#submitButton');
const responseContainer = document.querySelector('.form-container__response');
const dishesFormContainer = document.querySelector('.dishes-form-container');
const employeesFormContainer = document.querySelector(
  '.employees-form-container'
);
const employeesContainer = document.querySelector('.employees-container');
const calendarContainer = document.querySelector('.calendar-container');
const allergenfreeDishesContainer = document.querySelector(
  '.allergenfree-dishes-container'
);
const allergenfreeDishesSubmitButton = document.querySelector(
  '.allergen-free-dishes__submitButton'
);
const dishesContainer = document.querySelector('.dishes-container');
const formContainer = document.querySelector('.form-container');

const form = document.querySelector('.form');
const employeesContainerForm = document.querySelector(
  '.employees-form-container .form'
);

const dishesContainerForm = document.querySelector(
  '.dishes-form-container .form'
);
const formInput = document.querySelector('.form-container__input');

async function getDataFromLocalStorage() {
  const localData = localStorage.getItem('employeeData');
  return localData ? JSON.parse(localData) : null; // parse data
}

async function getEmployeesDataFromLocalStorage() {
  const localEmployeesData = localStorage.getItem('employeesData');
  return localEmployeesData ? JSON.parse(localEmployeesData) : null; // parse data
}

async function getDishesFromLocalStorage() {
  const localEmployeeDishes = localStorage.getItem('employeeDishes');
  return localEmployeeDishes ? JSON.parse(localEmployeeDishes) : null; // parse data
}

async function getAllergenfreeDishesFromLocalStorage() {
  const localAllergenfreeDishes = localStorage.getItem('allergenfreeDishes');
  return localAllergenfreeDishes ? JSON.parse(localAllergenfreeDishes) : null; // parse data
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

    //console.log('employeesData: ', employeesData);

    localStorage.setItem('employeesData', JSON.stringify(employeesData));
    return employeesData;
  } catch (error) {
    console.error('Error fetching employee:', error);
    // Return null
    return null;
  }
}

async function getAllergenfreeDishes() {
  const URL = `https://eatodishes.netlify.app/.netlify/functions/employees/allergen-free-dishes`;
  try {
    const response = await fetch(URL, {
      method: 'GET',
    });

    // check response success
    if (!response.ok) {
      throw new Error(`Failed to fetch dishes data: ${response.status}`);
    }

    const responseData = await response.json();

    const allergenfreeDishes = responseData.data.dishes;

    //console.log('allergenfreeDishes: ', allergenfreeDishes);

    localStorage.setItem(
      'allergenfreeDishes',
      JSON.stringify(allergenfreeDishes)
    );
    return allergenfreeDishes;
  } catch (error) {
    console.error('Error fetching dishes:', error);
    // Return null
    return null;
  }
}

async function getEmployees(employeesData) {
  for (const employee of employeesData) {
    let employeeIndex = employeesData.findIndex(
      (index) => index._id == employee._id
    );
    const {
      _id,
      employeeName,
      allergies = [],
      dietaryRestrictions = [],
    } = employee;

    await viewEmployee(
      employeesContainer,
      employeeIndex + 1,
      _id,
      employeeName,
      allergies,
      dietaryRestrictions
    );
  }
}

async function getDishes(container, dishesData) {
  for (const dish of dishesData) {
    let dishIndex = dishesData.findIndex((index) => index._id == dish._id);
    const {
      _id,
      category,
      dishName,
      ingredients = [],
      calories,
      imageUrl,
    } = dish;

    await viewEmployeeDishes(
      container,
      dishIndex + 1,
      _id,
      category,
      dishName,
      ingredients,
      calories,
      imageUrl
    );
  }
}

async function handleGetEmployeesData() {
  try {
    responseContainer.innerHTML = 'loading...';
    const employeesData = await getAllEmployees();
    const localEmployeesData = await getEmployeesDataFromLocalStorage();
    if (employeesData && !localEmployeesData) {
      responseContainer.innerHTML = '';
      await getEmployees(employeesData);
    } else if (localEmployeesData && employeesData) {
      if (
        JSON.stringify(localEmployeesData) === JSON.stringify(employeesData)
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

async function handleGetAllergenfreeDishes() {
  try {
    allergenfreeDishesContainer.innerHTML = 'loading...';
    calendarContainer.innerHTML = 'loading...';
    const allergenfreeDishes = await getAllergenfreeDishes();
    const localAllergenfreeDishes =
      await getAllergenfreeDishesFromLocalStorage();
    if (allergenfreeDishes && !localAllergenfreeDishes) {
      allergenfreeDishesContainer.innerHTML = '';
      calendarContainer.innerHTML = '';
      // await getDishes(allergenfreeDishesContainer, allergenfreeDishes);
      await createCalendar(calendarContainer, allergenfreeDishes);
    } else if (localAllergenfreeDishes && allergenfreeDishes) {
      if (
        JSON.stringify(localAllergenfreeDishes) ===
        JSON.stringify(allergenfreeDishes)
      ) {
        allergenfreeDishesContainer.innerHTML = '';
        calendarContainer.innerHTML = '';
        //await getDishes(allergenfreeDishesContainer, localAllergenfreeDishes);
        await createCalendar(calendarContainer, localAllergenfreeDishes);
      } else {
        console.log('The data is different');
        allergenfreeDishesContainer.textContent = 'dishes data has changed.';
      }
    } else {
      allergenfreeDishesContainer.textContent = 'No dishes';
      console.log('No dishes');
      localStorage.removeItem('allergenfreeDishes');
    }
  } catch (error) {
    allergenfreeDishesContainer.textContent = `Error:  ${error} , getting dishes:`;
    console.error(`Error:  ${error} , getting dishes:`);
  }
}

async function handleGetEmployeeData(employeeId) {
  try {
    responseContainer.innerHTML = 'loading...';
    const employeeData = await getEmployee(employeeId);
    //console.log('handleGetEmployeeData: ', employeeData);
    const localEmployeeData = await getDataFromLocalStorage();
    // console.log('localEmployeeData: ', localEmployeeData);
    const {
      _id,
      employeeName,
      allergies = [],
      dietaryRestrictions = [],
    } = employeeData;
    if (employeeData && !localEmployeeData) {
      responseContainer.innerHTML = '';
      await viewEmployeeById(
        responseContainer,
        _id,
        employeeName,
        allergies,
        dietaryRestrictions
      );
    } else if (localEmployeeData && employeeData) {
      if (
        localEmployeeData._id === _id &&
        localEmployeeData.employeeName === employeeName
      ) {
        responseContainer.innerHTML = '';
        await viewEmployeeById(
          responseContainer,
          _id,
          employeeName,
          allergies,
          dietaryRestrictions
        );
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
  const URL = `https://eatodishes.netlify.app/.netlify/functions/employees/${employeeId}`;
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

    //console.log('employeeData: ', employeeData);

    localStorage.setItem('employeeData', JSON.stringify(employeeData));
    return employeeData;
  } catch (error) {
    console.error('Error fetching employee:', error);
    // Return null
    return null;
  }
}

async function getEmployeeDishes(employeeId) {
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

    const employeeDishes = responseData.data.dishes;

    //console.log('responseData: ', responseData);
    //console.log(' employeeDishes: ', employeeDishes);

    localStorage.setItem('employeeDishes', JSON.stringify(employeeDishes));
    return employeeDishes;
  } catch (error) {
    console.error('Error fetching employee:', error);
    // Return null
    return null;
  }
}

// const calendarTemplate = `
// <div class="wrapper">
//   <h1>Meal planner</h1>
//   <div class="table">
//     <div class="tracks" name="myElements">
//       <div class="track yellow">
//         <div class="track">
//           <div class="heading">Monday</div>
//         </div>
//         <div class="entry fullh">
//           <div class="details">
//             <h3>Lorem ipsum dolor sit.</h3>
//             <p>Lorem ipsum dolor sit amet.</p>
//             <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere!</p>
//           </div>
//         </div>
//       </div>
//       <div class="track turq">
//         <div class="track">
//           <div class="heading">Tuesday</div>
//         </div>
//         <div class="entry fullh">
//           <div class="details">
//             <h3>Lorem ipsum dolor sit.</h3>
//             <p>Lorem ipsum dolor sit amet.</p>
//           </div>
//         </div>
//       </div>
//       <div class="track blue">
//         <div class="track">
//           <div class="heading">Wednesday</div>
//         </div>
//         <div class="entry fullh">
//           <div class="details">
//             <h3>Lorem ipsum dolor sit.</h3>
//             <p>Lorem ipsum dolor sit amet.</p>
//           </div>
//         </div>
//       </div>
//       <div class="track green">
//         <div class="track">
//           <div class="heading">Thursday</div>
//         </div>
//         <div class="entry fullh">
//           <div class="details">
//             <h3>Lorem ipsum dolor sit.</h3>
//             <p>Lorem ipsum dolor sit amet.</p>
//             <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, omnis voluptas?</p>
//           </div>
//         </div>
//       </div>
//       <div class="track purple">
//         <div class="track">
//           <div class="heading">Friday</div>
//         </div>
//         <div class="entry fullh">
//           <div class="details">
//             <h3>Lorem ipsum dolor sit.</h3>
//             <p>Lorem ipsum dolor sit amet.</p>
//           </div>
//         </div>
//       </div>
//       <div class="track gray">
//         <div class="track">
//           <div class="heading">Saturday</div>
//         </div>
//         <div class="entry fullh">
//           <div class="details">
//             <h3>Lorem ipsum dolor sit.</h3>
//             <p>Lorem ipsum dolor sit amet.</p>
//           </div>
//         </div>
//       </div>
//       <div class="track">
//         <div class="track">
//           <div class="heading">Sunday</div>
//         </div>
//         <div class="entry fullh">
//           <div class="details dayoff">
//             <h3>Dayoff</h3>
//             <p>Dayoff</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// `;

async function createCalendar(appendContainer, dishes) {
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const colors = ['yellow', 'turq', 'blue', 'green', 'purple', 'gray', '']; // No color for Sunday

  const uniqueDishesMap = new Map();

  const shuffle = (array) => {
    return array
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  };

  const shuffledDishes = shuffle(dishes);

  const shuffledDishesMap = new Map();

  daysOfWeek.forEach((day, index) => {
    if (shuffledDishes[index]) {
      shuffledDishesMap.set(day, shuffledDishes[index]);
    }
  });

  //console.log(shuffledDishesMap);

  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');

  // Create title
  const title = document.createElement('h1');
  title.textContent = 'Meal Planner';
  wrapper.appendChild(title);

  // Create table container
  const table = document.createElement('div');
  table.classList.add('table');
  wrapper.appendChild(table);

  // Create tracks container
  const tracksContainer = document.createElement('div');
  tracksContainer.classList.add('tracks');
  tracksContainer.setAttribute('name', 'myElements');
  table.appendChild(tracksContainer);

  // Loop through days and create elements
  daysOfWeek.forEach((day, index) => {
    const track = document.createElement('div');
    track.classList.add('track');

    if (colors[index]) {
      track.classList.add(colors[index]); // Apply color class
    }

    // Heading
    const headingContainer = document.createElement('div');
    headingContainer.classList.add('track');

    const heading = document.createElement('div');
    heading.classList.add('heading');
    heading.textContent = day;
    headingContainer.appendChild(heading);

    // Entry container
    const entry = document.createElement('div');
    entry.classList.add('entry', 'fullh');

    const details = document.createElement('div');
    details.classList.add('details');

    const dish = shuffledDishesMap.get(day);
    console.log(dish);
    // console.log(`Dish: ${dish.dishName}`);
    // console.log(`Category: ${dish.category}`);
    // console.log(`Calories: ${dish.calories}`);
    // console.log(`Image: ${dish.imageUrl}`);
    const dishIngredients = dish.ingredients;
    const ingredientsList = dishIngredients
      .map((ingredient) => `<li>${ingredient}</li>`)
      .join('');

    if (day === 'Sunday') {
      details.classList.add('dayoff');
      details.innerHTML = `<h3>Day Off</h3><p>Enjoy your rest day!</p>`;
    } else {
      details.innerHTML = `
          <h3>Meal for ${day}</h3>
          <p class="dish-name">Dish: ${dish.dishName}</p>
          <p class="category">Category: ${dish.category}</p>
          <p class="calories">Calories: ${dish.calories}</p>
          <ul class="dish-container">${ingredientsList}</ul>
          <div class="dish-background-image-container" style="background-image: url('${dish.imageUrl}');">
            <h2 class="dish-background-image-container__dish-name">Delicious meal for today!</h2>
            <div class="dish-label">${dish.dishName}</div>
          </div>
        `;
    }

    entry.appendChild(details);
    track.appendChild(headingContainer);
    track.appendChild(entry);
    tracksContainer.appendChild(track);
  });

  // Append wrapper to body
  appendContainer.innerHTML = '';
  appendContainer.appendChild(wrapper);
  return new Promise((resolve) => setTimeout(resolve, 500));
}

async function handleGetEmployeeDishes(employeeId) {
  try {
    dishesContainer.innerHTML = 'loading...';
    const employeeDishes = await getEmployeeDishes(employeeId);

    console.log('employeeDishes: ', employeeDishes);
    const localEmployeeDishes = await getDishesFromLocalStorage();
    // console.log('localEmployeeData: ', localEmployeeData);

    if (employeeDishes && !localEmployeeDishes) {
      dishesContainer.innerHTML = '';
      await getDishes(dishesContainer, employeeDishes);
    } else if (localEmployeeDishes && employeeDishes) {
      if (
        JSON.stringify(localEmployeeDishes) === JSON.stringify(employeeDishes)
      ) {
        dishesContainer.innerHTML = '';
        await getDishes(dishesContainer, employeeDishes);
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

// async function getAllergen(allergenId) {
//   const URL = `https://eatodishes.netlify.app/.netlify/functions/allergens/${allergenId}`;
//   try {
//     const response = await fetch(URL, {
//       method: 'GET',
//     });

//     // check response success
//     if (!response.ok) {
//       throw new Error(`Failed to fetch allergen data: ${response.status}`);
//     }

//     const responseData = await response.json();

//     const allergenData = responseData.data.allergen;

//     console.log('allergenData: ', allergenData);

//     localStorage.setItem('allergenData', JSON.stringify(allergenData));
//     return allergenData;
//   } catch (error) {
//     console.error('Error fetching allergen:', error);
//     // Return null
//     return null;
//   }
// }

// async function handleGetEmployeeData(employeeId) {
//   try {
//     responseContainer.innerHTML = 'loading...';
//     const employeeData = await getEmployee(employeeId);
//     console.log('handleGetEmployeeData: ', employeeData);
//     const localEmployeeData = await getDataFromLocalStorage();
//     //console.log('localEmployeeData: ', localEmployeeData);
//     const { _id, employeeName, allergies, dietaryRestrictions } = employeeData;

//     if (employeeData && !localEmployeeData) {
//       responseContainer.innerHTML = '';
//       await viewEmployee(
//         responseContainer,
//         _id,
//         employeeName,
//         allergies,
//         dietaryRestrictions
//       );
//     } else if (localEmployeeData && employeeData) {
//       if (
//         localEmployeeData._id === _id &&
//         localEmployeeData.employeeName === employeeName
//       ) {
//         responseContainer.innerHTML = '';
//         await viewEmployee(
//           responseContainer,
//           _id,
//           employeeName,
//           allergies,
//           dietaryRestrictions
//         );
//         //responseContainer.textContent = `${JSON.stringify(localEmployeeData)}`;
//       } else {
//         console.log('The data is different');
//         responseContainer.textContent = 'Employee data has changed.';
//       }
//     } else {
//       responseContainer.textContent = 'No user';
//       console.log('No user');
//       localStorage.removeItem('employeeData');
//     }
//   } catch (error) {
//     responseContainer.textContent = `Error:  ${error} , getting employee:`;
//     console.error(`Error:  ${error} , getting employee:`);
//   }
// }

async function viewEmployee(
  appendContainer,
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
  const employeeNameElement = document.createElement('h2');
  employeeNameElement.textContent = `${employeeName}`;
  container.appendChild(employeeNameElement);

  // employeeIndex
  if (employeeIndex !== null) {
    const employeeIndexElement = document.createElement('p');
    employeeIndexElement.classList.add('employee-index');
    employeeIndexElement.textContent = `${employeeIndex}`;
    container.appendChild(employeeIndexElement);
  }

  // id
  const employeeIdElement = document.createElement('p');
  employeeIdElement.classList.add('employee-id');
  employeeIdElement.textContent = `Employee ID: ${id}`;
  container.appendChild(employeeIdElement);

  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    //diet category
    const mainDiet = dietaryRestrictions[0];
    const mainDietElement = document.createElement('h2');
    mainDietElement.classList.add('main-diet');
    mainDietElement.textContent = `${mainDiet}`;
    container.appendChild(mainDietElement);
  }
  // allergies list
  const allergiesContainer = document.createElement('div');
  allergiesContainer.classList.add('allergies-container');
  const allergiesTitle = document.createElement('h3');
  allergiesTitle.textContent = 'Allergies:';
  allergiesContainer.appendChild(allergiesTitle);
  const allergiesList = document.createElement('ul');
  for (const allergy of allergies) {
    const allergyElement = document.createElement('li');
    allergyElement.textContent = allergy;
    allergiesList.appendChild(allergyElement);
  }
  allergiesContainer.appendChild(allergiesList);
  container.appendChild(allergiesContainer);

  // Create and append the dietary restrictions list
  const dietaryRestrictionsContainer = document.createElement('div');
  dietaryRestrictionsContainer.classList.add('dietary-restrictions-container');
  const dietaryRestrictionsTitle = document.createElement('h3');
  dietaryRestrictionsTitle.textContent = 'Dietary Restrictions:';
  dietaryRestrictionsContainer.appendChild(dietaryRestrictionsTitle);
  const dietaryRestrictionsList = document.createElement('ul');

  for (const dietaryRestriction of dietaryRestrictions) {
    const dietaryRestrictionElement = document.createElement('li');
    dietaryRestrictionElement.textContent = dietaryRestriction;
    dietaryRestrictionsList.appendChild(dietaryRestrictionElement);
  }

  dietaryRestrictionsContainer.appendChild(dietaryRestrictionsList);
  container.appendChild(dietaryRestrictionsContainer);

  // button view
  const buttonElement = document.createElement('button');
  buttonElement.classList.add('form-container__button');
  buttonElement.textContent = 'Manage employee';
  container.appendChild(buttonElement);

  // Finally, append the entire container to the body or another parent element
  appendContainer.appendChild(container);
  // responseContainer.appendChild(container);
  // employeesContainer.appendChild(container);
  return new Promise((resolve) => setTimeout(resolve, 500));
}

async function viewEmployeeById(
  appendContainer,
  id,
  employeeName,
  allergies = [],
  dietaryRestrictions = []
) {
  // employee container
  const container = document.createElement('div');
  container.classList.add('employee-container');
  // employee name
  const employeeNameElement = document.createElement('h2');
  employeeNameElement.textContent = `${employeeName}`;
  container.appendChild(employeeNameElement);

  // id
  const employeeIdElement = document.createElement('p');
  employeeIdElement.classList.add('employee-id');
  employeeIdElement.textContent = `Employee ID: ${id}`;
  container.appendChild(employeeIdElement);

  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    //diet category
    const mainDiet = dietaryRestrictions[0];
    const mainDietElement = document.createElement('h2');
    mainDietElement.classList.add('main-diet');
    mainDietElement.textContent = `${mainDiet}`;
    container.appendChild(mainDietElement);
  }
  // allergies list
  const allergiesContainer = document.createElement('div');
  allergiesContainer.classList.add('allergies-container');
  const allergiesTitle = document.createElement('h3');
  allergiesTitle.textContent = 'Allergies:';
  allergiesContainer.appendChild(allergiesTitle);
  const allergiesList = document.createElement('ul');
  for (const allergy of allergies) {
    const allergyElement = document.createElement('li');
    allergyElement.textContent = allergy;
    allergiesList.appendChild(allergyElement);
  }
  allergiesContainer.appendChild(allergiesList);
  container.appendChild(allergiesContainer);

  // Create and append the dietary restrictions list
  const dietaryRestrictionsContainer = document.createElement('div');
  dietaryRestrictionsContainer.classList.add('dietary-restrictions-container');
  const dietaryRestrictionsTitle = document.createElement('h3');
  dietaryRestrictionsTitle.textContent = 'Dietary Restrictions:';
  dietaryRestrictionsContainer.appendChild(dietaryRestrictionsTitle);
  const dietaryRestrictionsList = document.createElement('ul');

  for (const dietaryRestriction of dietaryRestrictions) {
    const dietaryRestrictionElement = document.createElement('li');
    dietaryRestrictionElement.textContent = dietaryRestriction;
    dietaryRestrictionsList.appendChild(dietaryRestrictionElement);
  }

  dietaryRestrictionsContainer.appendChild(dietaryRestrictionsList);
  container.appendChild(dietaryRestrictionsContainer);

  // button view
  const buttonElement = document.createElement('button');
  buttonElement.classList.add('dishes-container__button');
  buttonElement.type = 'button';
  buttonElement.textContent = 'View dishes';
  container.appendChild(buttonElement);

  // Finally, append the entire container to the body or another parent element
  appendContainer.appendChild(container);
  // responseContainer.appendChild(container);
  // employeesContainer.appendChild(container);
  return new Promise((resolve) => setTimeout(resolve, 500));
}

async function viewEmployeeDishes(
  appendContainer,
  dishIndex = null,
  id,
  category,
  dishName,
  ingredients = [],
  calories,
  imageUrl
) {
  // dishes container
  const container = document.createElement('div');
  container.classList.add('dish-container');

  // dishIndex
  if (dishIndex !== null) {
    const dishIndexElement = document.createElement('p');
    dishIndexElement.classList.add('dish-index');
    dishIndexElement.textContent = `${dishIndex}`;
    container.appendChild(dishIndexElement);
  }

  // dish name
  const dishNameElement = document.createElement('h2');
  dishNameElement.textContent = `${dishName}`;
  container.appendChild(dishNameElement);

  const dishImageElement = document.createElement('div');
  dishImageElement.classList.add('dish-image');
  const imageElement = new Image();
  imageElement.src = imageUrl;
  dishImageElement.appendChild(imageElement);

  //dish category
  const dishCategoryElement = document.createElement('h2');
  dishCategoryElement.classList.add('dish-category');
  dishCategoryElement.textContent = `${category}`;
  dishImageElement.appendChild(dishCategoryElement);
  container.appendChild(dishImageElement);

  // id
  const dishIdElement = document.createElement('p');
  dishIdElement.classList.add('dish-id');
  dishIdElement.textContent = `dish ID: ${id}`;
  container.appendChild(dishIdElement);

  // ingredients list
  const ingredientsContainer = document.createElement('div');
  ingredientsContainer.classList.add('ingredients-container');
  const ingredientsTitle = document.createElement('h3');
  ingredientsTitle.textContent = 'Ingredients:';
  ingredientsContainer.appendChild(ingredientsTitle);
  const ingredientsList = document.createElement('ul');
  for (const ingredient of ingredients) {
    const ingredientElement = document.createElement('li');
    ingredientElement.textContent = ingredient;
    ingredientsList.appendChild(ingredientElement);
  }
  ingredientsContainer.appendChild(ingredientsList);
  container.appendChild(ingredientsContainer);

  // Create and append the dietary restrictions list
  const caloriesContainer = document.createElement('div');
  caloriesContainer.classList.add('calories-container');
  const caloriesTitle = document.createElement('h3');
  caloriesTitle.textContent = 'calories: ';
  caloriesContainer.appendChild(caloriesTitle);
  const caloriesElement = document.createElement('p');
  caloriesElement.textContent = calories;
  caloriesContainer.appendChild(caloriesElement);
  container.appendChild(caloriesContainer);

  // Finally, append the entire container to the body or another parent element
  appendContainer.appendChild(container);
  // responseContainer.appendChild(container);
  // employeesContainer.appendChild(container);
  return new Promise((resolve) => setTimeout(resolve, 500));
}

async function submitForm(event) {
  event.preventDefault();
  const employeeId = document.getElementById('id').value;
  // console.log('submitForm', employeeId);

  await handleGetEmployeeData(employeeId);
}

async function submitDishesForm(event) {
  event.preventDefault();

  // const employeeId = document.querySelector(
  //   '.form-container__response .employee-id'
  // ).textContent;
  const employeeId = document.getElementById('id').value;
  // const employeeId = formInput.value;
  console.log('submitDishesForm', employeeId);
  await handleGetEmployeeDishes(employeeId);
}

async function allergenfreeDishesSubmitForm(event) {
  event.preventDefault();
  await handleGetAllergenfreeDishes();
}
//allergenfreeDishesSubmitButton
function selectFormSubmit(form, submitFormEvent) {
  if (!form) {
    console.error('Form not found.');
    return;
  }

  // Remove previous submit event listeners
  form.removeEventListener('submit', submitForm);
  form.removeEventListener('submit', submitDishesForm);
  form.removeEventListener('submit', allergenfreeDishesSubmitForm);

  // Add the new submit event listener
  form.addEventListener('submit', submitFormEvent);

  // Manually submit the form (if needed)
  setTimeout(() => {
    form.requestSubmit(); // More reliable than dispatchEvent for native form submission
  }, 0);
}

document.addEventListener('DOMContentLoaded', async function () {
  //await handleGetEmployeesData();

  dishesFormContainer.addEventListener('click', function (event) {
    console.log('clicked dishesFormContainer');
    if (event.target.classList.contains('allergen-free-dishes__submitButton')) {
      console.log('clicked allergen-free-dishes__submitButton');
      selectFormSubmit(dishesContainerForm, allergenfreeDishesSubmitForm);
    }
  });

  employeesFormContainer.addEventListener('click', function (event) {
    console.log('clicked employeesFormContainer');
    if (event.target.classList.contains('dishes-container__button')) {
      console.log('clicked dishes-container__button');
      // const formResponseContainer = event.target.closest(
      //   '.form-container__response'
      // ); // Get the parent container
      // console.log('clicked formResponseContainer');
      // const dishesContainerButton = formResponseContainer.querySelector(
      //   '.dishes-container__button'
      // );
      // console.log('clicked dishesContainerButton', dishesContainerButton);

      selectFormSubmit(employeesContainerForm, submitDishesForm);
    }
  });

  employeesContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('form-container__button')) {
      const employeeContainer = event.target.closest('.employee-container'); // Get the parent container
      const inputValueElement =
        employeeContainer.querySelector('p.employee-id');
      // console.log(inputValueElement.textContent);
      const inputValue = inputValueElement.textContent
        .replace('Employee ID:', '')
        .trim();
      // console.log(inputValue);
      // const button = employeeContainer.querySelector('button');
      // submitButton.addEventListener('click', () => {
      //   form.addEventListener('submit', submitForm);
      // });
      // console.log('clicked');
      formInput.value = inputValue;
      selectFormSubmit(employeesContainerForm, submitForm); // Remove previous listeners
    }
  });
});
