async function updateTaskStatus(task) {
    const today = new Date();
    const dueDate = new Date(task.dueDate);

    if (task.manualStatus) return task;

    let newStatus = task.status;

    if (today.toISOString().split('T')[0] === new Date(dueDate - 86400000).toISOString().split('T')[0]) {
        newStatus = 'Due';
    } else if (today > dueDate) {
        newStatus = 'Late';
    }

    if (newStatus !== task.status) {
        try {
            await fetch('../php/update_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId: task.taskId, status: newStatus }),
            });
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    }

    return { ...task, status: newStatus };
}

async function fetchTasks() {
    const syncButton = document.getElementById('syncTasks');
    const originalIcon = syncButton.innerHTML;

    syncButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const response = await fetch('../php/fetch_task.php');
        if (!response.ok) throw new Error('Network response was not ok');
        let tasks = await response.json();

        tasks = await Promise.all(tasks.map(updateTaskStatus));

        const taskTableBody = document.getElementById('task-table-body');
        taskTableBody.innerHTML = ''; // Clear the table for fresh reload

        tasks.forEach(task => {
            // Main task row
            const taskRow = document.createElement('tr');
            taskRow.innerHTML = `
                <td class="p-2">
                    <span class="task-title cursor-pointer font-medium text-gray-700 flex items-center space-x-2" data-task-id="${task.taskId}">
                        <input type="checkbox" class="mr-2">
                        <i class="fas fa-star ${task.starred === 'yes' ? 'text-yellow-500' : ''}"></i>
                        <span>${task.title}</span>
                    </span>
                </td>
                <td class="p-2">${task.status}</td>
                <td class="p-2">${new Date(task.dueDate).toLocaleDateString()}</td>
                <td class="p-2 flex space-x-4 cursor-pointer">
                    <i class="fas fa-edit text-blue-600 hover:text-blue-800 transition-all duration-300" data-task-id="${task.taskId}"></i>
                    <i class="fas fa-trash text-red-600 hover:text-red-800 transition-all duration-300" data-task-id="${task.taskId}"></i>
                </td>
            `;

            // Description row
            const descriptionRow = document.createElement('tr');
            descriptionRow.classList.add('hidden', 'task-description-row');
            descriptionRow.innerHTML = `
                <td class="p-2 font-medium text-gray-600" colspan="4">
                    ${task.description || 'No description available.'}
                </td>
            `;

            // Append both rows to the table body
            taskTableBody.appendChild(taskRow);
            taskTableBody.appendChild(descriptionRow);
        });

        // Attach click event to toggle descriptions using delegation
        taskTableBody.addEventListener('click', (e) => {
            const taskTitleElement = e.target.closest('.task-title');
            if (taskTitleElement) {
                const taskRow = taskTitleElement.closest('tr');
                const descriptionRow = taskRow.nextElementSibling;
                if (descriptionRow && descriptionRow.classList.contains('task-description-row')) {
                    descriptionRow.classList.toggle('hidden');
                }
            }
        });

        // Attach event listeners to star icons
        document.querySelectorAll('.fa-star').forEach(starIcon => {
            starIcon.addEventListener('click', async (e) => {
                const taskId = e.target.closest('.task-title').getAttribute('data-task-id');
                const isStarred = e.target.classList.toggle('text-yellow-500');
                try {
                    const response = await fetch('../php/update_starred.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            taskId: taskId,
                            starred: isStarred ? 'yes' : 'no'
                        })
                    });
                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.error || 'Failed to update star status');
                    }
                } catch (error) {
                    console.error('Error updating star status:', error);
                    // Revert the toggle on error
                    e.target.classList.toggle('text-yellow-500', !isStarred);
                }
            });
        });

        // Attach event listeners to trash icons
        document.querySelectorAll('.fa-trash').forEach(icon => {
            icon.addEventListener('click', async (e) => {
                const taskId = e.target.getAttribute('data-task-id');
                if (confirm('Are you sure you want to delete this task?')) {
                    await deleteTask(taskId);
                    fetchTasks(); 
                }
            });
        });

        setupEditListeners();

    } catch (error) {
        console.error('Error fetching tasks:', error);
    } finally {
        syncButton.innerHTML = originalIcon;
    }
}



async function deleteTask(taskId) {
    try {
        const response = await fetch('../php/delete_task.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(result.error || 'Failed to delete task');
            alert(result.error || 'Could not delete task.');
        } else {
            alert('Task deleted successfully!');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('An unexpected error occurred.');
    }
}

window.onload = fetchTasks;
document.getElementById('syncTasks').addEventListener('click', fetchTasks);





