document.addEventListener("DOMContentLoaded", () => {
   const notesModal = document.getElementById("notes-modal");
   const notesForm = document.getElementById("notes-form");
   const noteTitleInput = document.getElementById("note-title");
   const noteDescriptionInput = document.getElementById("note-description");
   const courseDropdown = document.getElementById("course-dropdown");
   const addNotesButton = document.querySelector(".hover\\:bg-teal-300");
   const closeModalButtons = [
       document.getElementById("notes-modal-close"),
       document.getElementById("notes-cancel-button"),
   ];

   const showToast = (message) => {
       const toastContainer = document.createElement("div");
       toastContainer.style.position = "fixed";
       toastContainer.style.top = "1rem";
       toastContainer.style.right = "1rem";
       toastContainer.style.zIndex = "1000"; // Ensure it's above other elements
       toastContainer.innerHTML = `
           <div id="toast-success" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
               <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
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
       const closeButton = toastContainer.querySelector("button[aria-label='Close']");
       closeButton.addEventListener("click", () => {
           toastContainer.remove();
       });

       // Automatically remove the toast after 3 seconds
       setTimeout(() => {
           toastContainer.remove();
       }, 5000);
   };

   addNotesButton.addEventListener("click", () => {
       notesModal.classList.remove("hidden");
   });

   closeModalButtons.forEach((button) => {
       button.addEventListener("click", () => {
           notesModal.classList.add("hidden");
       });
   });

   // Fetch course titles from the backend
   async function fetchCourses() {
       try {
           const response = await fetch("../php/get_course.php");
           const courses = await response.json();

           if (courses.success) {
               // Populate the dropdown
               courses.data.forEach(course => {
                   const option = document.createElement("option");
                   option.value = course.courseId;
                   option.textContent = course.courseTitle;
                   courseDropdown.appendChild(option);
               });
           } else {
               console.error("Error fetching courses:", courses.error);
           }
       } catch (error) {
           console.error("Error fetching courses:", error);
       }
   }

   fetchCourses();

   // Handle form submission
   notesForm.addEventListener("submit", async (e) => {
       e.preventDefault();
       const noteTitle = noteTitleInput.value.trim();
       const noteDescription = noteDescriptionInput.value.trim();
       const selectedCourse = courseDropdown.value;

       if (noteTitle && noteDescription && selectedCourse) {
           try {
               const response = await fetch("../php/create_note.php", {
                   method: "POST",
                   body: JSON.stringify({
                       noteTitle,
                       noteDescription,
                       courseId: selectedCourse
                   }),
                   headers: {
                       "Content-Type": "application/json",
                   },
               });

               if (!response.ok) {
                   throw new Error("Failed to save the note to the server.");
               }

               console.log("Note added successfully.");
               showToast("Note added successfully!"); // Show toast

               noteTitleInput.value = "";
               noteDescriptionInput.value = "";
               courseDropdown.value = ""; 
               notesModal.classList.add("hidden");
           } catch (error) {
               console.error("Error adding note:", error);
               showToast("Failed to add note."); // Show error toast
           }
       }
   });
});

 
 
 