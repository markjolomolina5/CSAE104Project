
const splash = document.querySelector("#splash");
const navLogin = document.querySelector("#navLogin");
const authModal = document.querySelector("#authModal");
const closeModal = document.querySelector("#closeModal");

const logForm = document.querySelector("#logForm");
const regForm = document.querySelector("#regForm");
const welcomeView = document.querySelector("#welcomeView");

const logMsg = document.querySelector("#logMsg");
const regMsg = document.querySelector("#regMsg");
const hello = document.querySelector("#welcomeText");

const switchToRegister = document.querySelector("#switchToRegister");
const switchToLogin = document.querySelector("#switchToLogin");
const logoutBtn = document.querySelector("#logoutBtn");

// Safe storage with fallback
const memory = {};

const store = {
    get(key) {
        try {
            return localStorage.getItem(key) ?? memory[key] ?? null;
        } catch {
            return memory[key] ?? null;
        }
    },

    set(key, value) {
        memory[key] = value;

        try {
            localStorage.setItem(key, value);
        } catch {
            // Use memory storage as fallback
        }
    }
};

// Splash screen
const hideSplash = () => {
    if (splash) {
        splash.classList.add("hidden");
    }
};

setTimeout(hideSplash, 2000);

if (splash) {
    splash.addEventListener("click", hideSplash);
}

// Modal controls
const closeModalWindow = () => {
    if (authModal) {
        authModal.classList.add("hidden");
    }
};

const showLoginForm = () => {
    logForm?.classList.remove("hidden");
    regForm?.classList.add("hidden");
    welcomeView?.classList.add("hidden");
};

const showRegisterForm = () => {
    regForm?.classList.remove("hidden");
    logForm?.classList.add("hidden");
    welcomeView?.classList.add("hidden");
};

const showWelcome = (name) => {
    if (hello) {
        hello.textContent = `Welcome, ${name}!`;
    }

    welcomeView?.classList.remove("hidden");
    logForm?.classList.add("hidden");
    regForm?.classList.add("hidden");
};

const openModal = (view = "login") => {
    if (!authModal) return;

    authModal.classList.remove("hidden");

    if (logMsg) logMsg.textContent = "";
    if (regMsg) regMsg.textContent = "";

    const loggedUser = store.get("currentUser");

    if (loggedUser) {
        showWelcome(loggedUser);
    } else if (view === "register") {
        showRegisterForm();
    } else {
        showLoginForm();
    }
};

// Navbar login button
navLogin?.addEventListener("click", (e) => {
    e.preventDefault();

    const loggedUser = store.get("currentUser");

    openModal(loggedUser ? "welcome" : "login");
});

// Close modal
closeModal?.addEventListener("click", closeModalWindow);

authModal?.addEventListener("click", (e) => {
    if (e.target === authModal) {
        closeModalWindow();
    }
});

// Switch between login and registration
switchToRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    showRegisterForm();
});

switchToLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginForm();
});

// Get registered users
const getUsers = () => {
    try {
        const users = JSON.parse(store.get("users") || "[]");
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
};

// Registration
regForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (regMsg) {
        regMsg.textContent = "";
    }

    const f = regForm.elements;

    try {
        const name = f.name.value.trim();
        const email = f.email.value.trim().toLowerCase();
        const password = f.password.value;
        const confirm = f.confirm.value;

        if (!name) {
            throw new Error("Please enter your name.");
        }

        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters.");
        }

        if (password !== confirm) {
            throw new Error("Passwords do not match.");
        }

        const currentUsers = getUsers();

        if (currentUsers.some((u) => u.email === email)) {
            throw new Error("Email already registered.");
        }

        const users = [
            ...currentUsers,
            {
                name,
                email,
                password
            }
        ];

        store.set("users", JSON.stringify(users));

        regForm.reset();
        showLoginForm();

        if (logMsg) {
            logMsg.style.color = "var(--brand)";
            logMsg.textContent = "Account created! Please log in.";
        }

    } catch (error) {
        if (regMsg) {
            regMsg.style.color = "#c92a2a";
            regMsg.textContent = error.message;
        }
    }
});

// Login
logForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (logMsg) {
        logMsg.style.color = "#c92a2a";
        logMsg.textContent = "";
    }

    const f = logForm.elements;

    const email = f.email.value.trim().toLowerCase();
    const password = f.password.value;

    const users = getUsers();

    const user = users.find((u) => u.email === email);

    if (!user) {
        logMsg.textContent = "No account found with this email.";
        return;
    }

    if (user.password !== password) {
        logMsg.textContent = "Incorrect password.";
        return;
    }

    store.set("currentUser", user.name);

    logForm.reset();
    showWelcome(user.name);

    if (navLogin) {
        navLogin.textContent = user.name;
    }
});

// Logout
logoutBtn?.addEventListener("click", () => {
    store.set("currentUser", "");

    if (navLogin) {
        navLogin.textContent = "Login";
    }

    showLoginForm();
    closeModalWindow();
});

// Close modal using Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModalWindow();
    }
});

// Check login state when page loads
document.addEventListener("DOMContentLoaded", () => {
    const loggedUser = store.get("currentUser");

    if (loggedUser && navLogin) {
        navLogin.textContent = loggedUser;
    }
});
