import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import ManageAllergies from './components/ManageAllergies/ManageAllergies';
import Management from './components/Management/Management';
import DatePickerContainer from './components/DatePicker/DatePickerContainer';
import WeeklyMenu from './components/WeeklyMenu/WeeklyMenu';
import CreateEmployee from './components/CreateEmployee/CreateEmployee';
import ImageTest from './components/ImageTest/ImageTest';
import Footer from './components/Footer/Footer';
import './index.css';
import CheckEmployeeDetails from './components/CheckEmployeeDetails/CheckEmployeeDetails';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/management' element={<Management />} />
        <Route path='/calendar' element={<DatePickerContainer />} />
        <Route path='/menu' element={<WeeklyMenu />} />
        <Route path='/create-employee' element={<CreateEmployee />} />
        {/* for test only */}
        <Route path='/image-test' element={<ImageTest />} />
        <Route path='/manage-allergies' element={<ManageAllergies />} />
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
