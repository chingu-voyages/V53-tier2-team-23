import React from 'react';

const ExportToExcel = ({ weekDates }) => {
  const exportToExcel = () => {
    let csvContent = 'Day,Date,Dish Name,Calories,Ingredients\n';

    weekDates.forEach((item) => {
      const dateString = new Date(item.fullDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      const [day, monthDay] = dateString.split(',');

      const dishExists = item.dish && item.dish.dishName;
      const dishName = dishExists ? item.dish.dishName : 'No dish assigned';
      const calories = dishExists ? item.dish.calories : 'N/A';
      const ingredients = dishExists ? item.dish.ingredients.join(', ') : 'N/A';

      csvContent += `${day},${monthDay},${dishName},${calories},${ingredients}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'weekly_menu.csv';
    downloadLink.click();
  };

  return (
    <div>
      <button
        onClick={exportToExcel}
        className='border-[1px] border-primary text-[24px] h-[45px] w-[207px] bg-white'
      >
        Excel
      </button>
    </div>
  );
};

export default ExportToExcel;
