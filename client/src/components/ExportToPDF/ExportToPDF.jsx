import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import AlertPopUp from '../AlertPopUp/AlertPopUp';
import PropTypes from 'prop-types';

const ExportToPDF = ({ weekDates, getImageURL, getIngredientEmoji }) => {
  const [showAlert, setShowAlert] = useState({ message: '', status: false });

  const exportToPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let hasDishes = false;
    let pageIndex = 0;

    const processDish = (item, index) => {
      const dishExists = item.dish && item.dish.dishName;
      if (!dishExists) return;

      hasDishes = true;

      const dateString = new Date(item.fullDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      const imageURL = getImageURL(item.dish.imageUrl || null);

      const dishElement = document.createElement('div');
      dishElement.style.display = 'block';
      dishElement.style.width = '210mm'; // a4 width
      dishElement.style.height = '297mm'; //  a4 height
      dishElement.style.margin = '0 auto';
      dishElement.innerHTML = `
        <div style="text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 10px;">
          ${dateString}
        </div>
        <div style="border: 8px solid #FFC107; border-radius: 20px; width: 100%; min-height: 640px; padding: 16px; text-align: center;">
          <h2 style="color: #4A148C; font-size: 36px; font-family: 'Shantell Sans', cursive; font-weight: 600;">
            ${item.dish.dishName}
          </h2>
          <div style="margin-top: 8px; margin-left: 4px; margin-right: 4px;">
            <img src="${imageURL}" alt="${item.dish.dishName}" 
              onError="this.src='https://placehold.co/400'"
              class="rounded-xl border-[3px] border-primary object-cover h-full w-full" />
          </div>
          <div style="margin-top: 16px; text-align: left; margin-left: 20px;">
            <h2 style="font-weight: bold; font-size: 20px; color: black;">Ingredients</h2>
            <ul style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 24px; list-style: none; padding: 0;">
              ${item.dish.ingredients
                .map(
                  (ingredient) =>
                    `<li style="display: flex; align-items: center; gap: 8px; font-size: 16px;">${getIngredientEmoji(
                      ingredient
                    )} ${ingredient}</li>`
                )
                .join('')}
            </ul>
          </div>
          <div style="margin-top: 28px; display: flex; justify-content: start; margin-left: 12px;">
            <div style="background: #FFC107; color: black; font-weight: bold; padding: 0px 10px 15px; display: inline-block;">
              Calories: ${item.dish.calories}
            </div>
          </div>
        </div>`;

      document.body.appendChild(dishElement);

      html2canvas(dishElement, { scale: 2, useCORS: true })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = pdf.internal.pageSize.getWidth();

          const imgWidth = pdfWidth * 0.8; // Makes sure the bordered div is well positioned
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          const x = (pdfWidth - imgWidth) / 2; // Center horizontally
          const y = 10; // Keeps natural vertical position

          if (pageIndex > 0) {
            pdf.addPage();
          }

          pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
          pageIndex++;

          if (index === weekDates.length - 1 && hasDishes) {
            pdf.save('WeeklyMenu.pdf');
          }

          document.body.removeChild(dishElement);
        })
        .catch((error) => {
          console.error('Error generating PDF:', error);
        });
    };

    weekDates.forEach((item, index) => processDish(item, index));

    if (!hasDishes) {
      setShowAlert({
        message: 'No dishes assigned this week. PDF will not be generated.',
        status: true,
      });
    }
  };

  return (
    <button
      onClick={exportToPDF}
      className='border-[1px] border-primary text-[24px] h-[45px] w-[207px] bg-white'
    >
      PDF
    </button>
  );
};

ExportToPDF.propTypes = {
  weekDates: PropTypes.arrayOf(
    PropTypes.shape({
      fullDate: PropTypes.string.isRequired,
      dish: PropTypes.shape({
        dishName: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
        calories: PropTypes.number.isRequired,
      }),
    })
  ).isRequired,
  getImageURL: PropTypes.func.isRequired,
  getIngredientEmoji: PropTypes.func.isRequired,
};

export default ExportToPDF;
