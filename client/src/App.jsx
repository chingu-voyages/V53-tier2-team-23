import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import CreateEmployee from './components/CreateEmployee/CreateEmployee';
import ViewEmployee from './components/ViewEmployee/ViewEmployee';
import Footer from './components/Footer/Footer';
import './index.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/create-employee' element={<CreateEmployee />} />
        <Route path='/view-employee' element={<ViewEmployee />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
