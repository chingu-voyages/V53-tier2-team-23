import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Management() {
  const [buttonText, setButtonText] = useState(''); // for button "generate" or "view" text
  const [showDropdown, setShowDropdown] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  // to navigate to the calendar for user to select week
  const handleMenuButtonClick = (action) => {
    setButtonText(action);
    navigate('/calendar', { state: { action, isViewMode: action === 'View' } });
  };

  const token = localStorage.getItem('token');

  // to fetch employee list
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          'https://eato-meatplanner.netlify.app/.netlify/functions/employees',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = await response.json();
        // console.log('employee data: ', responseData);

        if (responseData.data) {
          setEmployees(responseData.data);
        } else {
          alert('Unexpected API response format');
          // console.error('Unexpected API response format:', responseData);
        }
      } catch (error) {
        alert('Error fetching employees');
        // console.error('Error fetching employees: ', error);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='custom-bg md:h-[995px] lg:h-[907px]'>
      <div className='relative z-10 flex flex-col items-center gap-10 md:mt-1 lg:mt-0 '>
        <h1 className='font-shantell text-[24px] sm:hidden'>
          Welcome {username}!
        </h1>
        <h1 className='font-shantell text-[36px] font-bold text-primary text-center hidden sm:block lg:text-[48px]'>
          Welcome {username}, <br className='hidden md:block lg:hidden' />
          <span className='hidden md:inline'>Plan your weekly menu!</span>
        </h1>

        <div className='flex flex-col gap-24 justify-center items-center mb-10 mt-5 md:mt-[0.9rem] md:gap-14 md:py-[98px] md:bg-white md:w-[465px] md:h-[570px] md:rounded-3xl lg:py-[115px] lg:gap-24'>
          {/* Menu Section */}
          <div className='flex flex-col gap-3'>
            <p className='font-shantell text-primary text-[24px] font-bold text-center'>
              Plan your weekly menu
            </p>
            <div className='group relative w-[340px] shadow-gray-400 shadow-md rounded-full hover:shadow-none'>
              <p className='border-secondary border-[5px] bg-white rounded-full px-16 h-[56px] text-2xl font-semibold text-primary text-center flex items-center justify-center'>
                MENUS
              </p>
              <div className='flex flex-col justify-center items-center'>
                <div className='hidden group-hover:flex flex-col w-[320px]'>
                  <button
                    onClick={() => handleMenuButtonClick('Generate')}
                    className='border-[1px] border-primary text-2xl h-[56px] bg-white'
                  >
                    Generate Menus
                  </button>
                  <button
                    onClick={() => handleMenuButtonClick('View')}
                    className='border-[1px] border-primary text-2xl h-[56px] bg-white'
                  >
                    View Menus
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Allergy Section */}
          <div className='flex flex-col gap-3 items-center justify-center h-full p-16 md:p-0'>
            <p className='font-shantell text-primary max-w-[283px] text-[24px] font-bold text-center'>
              Need to edit allergies of an employee?
            </p>
            <div className='group relative w-[340px] shadow-gray-400 shadow-md rounded-full hover:shadow-none'>
              <p className='border-secondary border-[5px] bg-white rounded-full px-16 h-[56px] text-2xl font-semibold text-primary text-center flex items-center justify-center'>
                ALLERGIES
              </p>
              <div className='flex flex-col justify-center items-center'>
                <div className='hidden group-hover:flex flex-col w-[320px]'>
                  <div className='relative w-64'>
                    <button
                      onClick={() => setShowDropdown((prev) => !prev)}
                      className='border-[1px] border-primary text-2xl h-[56px] bg-white flex items-center justify-center gap-6 w-[320px] '
                    >
                      <span>Select an Employee</span>
                      <svg
                        className='w-4 h-4 text-primary'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 9l-7 7-7-7'
                        />
                      </svg>
                    </button>
                    {/* dropdown list of employees */}
                    {showDropdown && (
                      <div className='absolute mt-1 bg-white border rounded-md shadow-lg z-10 py-2 w-[320px]'>
                        {/* Search Input Field */}
                        <input
                          type='text'
                          placeholder='Type name here...'
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className='py-2 w-[320px]'
                        />

                        {/* Employee List */}
                        <div className='max-h-60 overflow-y-auto '>
                          {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee) => (
                              <button
                                key={employee._id}
                                className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                                onClick={() => {
                                  navigate('/edit-employee', {
                                    state: { employeeId: employee._id },
                                  });
                                  setShowDropdown(false);
                                }}
                              >
                                <span className=''>
                                  {employee.employeeName}
                                </span>
                              </button>
                            ))
                          ) : (
                            <p className='px-4 py-2 text-gray-500'>
                              No employees found
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => navigate('/create-employee')}
                    className='border-[1px] border-primary text-2xl h-[56px] bg-white'
                  >
                    Add an Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Management;
