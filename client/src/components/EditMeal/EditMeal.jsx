import { useState, useEffect, useRef } from 'react';
import AlertPopUp from '../AlertPopUp/AlertPopUp';
import PropTypes from 'prop-types';

const EditMealModal = ({
  isModalOpen,
  setIsModalOpen,
  weekDates,
  refreshMenu,
}) => {
  const [filterDishes, setFilterDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const dropdownRefs = useRef({});
  const token = localStorage.getItem('token');

  const handleNotice = (message) => {
    setShowAlert({ message, status: true });
  };

  // Fetch dishes
  useEffect(() => {
    const fetchFilterDishes = async () => {
      try {
        const response = await fetch(
          'https://eato-meatplanner.netlify.app/.netlify/functions/dishes/filtered',
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const responseData = await response.json();
        if (responseData?.data?.dishes) {
          setFilterDishes(responseData.data.dishes);
        } else {
          handleNotice('Unexpected API error');
          // console.error('Unexpected API error:', responseData);
        }
      } catch (error) {
        handleNotice('Error fetching filtered dishes');
        // console.error('Error fetching filtered dishes:', error);
      }
    };
    fetchFilterDishes();
  }, [token]);

  // Initialize selected dishes and search terms when the modal opens
  useEffect(() => {
    if (isModalOpen && weekDates) {
      const initialDishes = {};
      const initialSearchTerms = {};
      weekDates.forEach((item) => {
        const dishName = item.dish?.dishName || null;
        initialDishes[item.fullDate] = dishName;
        initialSearchTerms[item.fullDate] = dishName;
      });
      setSelectedDishes(initialDishes);
      setSearchTerms(initialSearchTerms);
      setSelectedDate(weekDates[0]?.fullDate);
    }
  }, [isModalOpen, weekDates]);

  // Exclude dishes already assigned in the week
  const availableDishes = filterDishes.filter((dish) => {
    return !weekDates.some(
      (item) =>
        item.dish?.dishName === dish.dishName && item.fullDate !== selectedDate
    );
  });

  const dayOffCount = Object.values(selectedDishes).filter(
    (dish) => dish === null
  ).length;
  const maxDayOff = 2;

  // Handle dish selection from dropdown
  const handleDishSelect = (date, dishName) => {
    setSelectedDishes((prev) => ({ ...prev, [date]: dishName }));
    setSearchTerms((prev) => ({ ...prev, [date]: dishName }));
    setIsDropdownOpen((prev) => ({ ...prev, [date]: false }));
  };

  // Handle input typing
  const handleSearchChange = (date, value) => {
    setSearchTerms((prev) => ({ ...prev, [date]: value }));
    setIsDropdownOpen((prev) => ({ ...prev, [date]: true }));
    setSelectedDishes((prev) => ({ ...prev, [date]: value || '' }));
  };

  const handleSetDayOff = (date) => {
    if (dayOffCount >= maxDayOff && selectedDishes[date] !== null) {
      handleNotice('You can only set a maximum of 2 days off in a week.');
      return;
    }

    if (selectedDishes[date] === null) {
      setSearchTerms((prev) => ({
        ...prev,
        [date]: '',
      }));
      setSelectedDishes((prev) => ({
        ...prev,
        [date]: '',
      }));
    } else if (dayOffCount < maxDayOff) {
      setSearchTerms((prev) => ({
        ...prev,
        [date]: null,
      }));
      setSelectedDishes((prev) => ({
        ...prev,
        [date]: null,
      }));
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((date) => {
        if (
          dropdownRefs.current[date] &&
          !dropdownRefs.current[date].contains(event.target)
        ) {
          setIsDropdownOpen((prev) => ({ ...prev, [date]: false }));
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = async () => {
    if (!selectedDate) return;

    try {
      const selectedDishName = selectedDishes[selectedDate];

      let dishId = null;
      if (selectedDishName && selectedDishName !== 'Day Off') {
        const dish = filterDishes.find(
          (d) =>
            d.dishName.trim().toLowerCase() ===
            selectedDishName.trim().toLowerCase()
        );

        if (!dish) {
          handleNotice(
            `Dish "${selectedDishName}" not found. Please select a valid dish.`
          );
          return;
        }
        dishId = dish._id;
      }

      const response = await fetch(
        'https://eato-meatplanner.netlify.app/.netlify/functions/menus',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            weekStartDate: weekDates[0]?.fullDate,
            date: selectedDate,
            dish: dishId || null,
          }),
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        handleNotice(
          `Error updating menu: ${responseData.message}. Menu update failed.`
        );
        return;
      }
      handleNotice('Menu updated successfully!');
      setIsModalOpen(false);
      refreshMenu();
    } catch (error) {
      handleNotice(
        'An unexpected error occurred while updating the menu. Please try again.'
      );
      // console.error('Error updating menu:', error);
    }
  };

  if (!isModalOpen || !weekDates) return null;

  return (
    <>
      <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
          <h2 className='text-[24px] font-bold font-shantell text-center mb-4 text-black'>
            Edit Meal
          </h2>

          <div className='border-8 border-secondary rounded-3xl w-full p-8 pb-4'>
            {/* Date Picker */}
            <div className='mb-4 '>
              <label
                htmlFor='datePicker'
                className='block text-sm font-medium text-gray-700'
              >
                Select Date
              </label>
              <select
                id='datePicker'
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className='mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md'
              >
                {weekDates.map((item) => (
                  <option key={item.fullDate} value={item.fullDate}>
                    {item.day}, {item.fullDate}
                  </option>
                ))}
              </select>
            </div>

            {/* Dish Picker */}
            <div className='mb-4'>
              <label
                htmlFor='dishPicker'
                className='block text-sm font-medium text-gray-700'
              >
                Select Dish
              </label>
              <input
                type='text'
                id='dishPicker'
                value={
                  selectedDishes[selectedDate] === null
                    ? 'Day Off'
                    : searchTerms[selectedDate] || 'Type your dish here...'
                }
                onFocus={() =>
                  setIsDropdownOpen((prev) => ({
                    ...prev,
                    [selectedDate]: true,
                  }))
                }
                onChange={(e) =>
                  handleSearchChange(selectedDate, e.target.value)
                }
                className={`mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md 
                ${
                  selectedDishes[selectedDate] === null
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : ''
                }`}
                disabled={selectedDishes[selectedDate] === null}
              />
              {isDropdownOpen[selectedDate] &&
                availableDishes.length > 0 &&
                selectedDishes[selectedDate] !== null && (
                  <div className='absolute bg-white z-20 border w-[256px] mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg'>
                    {availableDishes.map((dish) => (
                      <div
                        key={dish._id}
                        className='p-2 hover:bg-gray-200 cursor-pointer'
                        onClick={() =>
                          handleDishSelect(selectedDate, dish.dishName)
                        }
                      >
                        {dish.dishName}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* "Day Off" Button */}
            <div className='flex items-center space-x-3 mb-5'>
              <div
                onClick={() => handleSetDayOff(selectedDate)}
                className={`relative w-16 h-8 flex items-center cursor-pointer rounded-full p-1 transition-colors duration-300 ${
                  selectedDishes[selectedDate] === null
                    ? 'bg-gray-300'
                    : 'bg-primary'
                }`}
              >
                <div
                  className={`absolute bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                    selectedDishes[selectedDate] === null ? 'left-1' : 'right-1'
                  }`}
                ></div>
              </div>
              <span className='text-sm font-medium text-gray-700'>
                {selectedDishes[selectedDate] === null ? 'Day Off' : 'Day On'}
              </span>
            </div>

            {/* Save Button */}
            <div className='flex justify-between'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='bg-gray-500 text-white py-2 px-4 rounded-md'
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className='bg-primary text-white py-2 px-4 rounded-md'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      {showAlert.status && (
        <AlertPopUp setShowAlert={setShowAlert} showAlert={showAlert} />
      )}
    </>
  );
};

EditMealModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  weekDates: PropTypes.arrayOf(
    PropTypes.shape({
      fullDate: PropTypes.string.isRequired,
      day: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
      dish: PropTypes.shape({
        dishName: PropTypes.string,
      }),
    })
  ).isRequired,
  refreshMenu: PropTypes.func.isRequired,
};

export default EditMealModal;
