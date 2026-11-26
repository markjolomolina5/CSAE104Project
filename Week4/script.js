
document.addEventListener("DOMContentLoaded", function () {

    // SPLASH SCREEN: hide after 1.5 seconds
    const splash = document.getElementById("splash-screen");

    if (splash) {
        setTimeout(function () {
            splash.classList.add("hidden");
        }, 1500);
    }

    // CURRENT YEAR
    document.getElementById("current-year").textContent =
        new Date().getFullYear();

    // ELEMENTS
    const authButton = document.getElementById("auth-button");
    const authModal = document.getElementById("auth-modal");
    const closeModal = document.getElementById("close-modal");

    const loginSection = document.getElementById("login-section");
    const registerSection = document.getElementById("register-section");

    const showRegister = document.getElementById("show-register");
    const showLogin = document.getElementById("show-login");

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const noticeForm = document.getElementById("notice-form");

    const authMessage = document.getElementById("auth-message");
    const postMessage = document.getElementById("post-message");

    const noticeList = document.getElementById("notice-list");

    // STORAGE HELPERS
    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem("schoolUsers")) || [];
        } catch {
            return [];
        }
    }

    function getNotices() {
        try {
            return JSON.parse(localStorage.getItem("schoolNotices")) || [];
        } catch {
            return [];
        }
    }

    function getCurrentUser() {
        return localStorage.getItem("schoolCurrentUser");
    }

    function saveUsers(users) {
        localStorage.setItem("schoolUsers", JSON.stringify(users));
    }

    function saveNotices(notices) {
        localStorage.setItem("schoolNotices", JSON.stringify(notices));
    }

    // AUTH MODAL
    function openModal() {
        authMessage.textContent = "";
        authModal.classList.add("show");
    }

    function closeAuthModal() {
        authModal.classList.remove("show");
    }

    function showLoginForm() {
        loginSection.classList.remove("hidden");
        registerSection.classList.add("hidden");
        authMessage.textContent = "";
    }

    function showRegisterForm() {
        registerSection.classList.remove("hidden");
        loginSection.classList.add("hidden");
        authMessage.textContent = "";
    }

    authButton.addEventListener("click", function () {
        if (getCurrentUser()) {
            logout();
        } else {
            showLoginForm();
            openModal();
        }
    });

    closeModal.addEventListener("click", closeAuthModal);

    authModal.addEventListener("click", function (event) {
        if (event.target === authModal) {
            closeAuthModal();
        }
    });

    showRegister.addEventListener("click", function (event) {
        event.preventDefault();
        showRegisterForm();
    });

    showLogin.addEventListener("click", function (event) {
        event.preventDefault();
        showLoginForm();
    });

    // REGISTER
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document
            .getElementById("register-username")
            .value.trim();

        const password = document
            .getElementById("register-password")
            .value;

        if (username.length < 3 || password.length < 6) {
            authMessage.textContent =
                "Username must have 3 characters and password 6 characters minimum.";
            return;
        }

        const users = getUsers();

        const exists = users.some(function (user) {
            return user.username.toLowerCase() === username.toLowerCase();
        });

        if (exists) {
            authMessage.textContent = "Username already exists.";
            return;
        }

        users.push({
            username: username,
            password: password
        });

        saveUsers(users);

        authMessage.textContent =
            "Registration successful! You can now log in.";

        registerForm.reset();
        showLoginForm();
    });

    // LOGIN
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document
            .getElementById("login-username")
            .value.trim();

        const password = document
            .getElementById("login-password")
            .value;

        const users = getUsers();

        const user = users.find(function (item) {
            return item.username.toLowerCase() === username.toLowerCase()
                && item.password === password;
        });

        if (!user) {
            authMessage.textContent = "Incorrect username or password.";
            return;
        }

        localStorage.setItem("schoolCurrentUser", user.username);

        loginForm.reset();
        authMessage.textContent = "";

        closeAuthModal();
        updateAuthButton();

        alert("Welcome, " + user.username + "!");
    });

    // LOGOUT
    function logout() {
        localStorage.removeItem("schoolCurrentUser");
        updateAuthButton();
        alert("You have successfully logged out.");
    }

    // UPDATE LOGIN BUTTON
    function updateAuthButton() {
        const username = getCurrentUser();

        if (username) {
            authButton.textContent = "Logout (" + username + ")";
        } else {
            authButton.textContent = "Login / Register";
        }
    }

    // DISPLAY NOTICES
    function renderNotices() {
        const notices = getNotices();

        noticeList.innerHTML = "";

        if (notices.length === 0) {
            noticeList.innerHTML =
                '<p class="empty-message">No announcements yet.</p>';
            return;
        }

        notices.slice().reverse().forEach(function (notice) {
            const card = document.createElement("article");
            card.className = "notice-card";

            const title = document.createElement("h3");
            title.textContent = notice.title;

            const content = document.createElement("p");
            content.textContent = notice.content;

            const date = document.createElement("p");
            date.className = "notice-date";
            date.textContent = "Posted by " + notice.author +
                " • " + notice.date;

            card.appendChild(title);
            card.appendChild(content);
            card.appendChild(date);

            noticeList.appendChild(card);
        });
    }

    // POST NOTICE
    noticeForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const currentUser = getCurrentUser();

        if (!currentUser) {
            postMessage.textContent =
                "Please log in before posting an announcement.";
            postMessage.style.color = "red";
            return;
        }

        const title = document.getElementById("notice-title").value.trim();
        const content = document.getElementById("notice-content").value.trim();

        if (!title || !content) {
            postMessage.textContent = "Please complete all fields.";
            postMessage.style.color = "red";
            return;
        }

        const notices = getNotices();

        notices.push({
            title: title,
            content: content,
            author: currentUser,
            date: new Date().toLocaleString()
        });

        saveNotices(notices);

        noticeForm.reset();
        renderNotices();

        postMessage.textContent = "Announcement published successfully!";
        postMessage.style.color = "green";

        setTimeout(function () {
            postMessage.textContent = "";
        }, 3000);
    });

    // INITIALIZE
    updateAuthButton();
    renderNotices();

});
