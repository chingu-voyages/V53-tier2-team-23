import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Main from './components/Main/Main';
import CreateEmployee from './components/CreateEmployee/CreateEmployee';
import ViewEmployee from './components/ViewEmployee/ViewEmployee';
import Footer from './components/Footer/Footer';
import './index.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/management' element={<Management />} />
        <Route path='/calendar' element={<DatePicker />} />
        <Route path='/menu' element={<WeeklyMenu />} />
        <Route path='/create-employee' element={<CreateEmployee />} />
        <Route path='/view-employee' element={<ViewEmployee />} />
        <Route path='/view-employee' element={<ViewEmployee />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
