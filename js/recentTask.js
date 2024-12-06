document.addEventListener("DOMContentLoaded", () => {
    const recentTaskContainer = document.getElementById('recentTask'); // The container for tasks
    const noTaskMessage = 'No current task for the day'; // Default message if no tasks

    async function fetchTasks() {
        try {
            const response = await fetch('../php/get_recentTask.php'); // Your new endpoint to fetch tasks
            const result = await response.json();

            // Clear previous content
            recentTaskContainer.innerHTML = '';

            // Create the heading dynamically
            const heading = document.createElement('h3');
            heading.classList.add('text-lg', 'font-bold', 'text-gray-700');
            heading.textContent = 'Recent Tasks';
            recentTaskContainer.appendChild(heading);

            const taskList = document.createElement('ul');
            taskList.classList.add('bg-teal-300', 'rounded-lg', 'p-4', 'space-y-2');
            recentTaskContainer.appendChild(taskList); // Append the task list to the container

            if (result.success) {
                if (result.tasks.length > 0) {
                    // Add tasks to the list in the provided format
                    result.tasks.forEach(task => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('bg-teal-400', 'rounded', 'px-4', 'py-2');
                        listItem.textContent = `${task.title} - ${task.description}`;
                        taskList.appendChild(listItem);
                    });
                } else {
                    // Show no tasks message in the format you requested
                    const listItem = document.createElement('li');
                    listItem.classList.add('bg-teal-400', 'rounded', 'px-4', 'py-2');
                    listItem.textContent = noTaskMessage;
                    taskList.appendChild(listItem);
                }
            } else {
                console.error(result.error || 'Failed to fetch tasks');
                const listItem = document.createElement('li');
                listItem.classList.add('bg-teal-400', 'rounded', 'px-4', 'py-2');
                listItem.textContent = noTaskMessage;
                taskList.appendChild(listItem);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            const taskList = document.createElement('ul');
            taskList.classList.add('bg-teal-300', 'rounded-lg', 'p-4', 'space-y-2');
            const listItem = document.createElement('li');
            listItem.classList.add('bg-teal-400', 'rounded', 'px-4', 'py-2');
            listItem.textContent = noTaskMessage;
            taskList.appendChild(listItem);
            recentTaskContainer.appendChild(taskList);
        }
    }

    // Fetch tasks on page load
    fetchTasks();
});



