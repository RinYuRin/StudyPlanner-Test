document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("course-modal");
    const openModalButton = document.getElementById("course-add");
    const closeModalButton = document.getElementById("modal-close");
    const cancelButton = document.getElementById("cancel-button");
    const courseForm = document.getElementById("course-form");
    const coursesContainer = document.querySelector("main .flex.space-x-4");

    let courseCount = 0;
    const maxCourses = 6;

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
        }, 3000);
    };

    openModalButton.addEventListener("click", () => {
        if (courseCount >= maxCourses) {
            showToast("Maximum of 6 courses reached!");
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

    // Convert file to Base64
    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Add course
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
                showToast("Course added successfully!"); // Show toast

                const courseButton = document.createElement("button");
                courseButton.className = "bg-teal-500 text-white px-4 py-2 rounded-md";
                courseButton.textContent = courseTitle;

                coursesContainer.appendChild(courseButton);

                courseCount++;
                closeModal();
            } else {
                showToast(result.error || "Failed to add course."); // Show error toast
            }
        } catch (error) {
            console.error("Error adding course:", error);
            showToast("An error occurred. Please try again."); // Show error toast
        }
    });
});


document.addEventListener("DOMContentLoaded", async () => {
    const coursesContainer = document.querySelector("main .flex.space-x-4");
    const lessonsList = document.getElementById("lessons-list");
    let currentCourseId = null; // Track the currently selected course

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
                currentCourseId = courseButton.dataset.courseId; // Set the current course ID
                const lessons = await fetchLessons(currentCourseId);
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
                <div class="flex mb-2 items-center cursor-pointer">
                    <img src="${imageSrc}" alt="Lesson Icon" class="rounded-full mr-2 w-10 h-10">
                    <h3 class="text-lg font-medium">${lesson.lessonTitle}</h3>
                    <div class="ml-auto flex items-center space-x-2">
                        <i class="fas fa-star ${
                            lesson.starred === "yes" ? "text-yellow-500" : ""
                        }" data-lesson-id="${lesson.lessonId}"></i>
                        <i class="fas fa-trash text-black-400 hover:text-red-800 transition-all duration-300" data-lesson-id="${lesson.lessonId}"></i>
                    </div>
                </div>
                <p class="text-teal-700">${lesson.lessonDescription}</p>
            `;
            lessonsList.appendChild(lessonCard);
        });

        attachStarEventListeners();
        attachDeleteEventListeners();
    };

    const attachStarEventListeners = () => {
        document.querySelectorAll(".fa-star").forEach((starIcon) => {
            starIcon.addEventListener("click", async (e) => {
                const lessonId = e.target.getAttribute("data-lesson-id");
                const isStarred = e.target.classList.toggle("text-yellow-500"); // Toggle yellow color
                try {
                    const response = await fetch("../php/update_lesson_star.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            lessonId: lessonId,
                            starred: isStarred ? "yes" : "no",
                        }),
                    });
                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.error || "Failed to update star status");
                    }
                } catch (error) {
                    console.error("Error updating star status:", error);
                    // Revert the toggle on error
                    e.target.classList.toggle("text-yellow-500", !isStarred);
                }
            });
        });
    };

    const attachDeleteEventListeners = () => {
        document.querySelectorAll(".fa-trash").forEach((deleteIcon) => {
            deleteIcon.addEventListener("click", async (e) => {
                const lessonId = e.target.getAttribute("data-lesson-id");
                if (confirm("Are you sure you want to delete this lesson?")) {
                    try {
                        const response = await fetch("../php/delete_lesson.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ lessonId }),
                        });
                        const result = await response.json();
                        if (!response.ok) {
                            throw new Error(result.error || "Failed to delete lesson");
                        }
    
                        // Show toast notification
                        showToast("Lesson Deleted Successfully!");
    
                        // Re-fetch and re-render lessons after deletion
                        const lessons = await fetchLessons(currentCourseId);
                        renderLessons(lessons);
                    } catch (error) {
                        console.error("Error deleting lesson:", error);
                        alert("Failed to delete the lesson. Please try again.");
                    }
                }
            });
        });
    };
    
    // Function to show toast notification
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
        }, 8000);
    };
    
    

    const courses = await fetchCourses();
    renderCourses(courses);
});
