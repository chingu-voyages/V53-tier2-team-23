import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Management() {
  const [buttonText, setButtonText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [employees, setEmployees] = useState([]);
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
        console.log('employee data: ', responseData);

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

  return (
    <div>
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
            <div className='relative'>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className='text-primary px-4 py-2'
              >
                Select an Employee
              </button>
              {/* dropdown list of employees */}
              {showDropdown && (
                <div>
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <button
                        key={employee._id}
                        className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                        onClick={() =>
                          navigate('/edit-employee', {
                            state: { employeeId: employee._id },
                          })
                        }
                      >
                        {employee.employeeName}
                      </button>
                    ))
                  ) : (
                    <p>No employees available</p>
                  )}
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
