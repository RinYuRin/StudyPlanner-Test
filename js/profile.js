// Dropdown Visibility
const profileDropdownButton = document.getElementById("profile-dropdown-button");
const dropdownMenu = document.getElementById("dropdown-menu");

profileDropdownButton.addEventListener("click", () => {
  dropdownMenu.classList.toggle("hidden");
});

// Close dropdown when clicked outside
document.addEventListener("click", (event) => {
  if (
    !profileDropdownButton.contains(event.target) &&
    !dropdownMenu.contains(event.target)
  ) {
    dropdownMenu.classList.add("hidden");
  }
});

// Profile Modal Elements
const profileModal = document.getElementById("profile-modal");
const closeModal = document.getElementById("close-modal");
const openProfileModal = document.getElementById("open-profile-modal");

// Open Modal and Fetch User Data
openProfileModal.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default link behavior

  // Fetch user data from backend
  fetch("../php/fetch_user.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        // Populate modal with user data, using field-specific placeholders for missing data
        document.getElementById("username").innerText =
          data.username || "Set name";
        document.getElementById("userstatus").innerText =
          data.userstatus || "Set status";
        document.getElementById("userschool").innerText =
          data.school || "Set school";
        document.getElementById("usercourse").innerText =
          data.usercourse || "Set course";
        document.getElementById("useremail").innerText =
          data.email || "Set email";
        document.getElementById("usercontact").innerText =
          data.usercontact || "Set contact";
        document.getElementById("useraddress").innerText =
          data.useraddress || "Set address";

        // Show the modal
        profileModal.classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      alert("Failed to load profile data. Please try again.");
    });
});

// Close Modal
closeModal.addEventListener("click", () => {
  profileModal.classList.add("hidden");
});
