//its still doesnt fully work, will fix later

const today = moment();
let currentWeekStart = today.clone().startOf('week');

function generateCalendar() {
    document.getElementById('current-month').textContent = currentWeekStart.format('MMMM YYYY');
    document.getElementById('current-date-heading').textContent = today.format('MMM DD, YYYY');

    const calendarContainer = document.getElementById('calendar-dates');
    calendarContainer.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const date = currentWeekStart.clone().add(i, 'days');
        const isToday = date.isSame(today, 'day');

        const dateElement = document.createElement('div');
        dateElement.classList.add('text-center', 'cursor-pointer', 'h-24', 'px-4', 'py-4', 'border-2', 'rounded-full', 'transition-all', 'duration-300');
        
        if (isToday) {
            dateElement.classList.add('bg-teal-500', 'text-white');
        } else {
            dateElement.classList.add('bg-teal-400', 'text-black', 'hover:bg-teal-500');
        }

        dateElement.innerHTML = `<p class="font-bold text-3xl">${date.date()}</p><p>${date.format('ddd')}</p>`;
        calendarContainer.appendChild(dateElement);
    }
}

// Function to navigate to the previous week
function goToPrevWeek() {
    currentWeekStart.subtract(1, 'weeks');
    generateCalendar();
}

// Function to navigate to the next week
function goToNextWeek() {
    currentWeekStart.add(1, 'weeks');
    generateCalendar();
}

// event listener for buttons
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('prev').addEventListener('click', goToPrevWeek);
    document.getElementById ('next').addEventListener('click', goToNextWeek);
    
    
    generateCalendar();
});
