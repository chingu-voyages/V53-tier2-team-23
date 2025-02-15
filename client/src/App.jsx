import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Main from './components/Main/Main';
import LoginPage from './components/LoginPage/LoginPage';
import Management from './components/Management/Management';
import WeeklyMenu from './components/WeeklyMenu/WeeklyMenu';
import DatePickerContainer from './components/DatePicker/DatePickerContainer';
import CreateEmployee from './components/CreateEmployee/CreateEmployee';
import ManageAllergies from './components/ManageAllergies/ManageAllergies';
import ViewEmployee from './components/ViewEmployee/ViewEmployee';
import CheckEmployeeDetails from './components/CheckEmployeeDetails/CheckEmployeeDetails';
import Footer from './components/Footer/Footer';
import './index.css';

function App() {
  return (
    <Router basename='/V53-tier2-team-23'>
      <NavBar />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/management' element={<Management />} />
        <Route path='/menu' element={<WeeklyMenu />} />
        <Route path='/calendar' element={<DatePickerContainer />} />
        <Route path='/create-employee' element={<CreateEmployee />} />
        <Route path='/manage-allergies' element={<ManageAllergies />} />
        <Route path='/view-employee' element={<ViewEmployee />} />
        <Route
          path='/check-employee-details'
          element={<CheckEmployeeDetails />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
