import { useState, useEffect } from 'react';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';

const customStyles = {
  form: styles.form,
  formContainer: styles['form-container'],
  formContainerTitle: styles['form-container__title'],
  formContainerForm: styles['form-container__form'],
  formContainerInput: styles['form-container__input'],
  formContainerButton: styles['form-container__button'],
  formContainerResponse: styles['form-container__response'],
  welcome: styles['welcome'],
};

const {
  form,
  formContainer,
  formContainerTitle,
  formContainerForm,
  formContainerInput,
  formContainerButton,
  formContainerResponse,
  welcome,
} = customStyles;

function LoginPage() {
  const [responseMessage, setResponseMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authendicate, setAuthendicate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authendicate) {
      setTimeout(() => {
        navigate('/management', { state: { username } });
      }, 1000);
    }
  }, [authendicate, navigate]);

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

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const data = await response.json();
    const dataUsername = data.username;
    if (data && dataUsername) {
      setResponseMessage(`User ${dataUsername} authentication passed`);
      console.log(`User ${dataUsername} authentication passed`);
      return true;
    } else {
      setResponseMessage('Invalid credentials. LocalStorage token deleted.');
      console.log('Invalid credentials. LocalStorage token deleted.');
      localStorage.removeItem('token');
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
      return true;
    } else {
      setResponseMessage(`Login failed: ${loginData.message}`);
      return false;
    }
  }

  function logoutUser() {
    const token = localStorage.getItem('token');
    if (token) {
      setResponseMessage('Logging out...');
      localStorage.removeItem('token');
      setResponseMessage('User logged out successfully...');
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
          setAuthendicate(false);
          localStorage.removeItem('token');
          return;
        } else {
          setResponseMessage(`User ${username} already logged in`);
          setAuthendicate(true);
          return;
        }
      }

      setResponseMessage(`User ${username} not logged in. Logging in...`);
      const result = await loginUser(username, password);
      if (result) {
        setAuthendicate(true);
      } else {
        setAuthendicate(false);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error}, authenticating user`);
    }
  }

  async function submitForm(event) {
    event.preventDefault();
    await handleLogin(username, password);
  }

  return (
    <div className={`flex flex-col ${formContainer}`}>
      <span className={`${welcome} text-center text-lg`}>Welcome back! 👋</span>
      <h2 className={`${formContainerTitle} text-black text-xl font-semibold`}>
        Login to your account
      </h2>
      <form onSubmit={submitForm} className={formContainerForm}>
        <label className='text-black my-3' htmlFor='username'>
          Proffesional Email
        </label>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type='text'
          id='username'
          value={username}
          className={formContainerInput}
          placeholder='john.doe@menuhelp.com'
          required
        />
        <label className='text-black my-3' htmlFor='password'>
          Password
        </label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          id='password'
          value={password}
          className={formContainerInput}
          placeholder='Enter Password'
          required
        />
        <div className='buttons-container flex flex-row my-5 flex-wrap'>
          <button
            type='submit'
            id='loginButton'
            className={`${formContainerButton}
          w-full
          rounded-md
          hover:border-yellow-300
          p-[10px_20px]
          box-border
          border-yellow-400
          bg-white
          text-black
          border-4
          border-solid
          uppercase
          `}
          >
            Login
          </button>
        </div>
      </form>
      <div className={customStyles.formContainerResponse}>
        {responseMessage ||
          'For demo, manager credential username: manager, password: manager'}
      </div>
    </div>
  );
}

export default LoginPage;
