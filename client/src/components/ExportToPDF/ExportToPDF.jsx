import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ExportToPDF = ({ weekDates }) => {
  const exportToPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');

    weekDates.forEach((item, index) => {
      const dishExists = item.dish && item.dish.dishName;
      const dateString = new Date(item.fullDate).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric'
      });

      const dishElement = document.createElement('div');
      dishElement.innerHTML = `
        <div class="text-center text-primary font-bold text-[20px] mt-4">
          ${dateString}
        </div>
        ${dishExists ? `
          <div class="border-[1px] border-primary rounded-3xl w-full mt-[0.9rem] p-2 text-center pb-4">
            <div class="text-primary font-bold text-[36px] font-shantell">
              ${item.dish.dishName}
            </div>
            <div class="mt-2 h-[217px] mx-1">
              <img src="${item.dish.imageUrl}" alt="${item.dish.dishName}" onError="this.src='https://placehold.co/400'" class="rounded-xl border-[3px] border-primary object-cover h-full w-full" />
            </div>
            <div class="mt-4 text-left mx-5">
              <h2 class="font-bold text-[20px]">Ingredients</h2>
              <div class="grid grid-cols-2 gap-5 mt-6">
                ${item.dish.ingredients.map(ingredient => `
                  <div class="flex items-center gap-2">
                    <span class="text-[20px]">${ingredient}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="mt-7 flex justify-start mx-3">
              <div class="bg-secondary text-black font-bold py-[0.5rem] px-3 inline-block">
                Calories: ${item.dish.calories}
              </div>
            </div>
          </div>
        ` : `
          <div class="text-center text-primary font-bold text-[20px] mt-4">
            No dish assigned for this day.
          </div>
        `}`;

      document.body.appendChild(dishElement);

      html2canvas(dishElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        if (index === weekDates.length - 1) {
          pdf.save('WeeklyMenu.pdf');
        }

        document.body.removeChild(dishElement);
      }).catch((error) => {
        console.error('Error generating PDF:', error);
      });
    });
  };

  return (
    <button onClick={exportToPDF} className="bg-primary text-white p-1 px-6 rounded-full text-[24px] flex items-center justify-center gap-2 shadow-lg w-fit">
      Export to PDF
    </button>
  );
};

export default ExportToPDF;
