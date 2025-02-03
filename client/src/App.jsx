import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import CreateEmployee from './components/CreateEmployee/CreateEmployee';

function App() {
  return (
    <>
      <NavBar />
      <CreateEmployee />
      <main className='flex-grow bg-gray-100'>
        <div className='h-[872px] md:h-[990px] lg:h-[907px] bg-gray-200 rounded-md flex items-center justify-center'>
          <p className='text-lg text-gray-600'>Placeholder Content</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
