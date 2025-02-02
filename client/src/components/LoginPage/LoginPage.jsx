import styles from './LoginPage.module.css';

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
  return (
    <div className={`flex flex-col ${formContainer}`}>
      <h2 className={formContainerTitle}>Manager Login</h2>
      <form className={formContainerForm}>
        <input
          type='text'
          id='username'
          className={formContainerInput}
          placeholder='Username'
          required
        />
        <input
          type='password'
          id='password'
          className={formContainerInput}
          placeholder='Password'
          required
        />
        <div className='buttons-container flex flex-row m-5 flex-wrap'>
          <button
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
