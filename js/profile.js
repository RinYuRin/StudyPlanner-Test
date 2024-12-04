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
        // Populate modal with user data, fallback to "Not set" for missing fields
        const defaultValue = "Not set";

        document.getElementById("username").innerText = data.name || defaultValue;
        document.getElementById("userstatus").innerText = data.status || defaultValue;
        document.getElementById("userschool").innerText = data.school || defaultValue;
        document.getElementById("usercourse").innerText = data.course || defaultValue;

        document.getElementById("useremail").innerText = data.email || defaultValue;
        document.getElementById("usercontact").innerText = data.contact || defaultValue;
        document.getElementById("useraddress").innerText = data.address || defaultValue;

        // Optionally set the profile picture if available in backend data
        const profilePic = document.getElementById("userpic");
        profilePic.src = data.profilePicture || "https://i.pravatar.cc/300";

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
