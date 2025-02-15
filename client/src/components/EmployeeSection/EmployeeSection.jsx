import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function EmployeeSection({ onSelectEmployee, onAddEmployee }) {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch employees
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

        if (responseData.data) {
          setEmployees(responseData.data);
        } else {
          alert('Unexpected API response format');
        }
      } catch (error) {
        alert('Error fetching employees');
      }
    };

    fetchEmployees();
  }, [token]);

  const filteredEmployees = employees.filter((employee) =>
    employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeSelect = (employee) => {
    onSelectEmployee(employee);
    setShowDropdown(false);
  };

  return (
    <div className='hidden group-hover:flex flex-col w-[320px]'>
      <div className='relative w-64'>
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className='border-[1px] border-primary text-2xl h-[56px] bg-white flex items-center justify-center gap-6 w-[320px]'
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

        {showDropdown && (
          <div className='absolute mt-1 bg-white border rounded-md shadow-lg z-10 py-2 w-[320px]'>
            <input
              type='text'
              placeholder='Type name here...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='py-2 w-[320px]'
            />
            <div className='max-h-60 overflow-y-auto'>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <button
                    key={employee._id}
                    className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                    onClick={() => handleEmployeeSelect(employee)}
                  >
                    <span>{employee.employeeName}</span>
                  </button>
                ))
              ) : (
                <p className='px-4 py-2 text-gray-500'>No employees found</p>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onAddEmployee}
        className='border-[1px] border-primary text-2xl h-[56px] bg-white'
      >
        Add an Employee
      </button>
    </div>
  );
}

EmployeeSection.propTypes = {
  onSelectEmployee: PropTypes.func.isRequired,
  onAddEmployee: PropTypes.func.isRequired,
};

export default EmployeeSection;
