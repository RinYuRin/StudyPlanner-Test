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
             alert("The Note is Added Successfully");
 
             noteTitleInput.value = "";
             noteDescriptionInput.value = "";
             courseDropdown.value = ""; 
             notesModal.classList.add("hidden");
          } catch (error) {
             console.error("Error adding note:", error);
          }
       }
    });
 });
 
 
 