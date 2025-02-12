import PropTypes from 'prop-types';

const DishCard = ({ item, getImageURL, getIngredientEmoji }) => {
  const formatSelectedDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const [day, weekday] = formattedDate.split(' ');
    return `${weekday} ${day}`;
  };

  return (
    <div className='w-full md:w-[430px] min-h-[620px] bg-white rounded-3xl md:rounded-none'>
      {/* Ensure width is 430px for md and lg screens */}
      <div className='text-[16px] font-bold text-center pt-8'>
        {formatSelectedDate(item.fullDate)}
      </div>
      {!item.dish ? (
        <div className='text-[36px] font-bold text-center h-[640px] flex justify-center items-center border-8 border-secondary rounded-3xl font-shantell text-gray-500 bg-gray-300'>
          No meal planned for this date
        </div>
      ) : (
        <div className='border-8 border-secondary rounded-3xl w-full min-h-[640px] mt-[0.2rem] p-2 text-center pb-4'>
          <div className='text-primary font-semibold text-[36px] font-shantell'>
            {item.dish.dishName}
          </div>
          <div className='mt-2 h-[217px] mx-1'>
            <img
              src={getImageURL(item.dish.imageUrl)}
              alt={item.dish.dishName}
              className='rounded-xl border-[3px] border-primary object-cover h-full w-full'
            />
          </div>
          <div className='mt-4 text-left mx-5'>
            <h2 className='font-bold text-[20px] text-black'>Ingredients</h2>
            <div className='grid grid-cols-2 gap-5 mt-6'>
              {item.dish.ingredients.map((ingredient) => (
                <li key={ingredient} className='flex items-center gap-2'>
                  {getIngredientEmoji(ingredient)} {ingredient}
                </li>
              ))}
            </div>
          </div>
          <div className='mt-7 flex justify-start mx-3'>
            <div className='bg-secondary text-black font-bold py-[0.5rem] px-3 inline-block'>
              Calories: {item.dish.calories}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DishCard.propTypes = {
  item: PropTypes.shape({
    fullDate: PropTypes.string.isRequired,
    dish: PropTypes.shape({
      dishName: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
      calories: PropTypes.number.isRequired,
    }),
  }).isRequired,
};

export default DishCard;
