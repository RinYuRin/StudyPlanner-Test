document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.task-tab-content');
  const tabButtons = document.querySelectorAll('button');
  let tasks = []; // store fetched tasks globally as array

  // Fetch tasks from the backend
  fetch('../php/fetch_task.php')
      .then((response) => response.json())
      .then((fetchedTasks) => {
          tasks = fetchedTasks;
          renderAllTasks(); // Render all tasks by default
      })
      .catch((error) => console.error('Error fetching tasks:', error));

  // Tab switching functionality
  tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
          tabs.forEach((tab) => tab.classList.add('hidden'));

          // Show the selected tab
          const selectedTabId = button.id.replace('-tab', '');
          document.getElementById(selectedTabId).classList.remove('hidden');

          // Render tasks for the selected tab
          if (selectedTabId === 'all-task') {
              renderAllTasks();
          } else if (selectedTabId === 'in-progress') {
              renderInProgressTasks();
          } else if (selectedTabId === 'done') {
              renderDoneTasks();
          } else if (selectedTabId === 'due') {
              renderOverdueTasks();
          }
      });
  });

  // Function to render all tasks
  function renderAllTasks() {
      const tbody = document.getElementById('all-task').querySelector('tbody');
      tbody.innerHTML = '';

      if (tasks.length > 0) {
          tbody.innerHTML += generateTaskRows(tasks);
      } else {
          tbody.innerHTML = `
              <tr>
                  <td class="p-4 text-center text-gray-500" colspan="4">No tasks found.</td>
              </tr>
          `;
      }

      attachStarEventListeners(); // Attach the event listeners for stars
  }

  // In-progress tasks
  function renderInProgressTasks() {
      const tbody = document.getElementById('in-progress').querySelector('tbody');
      tbody.innerHTML = '';

      const filteredTasks = tasks.filter((task) => task.status === 'In Progress');

      if (filteredTasks.length > 0) {
          tbody.innerHTML += generateTaskRows(filteredTasks);
      } else {
          tbody.innerHTML = `
              <tr>
                  <td class="p-4 text-center text-gray-500" colspan="4">No tasks found.</td>
              </tr>
          `;
      }

      attachStarEventListeners();
  }

  // Done tasks
  function renderDoneTasks() {
      const tbody = document.getElementById('done').querySelector('tbody');
      tbody.innerHTML = '';

      const filteredTasks = tasks.filter((task) => task.status === 'Done');

      if (filteredTasks.length > 0) {
          tbody.innerHTML += generateTaskRows(filteredTasks);
      } else {
          tbody.innerHTML = `
              <tr>
                  <td class="p-4 text-center text-gray-500" colspan="4">No tasks found.</td>
              </tr>
          `;
      }

      attachStarEventListeners();
  }

  // Due tasks
  function renderOverdueTasks() {
      const tbody = document.getElementById('due').querySelector('tbody');
      tbody.innerHTML = '';

      const filteredTasks = tasks.filter((task) => task.status === 'Due');

      if (filteredTasks.length > 0) {
          tbody.innerHTML += generateTaskRows(filteredTasks);
      } else {
          tbody.innerHTML = `
              <tr>
                  <td class="p-4 text-center text-gray-500" colspan="4">No tasks found.</td>
              </tr>
          `;
      }

      attachStarEventListeners();
  }

  // Function to generate task rows
  function generateTaskRows(tasks) {
      return tasks
          .map(
              (task) => `
              <tr>
                  <td class="p-2">
                      <input type="checkbox" class="mr-2">
                      <i class="fas fa-star ${
                          task.starred === 'yes' ? 'text-yellow-500' : ''
                      } mr-2" data-task-id="${task.taskId}"></i>
                      ${task.title}
                  </td>
                  <td class="p-2">${task.status}</td>
                  <td class="p-2">${new Date(task.dueDate).toLocaleDateString()}</td>
              </tr>
          `
          )
          .join('');
  }

  // Function to attach event listeners to stars
  function attachStarEventListeners() {
      document.querySelectorAll('.fa-star').forEach((starIcon) => {
          starIcon.addEventListener('click', async (e) => {
              const taskId = e.target.getAttribute('data-task-id');
              const isStarred = e.target.classList.toggle('text-yellow-500'); // Toggle yellow color
              try {
                  const response = await fetch('../php/update_starred.php', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          taskId: taskId,
                          starred: isStarred ? 'yes' : 'no',
                      }),
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
  }
});
