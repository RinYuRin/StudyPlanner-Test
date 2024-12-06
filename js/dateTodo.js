document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthName = document.getElementById('month-name');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const changeYearBtn = document.getElementById('change-year-btn');
    const yearModal = document.getElementById('year-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const yearGrid = yearModal.querySelector('.grid');
    const date = new Date();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    const renderCalendar = () => {
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
      monthName.textContent = `${monthNames[currentMonth]} ${currentYear}`;
      calendarGrid.innerHTML = '';
      const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      weekdays.forEach(day => {
        const weekdayHeader = document.createElement('div');
        weekdayHeader.classList.add('font-semibold', 'text-teal-800');
        weekdayHeader.textContent = day;
        calendarGrid.appendChild(weekdayHeader);
      });
      for (let i = 0; i < firstDay; i++) {
        calendarGrid.innerHTML += `<div></div>`; // Blank cells for previous month
      }
      for (let day = 1; day <= lastDate; day++) {
        calendarGrid.innerHTML += `
          <div class="p-4 rounded-full bg-teal-300 hover:bg-teal-400 transition cursor-pointer">${day}</div>
        `;
      }
    };
    const renderYearModal = () => {
      yearGrid.innerHTML = '';
      for (let i = currentYear - 5; i <= currentYear + 7; i++) {
        const yearBtn = document.createElement('button');
        yearBtn.textContent = i;
        yearBtn.classList.add('p-2', 'bg-teal-200', 'hover:bg-teal-300', 'transition', 'cursor-pointer', 'rounded');
        yearBtn.addEventListener('click', () => {
          currentYear = i;
          renderCalendar();
          yearModal.classList.add('hidden');
        });
        yearGrid.appendChild(yearBtn);
      }
    };

    // evemt listeners
    prevMonthBtn.addEventListener('click', () => {
      currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
      renderCalendar();
    });
    nextMonthBtn.addEventListener('click', () => {
      currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
      renderCalendar();
    });
    changeYearBtn.addEventListener('click', () => {
      yearModal.classList.remove('hidden');
      renderYearModal();
    });
    closeModalBtn.addEventListener('click', () => {
      yearModal.classList.add('hidden');
    });
    renderCalendar();
  });
  