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