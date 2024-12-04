function setupEditListeners() {
    document.querySelectorAll('.fa-edit').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const taskId = e.target.getAttribute('data-task-id');
            const title = e.target.getAttribute('data-title');
            const description = e.target.getAttribute('data-description');
            const status = e.target.getAttribute('data-status');
            openEditModal(taskId, title, description, status);
        });
    });
}

function openEditModal(taskId, title, description, status) {
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    editForm.dataset.taskId = taskId;

    // Populate the form fields
    document.getElementById('editTitle').value = title;
    document.getElementById('editDescription').value = description;
    document.getElementById('editStatus').value = status;

    // Show the modal
    editModal.classList.remove('hidden');
}

async function saveEditTask(event) {
    event.preventDefault();
    const editForm = document.getElementById('editForm');
    const taskId = editForm.dataset.taskId;

    const title = document.getElementById('editTitle').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const status = document.getElementById('editStatus').value;

    try {
        const response = await fetch('../php/edit_task.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskId,
                title,
                description,
                status,
                manualOverride: true,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(result.error || 'Failed to edit task');
            alert(result.error || 'Could not edit task.');
        } else {
            alert('Task updated successfully!');
            fetchTasks(); 
            closeEditModal();
        }
    } catch (error) {
        console.error('Error editing task:', error);
        alert('An unexpected error occurred.');
    }
}


function closeEditModal() {
    const editModal = document.getElementById('editModal');
    editModal.classList.add('hidden');
}

// Event listener for saving edits
document.getElementById('editForm').addEventListener('submit', saveEditTask);
document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
