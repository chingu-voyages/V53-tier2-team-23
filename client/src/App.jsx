import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import LoginPage from './components/LoginPage/LoginPage';
import DatePickerContainer from './components/DatePicker/DatePickerContainer';
import './index.css';

function App() {
  return (
    <>
      <NavBar />
      <LoginPage />
      {/* <div className='custom-bg flex justify-between'>
        <DatePickerContainer />
      </div> */}

      <Footer />
    </>
  );
}

export default App;
