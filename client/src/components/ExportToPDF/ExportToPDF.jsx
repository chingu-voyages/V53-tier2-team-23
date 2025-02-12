import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ExportToPDF = ({ weekDates, getImageURL }) => {
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
      dishElement.style.width = '70%'; // Ensures content is centered within a reasonable width
      dishElement.style.margin = '0 auto'; // Horizontally centers the container
      dishElement.innerHTML = `
        <div class='text-center text-[32px] font-bold pb-[10px]'>
          ${dateString}
        </div>
        <div class='border-8 border-secondary rounded-3xl p-4'>
          <div class="text-primary font-bold text-[40px] font-shantell text-center pb-5">
            ${item.dish.dishName}
          </div>
          <div class="mt-2 mx-1">
            <img src="${imageURL}" alt="${item.dish.dishName}" 
              onError="this.src='https://placehold.co/400'"
              class="rounded-xl border-[3px] border-primary object-cover h-full w-full" />
          </div>
          <div class="mb-4 mx-5 text-left">
            <h2 class="font-bold text-[28px]">Ingredients</h2>
            <div class="grid grid-cols-2 gap-5 mt-6">
              ${item.dish.ingredients
                .map(
                  (ingredient) => `
                  <div class="flex items-center gap-2">
                    <span class="text-[20px]">${ingredient}</span>
                  </div>
                `
                )
                .join('')}
            </div>
          </div>
          <div style="background: #FFC107; color: black; font-weight: bold; padding: 0px 20px 10px; display: inline-block; margin-left: 20px;">
            Calories: ${item.dish.calories}
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
      alert('No dishes assigned this week. PDF will not be generated.');
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

export default ExportToPDF;
