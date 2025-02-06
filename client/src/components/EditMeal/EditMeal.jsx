import { useState, useEffect, useRef } from 'react';

const EditMealModal = ({ isModalOpen, setIsModalOpen, weekDates }) => {
  const [filterDishes, setFilterDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const dropdownRefs = useRef({});

  const token = localStorage.getItem('token');
  // fetch dishes from
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
          console.error('Unexpected API error:', responseData);
        }
      } catch (error) {
        console.error('Error fetching filtered dishes:', error);
      }
    };
    fetchFilterDishes();
  }, [token]);

  // to initialize dish selections when modal opens
  useEffect(() => {
    if (isModalOpen) {
      const initialDishes = {};
      const initialSearchTerms = {};
      weekDates.forEach((item) => {
        const dishName = item.dish?.dishName || null;
        initialDishes[item.fullDate] = dishName;
        initialSearchTerms[item.fullDate] = dishName;
      });
      setSelectedDishes(initialDishes);
      setSearchTerms(initialSearchTerms);
    }
  }, [isModalOpen, weekDates]);

  // count current "Day Off" days
  const dayOffCount = Object.values(selectedDishes).filter(
    (dish) => dish === null
  ).length;
  const maxDayOff = 2;

  // Handle dish selection from dropdown
  const handleDishSelect = (date, dishName) => {
    setSelectedDishes((prev) => ({ ...prev, [date]: dishName }));
    setSearchTerms((prev) => ({ ...prev, [date]: dishName })); // update input field
    setIsDropdownOpen((prev) => ({ ...prev, [date]: false })); // close dropdown
  };

  // handle input typing
  const handleSearchChange = (date, value) => {
    setSearchTerms((prev) => ({ ...prev, [date]: value }));
    setIsDropdownOpen((prev) => ({ ...prev, [date]: true })); // open dropdown when typing
    setSelectedDishes((prev) => ({ ...prev, [date]: value || '' }));
  };

  const handleSetDayOff = (date) => {
    if (selectedDishes[date] === null) {
      // If already "Day Off", allow resetting it
      setSearchTerms((prev) => ({
        ...prev,
        [date]: '',
      }));

      setSelectedDishes((prev) => ({
        ...prev,
        [date]: '',
      }));
    } else if (dayOffCount < maxDayOff) {
      // "Day Off" allow only 2 days max
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

  // close dropdown when clicking outside
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

  // save function
  const handleSave = () => {
    console.log('Saved Meal Plan', selectedDishes);
    setIsModalOpen(false);
  };

  if (!isModalOpen) return null;

  return (
    isModalOpen && (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
          <h2 className='text-xl font-bold mb-4 text-black'>Edit Meal</h2>
          <div>
            {weekDates.map((item) => {
              const filteredList = filterDishes.filter((dish) =>
                dish.dishName
                  .toLowerCase()
                  .includes((searchTerms[item.fullDate] || '').toLowerCase())
              );
              return (
                <div className='flex flex-col mb-3' key={item.fullDate}>
                  <div className='flex items-center justify-between gap-3'>
                    {/* Date Box */}
                    <div className='cursor-pointer flex flex-col items-center justify-center w-[70px] h-[72px] border border-black rounded-md p-2'>
                      <div className='text-[11px]'>{item.day}</div>
                      <div className='text-[11px]'>{item.date}</div>
                    </div>

                    {/* Dish List */}
                    <div
                      className='relative w-full'
                      ref={(el) => (dropdownRefs.current[item.fullDate] = el)}
                    >
                      {/* Text Input */}
                      <input
                        type='text'
                        placeholder='Type dish name here...'
                        value={
                          searchTerms[item.fullDate] === null
                            ? 'Day Off'
                            : searchTerms[item.fullDate] || ''
                        }
                        onChange={(e) =>
                          handleSearchChange(item.fullDate, e.target.value)
                        }
                        className='border px-2 py-1 w-full rounded-md'
                        onFocus={() =>
                          setIsDropdownOpen((prev) => ({
                            ...prev,
                            [item.fullDate]: true,
                          }))
                        }
                        disabled={searchTerms[item.fullDate] === null} //Disable input if day off is set
                      />

                      {/* Drop down List */}
                      {isDropdownOpen[item.fullDate] &&
                        filteredList.length > 0 && (
                          <div className='absolute bg-white border mt-1 max-h-40 overflow-y-auto w-full rounded-md shadow-lg z-50'>
                            {filteredList.map((dish) => (
                              <div
                                key={dish._id}
                                className='p-2 hover:bg-gray-200 cursor-pointer'
                                onClick={() =>
                                  handleDishSelect(item.fullDate, dish.dishName)
                                }
                              >
                                {dish.dishName}
                              </div>
                            ))}
                          </div>
                        )}

                      {/* "Set Day Off" Button */}
                      <button
                        className={`px-2 py-1 rounded text-sm ${
                          selectedDishes[item.fullDate] === null
                            ? 'bg-green-500 text-white'
                            : dayOffCount >= maxDayOff
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-red-500 text-white'
                        }`}
                        onClick={() => handleSetDayOff(item.fullDate)}
                        disabled={
                          dayOffCount >= maxDayOff &&
                          selectedDishes[item.fullDate] !== null
                        }
                      >
                        {selectedDishes[item.fullDate] === null
                          ? 'Undo Day Off'
                          : 'Set Day Off'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save Button */}
          <button
            className='mt-4 bg-primary text-white py-2 px-4 rounded-full'
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    )
  );
};

export default EditMealModal;
