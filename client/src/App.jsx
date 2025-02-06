import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import ManageAllergies from './components/ManageAllergies/ManageAllergies';
import Footer from './components/Footer/Footer';
import './index.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/manage-allergies' element={<ManageAllergies />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
