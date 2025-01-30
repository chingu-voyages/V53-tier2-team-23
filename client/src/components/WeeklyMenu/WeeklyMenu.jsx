import { FaArrowDown } from 'react-icons/fa6';
import DayNavigator from '../DayNavigator/DayNavigator';

const dishMockUp = {
  dishName: 'CAESAR SALAD',
  imageUrl: 'https://placehold.co/1726x1031',
  ingredients: [
    { name: 'Peas', emoji: '🌿' },
    { name: 'Eggs', emoji: '🥚' },
    { name: 'Chili', emoji: '🌶️' },
    { name: 'Cheese', emoji: '🧀' },
  ],
  calories: '614',
};

function WeeklyMenu() {
  return (
    <div>
      <DayNavigator />
      <h1 className='text-center text-primary font-bold text-[24px] mt-[1.35rem] font-shantell'>
        Check this Week&apos;s Meals
      </h1>
      <div className='border-[1px] border-primary rounded-3xl w-full mt-[0.9rem] p-2 text-center pb-4'>
        <div className='text-primary font-bold text-[36px] font-shantell '>
          {dishMockUp.dishName}
        </div>
        <div className='mt-2 h-[217px] mx-1'>
          <img
            src={dishMockUp.imageUrl}
            alt={dishMockUp.dishName}
            className='rounded-xl border-[3px] border-primary object-cover h-full w-full'
          />
        </div>
        <div className='mt-4 text-left mx-5'>
          <h2 className='font-bold text-[20px]'>Ingredients</h2>
          <div className='grid grid-cols-2 gap-5 mt-6'>
            {dishMockUp.ingredients.map((item, index) => (
              <div key={index} className='flex items-center gap-2'>
                <span>{item.emoji}</span>
                <span className='text-[20px]'>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='mt-7 flex justify-start mx-3'>
          <div className='bg-secondary text-black font-bold py-[0.5rem] px-3 inline-block'>
            Calories: {dishMockUp.calories}
          </div>
        </div>
        <div className='mt-6 flex flex-col gap-7 items-center'>
          <button className='bg-primary text-white p-1 px-6 rounded-full text-[24px] flex items-center justify-center gap-2 shadow-lg w-fit'>
            EXPORT WEEKLY PLAN <FaArrowDown />
          </button>
          <button className='border-[1px] border-primary text-primary py-1 px-4 rounded-full font-semibold text-[24px] font-shantell shadow-lg w-fit'>
            EDIT MEAL
          </button>
        </div>
      </div>
    </div>
  );
}

export default WeeklyMenu;
