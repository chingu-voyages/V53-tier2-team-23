import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import './index.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/create-employee' element={<CreateEmployee />} />
        <Route path='/view-employee' element={<ViewEmployee />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
