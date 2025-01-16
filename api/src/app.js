const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const responseContainer = document.querySelector(".form-container__response");
const form = document.querySelector(".form");

async function getTokenFromLocalStorage() {
  return localStorage.getItem("token");
}

async function authenticateUser(token) {
  const response = await fetch(
    "https://eato-meatplanner.netlify.app/api/.netlify/functions/login",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  const dataUsername = data.username;
  if (data && dataUsername) {
    responseContainer.textContent = `User ${dataUsername} authentication passed`;
    console.log(`User ${data.username} authentication passed`);
    return true;
  } else {
    responseContainer.textContent =
      "Invalid credentials. localstorage token deleted.";
    console.log("Invalid credentials. localstorage token deleted.");
    localStorage.removeItem("token");
    return false;
  }
}

async function loginUser(username, password) {
  const loginResponse = await fetch(
    "https://eato-meatplanner.netlify.app/api/.netlify/functions/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      mode: "cors",
    }
  );

  const loginData = await loginResponse.json();
  const data = loginData.userData;
  const token = data?.token;

  if (token) {
    localStorage.setItem("token", token);
    responseContainer.textContent = "Successfuly logged in";
    console.log("Successfuly logged in");
    return true;
  } else {
    responseContainer.textContent = `Login failed: ${loginData.message}`;
    console.log("Login failed:", loginData.message);
    return false;
  }
}

function logoutUser() {
  const token = localStorage.getItem("token");
  if (token) {
    responseContainer.textContent = "Logging out...";
    localStorage.removeItem("token");
    responseContainer.textContent = "user Logged out succesfully...";
  } else {
    responseContainer.textContent =
      "you cannot log out if you are not logged in";
  }
}

async function handleLogin(username, password) {
  try {
    const token = await getTokenFromLocalStorage();

    responseContainer.textContent = "loading...";

    if (token) {
      const isUserAuthenticated = await authenticateUser(token);
      if (!isUserAuthenticated) {
        responseContainer.textContent = `User ${username} not authenticated`;
        console.log(`User ${username} not authenticated`);
        return;
      }
      responseContainer.textContent = "";
      responseContainer.textContent = `User ${username} already logged in`;
      console.log(`User ${username} already logged in`);
      return;
    }
    responseContainer.textContent = `User ${username} not logged in. Logging in...`;
    console.log(`User ${username} not logged in. Logging in...`);
    await loginUser(username, password);
  } catch (error) {
    responseContainer.textContent = `Error:  ${error} , authenticating user:`;
    console.error(`Error:  ${error} , authenticating user:`);
  }
}

async function submitForm(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  await handleLogin(username, password);
}

loginButton.addEventListener("click", (event) => {
  form.addEventListener("submit", submitForm);
});

logoutButton.addEventListener("click", logoutUser);
