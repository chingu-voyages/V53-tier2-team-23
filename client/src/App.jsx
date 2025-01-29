import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import DatePicker from './components/DatePicker/DatePicker';

function App() {
  return (
    <>
      <NavBar />
      <div className='custom-bg'>
        <div className='datepicker-container flex flex-col flex-wrap items-center'>
          <h1 className='text-white w-full text-4xl text-center h-14'>
            Calendar
          </h1>
          <DatePicker />
        </div>
      </div>
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
