import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import ManageAllergies from './components/ManageAllergies/ManageAllergies';
import Footer from './components/Footer/Footer';
import './index.css';
import CheckEmployeeDetails from './components/CheckEmployeeDetails/CheckEmployeeDetails';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
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
