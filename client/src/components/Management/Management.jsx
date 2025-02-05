import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Management() {
  const [buttonText, setButtonText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); // for employees dropdown
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // for search funtion
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state?.username || {};

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
          console.error('Unexpected API response format:', responseData);
        }
      } catch (error) {
        console.error('Error fetching employees: ', error);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='custom-bg'>
      <h1 className='font-shantell'>Welcome {username}!</h1>

      {/* Menu Section */}
      <div>
        <p className='font-shantell'>Plan your weekly menu</p>
        <div className='group relative flex flex-col'>
          <p className='border-secondary border-2 rounded-full w-fit px-16'>
            Menus
          </p>
          <div className='hidden group-hover:flex flex-col gap-3 mt-2 w-fit'>
            <button onClick={() => handleMenuButtonClick('Generate')}>
              Generate Menus
            </button>
            <button onClick={() => handleMenuButtonClick('View')}>
              View Menus
            </button>
          </div>
        </div>
      </div>

      {/* Allergy Section */}
      <div>
        <p className='font-shantell'>Need to edit allergies of an employee?</p>
        <div className='group relative flex flex-col'>
          <p className='border-secondary border-2 rounded-full w-fit px-16'>
            Allergies
          </p>
          <div className='hidden group-hover:flex flex-col gap-3 mt-2 w-fit'>
            <div className='relative w-64'>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className='text-primary px-4 py-2 w-full border rounded-md text-left flex justify-between items-center bg-white shadow'
              >
                <span className='text-primary font-bold'>
                  Select an Employee
                </span>
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
                <div className='absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10 py-2'>
                  {/* Search Input Field */}
                  <input
                    type='text'
                    placeholder='Type name here...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='py-2'
                  />

                  {/* Employee List */}
                  <div className='max-h-60 overflow-y-auto'>
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
                          <span className=''>{employee.employeeName}</span>
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
            <button onClick={() => navigate('/create-employee')}>
              Add an Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Management;
