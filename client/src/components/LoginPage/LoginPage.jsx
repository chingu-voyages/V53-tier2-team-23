import { useState } from 'react';
import styles from './LoginPage.module.css';
//import Management from './Management/Management';

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

function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function getTokenFromLocalStorage() {
    return localStorage.getItem('token');
  }

  async function authenticateUser(token) {
    const response = await fetch(
      'https://eato-meatplanner.netlify.app/.netlify/functions/login',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    const dataUsername = data.username;
    if (data && dataUsername) {
      setResponseMessage(`User ${dataUsername} authentication passed`);
      console.log(`User ${dataUsername} authentication passed`);
      setIsAuthenticated(true);
      return true;
    } else {
      setResponseMessage('Invalid credentials. LocalStorage token deleted.');
      console.log('Invalid credentials. LocalStorage token deleted.');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      return false;
    }
  }

  async function loginUser(username, password) {
    const loginResponse = await fetch(
      'https://eato-meatplanner.netlify.app/.netlify/functions/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        mode: 'cors',
      }
    );

    const loginData = await loginResponse.json();
    const data = loginData.userData;
    const token = data?.token;

    if (token) {
      localStorage.setItem('token', token);
      setResponseMessage('Successfully logged in');
      setIsAuthenticated(true);
      return true;
    } else {
      setResponseMessage(`Login failed: ${loginData.message}`);
      setIsAuthenticated(false);
      return false;
    }
  }

  function logoutUser() {
    const token = localStorage.getItem('token');
    if (token) {
      setResponseMessage('Logging out...');
      localStorage.removeItem('token');
      setResponseMessage('User logged out successfully...');
      setIsAuthenticated(false);
    } else {
      setResponseMessage('You cannot log out if you are not logged in');
    }
  }

  async function handleLogin(username, password) {
    try {
      setResponseMessage('Loading...');
      const token = await getTokenFromLocalStorage();

      if (token) {
        const isUserAuthenticated = await authenticateUser(token);
        if (!isUserAuthenticated) {
          setResponseMessage(`User ${username} not authenticated`);
          return;
        }
        setResponseMessage(`User ${username} already logged in`);
        return;
      }

      setResponseMessage(`User ${username} not logged in. Logging in...`);
      await loginUser(username, password);
    } catch (error) {
      setResponseMessage(`Error: ${error}, authenticating user`);
    }
  }

  async function submitForm(event) {
    event.preventDefault();
    await handleLogin(username, password);
  }

  return isAuthenticated ? (
    <Dashboard username={username} />
  ) : (
    <div className={`flex flex-col ${formContainer}`}>
      <h2 className={formContainerTitle}>Manager Login</h2>
      <form onSubmit={submitForm} className={formContainerForm}>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type='text'
          id='username'
          value={username}
          className={formContainerInput}
          placeholder='Username'
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          id='password'
          value={password}
          className={formContainerInput}
          placeholder='Password'
          required
        />
        <div className='buttons-container flex flex-row m-5 flex-wrap'>
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
          `}
          >
            Login
          </button>
          <button
            onClick={logoutUser}
            id='logoutButton'
            type='button'
            className={`
            bg-[#e2484d]
            text-yellow-400
            w-fit
            rounded-full
            border-none
            hover:border-2
            hover:border-solid
            p-[10px_20px]
            hover:bg-white 
            hover:text-[#e2484d]
            hover:border-yellow-400
            ${formContainerButton}`}
          >
            Logout
          </button>
        </div>
      </form>

      <div className={customStyles.formContainerResponse}>
        The response will be shown here ✅
      </div>
    </div>
  );
}

export default LoginPage;
