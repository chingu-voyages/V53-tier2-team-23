import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Main from './components/Main/Main';
import LoginPage from './components/LoginPage/LoginPage';
import Management from './components/Management/Management';
import DatePickerContainer from './components/DatePicker/DatePickerContainer';
import WeeklyMenu from './components/WeeklyMenu/WeeklyMenu';
import CreateEmployee from './components/CreateEmployee/CreateEmployee';
import Footer from './components/Footer/Footer';
import './index.css';
import { fr } from 'date-fns/locale';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/management' element={<Management />} />
        <Route path='/calendar' element={<DatePickerContainer />} />
        <Route path='/menu' element={<WeeklyMenu />} />
        <Route path='/create-employee' element={<CreateEmployee />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
