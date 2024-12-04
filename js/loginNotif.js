//still problematic will fix later

function createNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500';
    notification.innerHTML = `
        <div class="flex items-center space-x-4 p-4">
            <img class="h-8 w-8" src="https://www.svgrepo.com/show/326725/notifications-circle-outline.svg" alt="Logo">
            <div>
                <div class="text-xl font-medium text-black">System</div>
                <p class="text-slate-500">${message}</p>
            </div>
        </div>
    `;
    const notificationContainer = document.getElementById('notificationContainer');
    notificationContainer.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => notification.remove(), 5000);
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('../php/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    })
    .then(response => response.json())
    .then(data => {
        createNotification(data.message);

        if (data.success) {
            setTimeout(() => {
                window.location.href = "../html/dashboard.html";
            }, 2000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        createNotification('An error occurred. Please try again.');
    });
}

document.getElementById('loginButton').addEventListener('click', login);



