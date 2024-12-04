document.addEventListener("DOMContentLoaded", () => {
   const modal = document.getElementById("course-modal");
   const openModalButton = document.getElementById("course-add");
   const closeModalButton = document.getElementById("modal-close");
   const cancelButton = document.getElementById("cancel-button");
   const courseForm = document.getElementById("course-form");
   const coursesContainer = document.querySelector("main .flex.space-x-4");

   let courseCount = 0;
   const maxCourses = 6;

   openModalButton.addEventListener("click", () => {
       if (courseCount >= maxCourses) {
           alert("Maximum of 6 courses reached!");
           return;
       }
       modal.classList.remove("hidden");
   });

   const closeModal = () => {
       modal.classList.add("hidden");
       courseForm.reset();
   };
   closeModalButton.addEventListener("click", closeModal);
   cancelButton.addEventListener("click", closeModal);

   // convert file to Base64
   const toBase64 = (file) => {
       return new Promise((resolve, reject) => {
           const reader = new FileReader();
           reader.readAsDataURL(file);
           reader.onload = () => resolve(reader.result);
           reader.onerror = (error) => reject(error);
       });
   };

   //add cousre 
   courseForm.addEventListener("submit", async (e) => {
       e.preventDefault();

       const courseTitle = document.getElementById("course-title").value;
       const coursePictureInput = document.getElementById("course-picture");
       let coursePicture = null;

       if (coursePictureInput.files.length > 0) {
           coursePicture = await toBase64(coursePictureInput.files[0]);
       }

       const payload = {
           courseTitle,
           ...(coursePicture && { coursePicture }),
       };

       try {
           const response = await fetch("../php/create_course.php", {
               method: "POST",
               headers: {
                   "Content-Type": "application/json",
               },
               body: JSON.stringify(payload),
           });

           const result = await response.json();

           if (response.ok) {
               alert("Course added successfully!");

               const courseButton = document.createElement("button");
               courseButton.className = "bg-teal-500 text-white px-4 py-2 rounded-md";
               courseButton.textContent = courseTitle;

               coursesContainer.appendChild(courseButton);

               courseCount++;
               closeModal();
           } else {
               alert(result.error || "Failed to add course.");
           }
       } catch (error) {
           console.error("Error adding course:", error);
           alert("An error occurred. Please try again.");
       }
   });
});

document.addEventListener("DOMContentLoaded", async () => {
   const coursesContainer = document.querySelector("main .flex.space-x-4");
   const lessonsList = document.getElementById("lessons-list");

   const fetchCourses = async () => {
       try {
           const response = await fetch("../php/fetch_course.php");
           if (!response.ok) {
               throw new Error("Failed to fetch courses.");
           }
           const courses = await response.json();
           return courses;
       } catch (error) {
           console.error("Error fetching courses:", error);
           return [];
       }
   };

   const fetchLessons = async (courseId) => {
       try {
           const response = await fetch("../php/get_lesson.php", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ courseId }),
           });
           if (!response.ok) {
               throw new Error("Failed to fetch lessons.");
           }
           return await response.json();
       } catch (error) {
           console.error("Error fetching lessons:", error);
           return [];
       }
   };

   const renderCourses = (courses) => {
       courses.forEach((course) => {
           const courseButton = document.createElement("button");
           courseButton.className = "bg-teal-500 text-white px-4 py-2 rounded-md";
           courseButton.textContent = course.courseTitle;
           courseButton.dataset.courseId = course.courseId;

           courseButton.addEventListener("click", async () => {
               const courseId = courseButton.dataset.courseId;
               const lessons = await fetchLessons(courseId);
               renderLessons(lessons, course.coursePicture);
           });

           coursesContainer.appendChild(courseButton);
       });
   };

   const renderLessons = (lessons, coursePicture) => {
    lessonsList.innerHTML = "";
    const imageSrc = coursePicture || "https://via.placeholder.com/40x40";
    lessons.forEach((lesson) => {
        const lessonCard = document.createElement("div");
        lessonCard.className = "p-4 mb-4 bg-teal-300 rounded-lg shadow-sm";

        lessonCard.innerHTML = `
            <div class="flex mb-2 items-center">
                <img src="${imageSrc}" alt="Lesson Icon" class="rounded-full mr-2 w-10 h-10">
                <h3 class="text-lg font-medium">${lesson.lessonTitle}</h3>
                <div class="ml-auto flex items-center space-x-2">
                    <i class="fas fa-star text-yellow-500"></i>
                    <i class="fas fa-trash"></i>
                </div>
            </div>
            <p class="text-teal-700">${lesson.lessonDescription}</p>
        `;
        lessonsList.appendChild(lessonCard);
    });
};

   const courses = await fetchCourses();
   renderCourses(courses);
});

