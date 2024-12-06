const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const taskModal = document.getElementById('taskModal');
const creationDate = document.getElementById('creationDate');
const taskForm = document.getElementById('taskForm');

// Default current day at creation date
function setCreationDate() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    creationDate.value = formattedDate;
}

// Open the modal
openModal?.addEventListener('click', () => {
    setCreationDate();
    taskModal.classList.remove('hidden');
});

// Close the modal
closeModal.addEventListener('click', () => {
    taskModal.classList.add('hidden');
    taskForm.reset(); 
});

window.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        taskModal.classList.add('hidden');
        taskForm.reset(); 
    }
});

// Handle form submission and send it to the backend
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.querySelector('input[placeholder="Enter task title"]').value.trim();
    const description = document.querySelector('textarea[placeholder="Enter task description"]').value.trim();
    const dueDate = document.getElementById('dueDate').value;
    const startTime = document.querySelector('input[type="time"]:first-of-type').value;
    const endTime = document.querySelector('input[type="time"]:last-of-type').value;
    const taskColor = document.getElementById('colorPicker').value;

    // Validate required fields
    if (!title || !dueDate || !startTime || !endTime) {
        return;
    }

    const taskData = { title, description, creationDate: creationDate.value, dueDate, startTime, endTime, taskColor };

    try {
        const response = await fetch('../php/create_task.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });

        const result = await response.json();

        if (response.ok) {
            showToast('Task created successfully!', 'success'); // Success toast

            // Reset form fields
            document.querySelector('input[placeholder="Enter task title"]').value = '';
            document.querySelector('textarea[placeholder="Enter task description"]').value = '';
            document.getElementById('dueDate').value = '';
            document.querySelector('input[type="time"]:first-of-type').value = '';
            document.querySelector('input[type="time"]:last-of-type').value = '';
            document.getElementById('colorPicker').value = '#000000'; 
        } else {
            console.error(result.error || "An error occurred");
            showToast(result.error || "Could not create task.", 'error'); // Error toast
        }
    } catch (error) {
        console.error(error);
        showToast("An unexpected error occurred.", 'error'); // Error toast
    }
});

// Toast function
function showToast(message, type = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '1rem';
    toastContainer.style.right = '1rem';
    toastContainer.style.zIndex = '1000'; // Ensure it's above other elements
    toastContainer.innerHTML = `
        <div class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 ${type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} rounded-lg dark:bg-green-800 dark:text-green-200">
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                <span class="sr-only">Check icon</span>
            </div>
            <div class="ms-3 text-sm font-normal">${message}</div>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
    `;
    document.body.appendChild(toastContainer);

    // Add close functionality to the toast
    const closeButton = toastContainer.querySelector('button[aria-label="Close"]');
    closeButton.addEventListener('click', () => {
        toastContainer.remove();
    });

    // Automatically remove the toast after 3 seconds
    setTimeout(() => {
        toastContainer.remove();
    }, 5000);
}
