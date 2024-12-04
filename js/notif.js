const notifIcon = document.getElementById('notif-icon');
  const notifContainer = document.getElementById('notif-container');
  const notifContent = document.getElementById('notif-content');

  // Fetch tasks from backend
  async function fetchTasks() {
  const response = await fetch('../php/fetch_task_notif.php');
  if (response.ok) {
    const tasks = await response.json();

    const today = new Date();
    let tasksDueSoon = 0;

    notifContent.innerHTML = '';

    tasks.forEach((task) => {
      const dueDate = new Date(task.dueDate);
      const timeDiff = (dueDate - today) / (1000 * 60 * 60 * 24);

      if (timeDiff <= 1 && timeDiff >= 0) {
        tasksDueSoon++;
        const taskElement = document.createElement('div');
        taskElement.classList.add('p-3', 'bg-teal-100', 'rounded', 'shadow', 'text-sm');
        taskElement.innerHTML = `
          <h3 class="font-bold">${task.title}</h3>
          <p>${task.description}</p>
          <p class="text-gray-500 text-xs">Due: ${task.dueDate}</p>
        `;
        notifContent.appendChild(taskElement);
      }
    });

    // Update notification count
    const notifCount = document.getElementById('notif-count');
    if (tasksDueSoon > 0) {
      notifCount.textContent = tasksDueSoon;
      notifCount.classList.remove('hidden');
    } else {
      notifContent.innerHTML = '<p class="text-sm text-gray-500">No tasks due soon.</p>';
      notifCount.classList.add('hidden');
    }
  } else {
    notifContent.innerHTML = '<p class="text-sm text-red-500">Failed to load tasks.</p>';
  }
}

// Toggle notification container and fetch tasks
notifIcon.addEventListener('click', () => {
  notifContainer.classList.toggle('hidden');
  fetchTasks();
});

// Fetch notifications periodically every five seconds
setInterval(fetchTasks, 3000);

document.addEventListener('click', (event) => {
  if (!notifContainer.contains(event.target) && event.target !== notifIcon) {
    notifContainer.classList.add('hidden');
  }
});
