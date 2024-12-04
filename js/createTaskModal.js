const openModal = document.getElementById('openModal');
      const closeModal = document.getElementById('closeModal');
      const taskModal = document.getElementById('taskModal');
      const creationDate = document.getElementById('creationDate');
      const taskForm = document.getElementById('taskForm');
  
      // default current day at creation datee
      function setCreationDate() {
          const today = new Date();
          const formattedDate = today.toISOString().split('T')[0];
          creationDate.value = formattedDate;
      }
  
      // open the modal
      openModal?.addEventListener('click', () => {
          setCreationDate();
          taskModal.classList.remove('hidden');
      });
  
      // close the modal
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
  
      // handle form submission and throws it to backend
      taskForm.addEventListener('submit', async (event) => {
          event.preventDefault();
  
          const title = document.querySelector('input[placeholder="Enter task title"]').value.trim();
          const description = document.querySelector('textarea[placeholder="Enter task description"]').value.trim();
          const dueDate = document.getElementById('dueDate').value;
          const startTime = document.querySelector('input[type="time"]:first-of-type').value;
          const endTime = document.querySelector('input[type="time"]:last-of-type').value;
          const taskColor = document.getElementById('colorPicker').value;
  
          // Vvlidate required fields i dont know why i add it even if its empty
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
                  alert("Task created successfully!");
  
                  // resets form field
                  document.querySelector('input[placeholder="Enter task title"]').value = '';
                  document.querySelector('textarea[placeholder="Enter task description"]').value = '';
                  document.getElementById('dueDate').value = '';
                  document.querySelector('input[type="time"]:first-of-type').value = '';
                  document.querySelector('input[type="time"]:last-of-type').value = '';
                  document.getElementById('colorPicker').value = '#000000'; 
  
              } else {
                  console.error(result.error || "An error occurred");
                  alert(result.error || "Could not create task.");
              }
          } catch (error) {
              console.error(error);
              alert("An unexpected error occurred.");
          }
      });