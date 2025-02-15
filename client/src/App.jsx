import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import './index.css';
import { fr } from 'date-fns/locale';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<Main />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
