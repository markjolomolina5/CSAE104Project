
const startApp = () => {

    // ==========================================
    // SELECT HTML ELEMENTS
    // ==========================================

    const splash =
        document.getElementById("splash") ||
        document.querySelector(".splash");

    const navLogin = document.getElementById("navLogin");

    const authModal = document.getElementById("authModal");
    const closeModal = document.getElementById("closeModal");

    const logForm = document.getElementById("logForm");
    const regForm = document.getElementById("regForm");

    const logMsg = document.getElementById("logMsg");
    const regMsg = document.getElementById("regMsg");

    const welcomeView = document.getElementById("welcomeView");
    const welcomeText = document.getElementById("welcomeText");

    const switchToRegister =
        document.getElementById("switchToRegister");

    const switchToLogin =
        document.getElementById("switchToLogin");

    const logoutBtn = document.getElementById("logoutBtn");

    const noticeForm = document.getElementById("noticeForm");
    const noticeList = document.getElementById("noticeList");
    const noticeMsg = document.getElementById("noticeMsg");


    // ==========================================
    // SAFE LOCAL STORAGE
    // ==========================================

    const memory = {};

    const store = {

        get(key) {
            try {
                const value = localStorage.getItem(key);
                return value !== null ? value : (memory[key] ?? null);
            } catch {
                return memory[key] ?? null;
            }
        },

        set(key, value) {
            memory[key] = String(value);

            try {
                localStorage.setItem(key, String(value));
            } catch {
                // Memory fallback
            }
        },

        remove(key) {
            delete memory[key];

            try {
                localStorage.removeItem(key);
            } catch {
                // Memory fallback
            }
        }
    };


    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================

    const getUsers = () => {
        try {
            const users = JSON.parse(store.get("users") || "[]");
            return Array.isArray(users) ? users : [];
        } catch {
            return [];
        }
    };

    const getNotices = () => {
        try {
            const notices = JSON.parse(
                store.get("schoolNotices") || "[]"
            );

            return Array.isArray(notices) ? notices : [];
        } catch {
            return [];
        }
    };

    const getCurrentUser = () => {
        const email = store.get("currentUser");

        if (!email) return null;

        return getUsers().find(
            user => user.email === email
        ) || null;
    };

    const showMessage = (element, message, success = false) => {
        if (!element) return;

        element.textContent = message;
        element.style.color = success ? "#267a38" : "#c92a2a";
    };


    // ==========================================
    // SPLASH SCREEN - IMPROVED
    // ==========================================

    let splashHidden = false;

    const hideSplash = () => {

        if (splashHidden) return;

        splashHidden = true;

        if (!splash) return;

        // Start fade-out
        splash.classList.add("hidden");

        splash.style.opacity = "0";
        splash.style.visibility = "hidden";
        splash.style.pointerEvents = "none";

        // Completely remove splash screen
        setTimeout(() => {
            splash.remove();
        }, 450);
    };

    if (splash) {

        // Normal splash screen duration
        setTimeout(hideSplash, 800);

        // Backup in case the first timer is delayed
        setTimeout(hideSplash, 1500);

        // Allow user to skip splash screen
        splash.addEventListener("click", hideSplash);
    }


    // ==========================================
    // MODAL FUNCTIONS
    // ==========================================

    const openModal = (view = "login") => {

        if (!authModal) return;

        authModal.classList.remove("hidden");

        showMessage(logMsg, "");
        showMessage(regMsg, "");

        const user = getCurrentUser();

        if (user) {
            showWelcome(user.name);
        } else if (view === "register") {
            showRegisterForm();
        } else {
            showLoginForm();
        }
    };

    const closeModalWindow = () => {
        authModal?.classList.add("hidden");
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

        if (welcomeText) {
            welcomeText.textContent = `Welcome, ${name}!`;
        }

        welcomeView?.classList.remove("hidden");
        logForm?.classList.add("hidden");
        regForm?.classList.add("hidden");
    };


    // ==========================================
    // NAVIGATION LOGIN BUTTON
    // ==========================================

    navLogin?.addEventListener("click", (event) => {

        event.preventDefault();

        const user = getCurrentUser();

        openModal(user ? "welcome" : "login");
    });


    // ==========================================
    // CLOSE MODAL
    // ==========================================

    closeModal?.addEventListener(
        "click",
        closeModalWindow
    );

    authModal?.addEventListener("click", (event) => {

        if (event.target === authModal) {
            closeModalWindow();
        }

    });

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeModalWindow();
        }

    });


    // ==========================================
    // SWITCH LOGIN AND REGISTER
    // ==========================================

    switchToRegister?.addEventListener("click", (event) => {

        event.preventDefault();

        showRegisterForm();

    });

    switchToLogin?.addEventListener("click", (event) => {

        event.preventDefault();

        showLoginForm();

    });


    // ==========================================
    // REGISTER ACCOUNT
    // ==========================================

    regForm?.addEventListener("submit", (event) => {

        event.preventDefault();

        showMessage(regMsg, "");

        const form = regForm.elements;

        const name = form.name.value.trim();
        const email = form.email.value.trim().toLowerCase();
        const password = form.password.value;
        const confirm = form.confirm.value;

        try {

            if (!name || !email || !password || !confirm) {
                throw new Error("Please complete all fields.");
            }

            if (password.length < 8) {
                throw new Error(
                    "Password must contain at least 8 characters."
                );
            }

            if (password !== confirm) {
                throw new Error("Passwords do not match.");
            }

            const users = getUsers();

            const existingUser = users.some(
                user => user.email === email
            );

            if (existingUser) {
                throw new Error(
                    "This email is already registered."
                );
            }

            const newUser = {
                name: name,
                email: email,
                password: password
            };

            users.push(newUser);

            store.set("users", JSON.stringify(users));

            regForm.reset();

            showLoginForm();

            showMessage(
                logMsg,
                "Account created successfully! You can now log in.",
                true
            );

        } catch (error) {

            showMessage(regMsg, error.message);

        }

    });


    // ==========================================
    // LOGIN ACCOUNT
    // ==========================================

    logForm?.addEventListener("submit", (event) => {

        event.preventDefault();

        showMessage(logMsg, "");

        const form = logForm.elements;

        const email = form.email.value.trim().toLowerCase();
        const password = form.password.value;

        const users = getUsers();

        const user = users.find(
            account => account.email === email
        );

        if (!user) {

            showMessage(
                logMsg,
                "No account found with this email."
            );

            return;
        }

        if (user.password !== password) {

            showMessage(
                logMsg,
                "Incorrect password. Please try again."
            );

            return;
        }

        // Save the logged-in user's email
        store.set("currentUser", user.email);

        // Reset login form
        logForm.reset();

        // Update navbar
        if (navLogin) {
            navLogin.textContent = user.name;
        }

        // Show welcome screen
        showWelcome(user.name);

        showMessage(logMsg, "");

    });


    // ==========================================
    // LOGOUT ACCOUNT
    // ==========================================

    logoutBtn?.addEventListener("click", () => {

        store.remove("currentUser");

        if (navLogin) {
            navLogin.textContent = "Login";
        }

        showLoginForm();

        closeModalWindow();

    });


    // ==========================================
    // RESTORE LOGIN AFTER PAGE REFRESH
    // ==========================================

    const savedUser = getCurrentUser();

    if (savedUser) {

        if (navLogin) {
            navLogin.textContent = savedUser.name;
        }

    } else {

        store.remove("currentUser");

        if (navLogin) {
            navLogin.textContent = "Login";
        }

    }


    // ==========================================
    // DISPLAY SAVED NOTICES
    // ==========================================

    const renderNotices = () => {

        if (!noticeList) return;

        noticeList
            .querySelectorAll("[data-saved-notice]")
            .forEach(element => element.remove());

        const notices = getNotices();

        notices.slice().reverse().forEach(notice => {

            const article = document.createElement("article");
            article.className = "notice";
            article.dataset.savedNotice = "true";

            const heading = document.createElement("h3");
            heading.textContent = notice.title;

            const meta = document.createElement("p");
            meta.className = "meta";

            const date = document.createElement("time");
            date.dateTime = notice.date;
            date.textContent = notice.date;

            const separator = document.createTextNode(" · ");

            const tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = notice.category;

            meta.append(date, separator, tag);

            const message = document.createElement("p");
            message.textContent = notice.message;

            const author = document.createElement("p");
            author.className = "meta";
            author.textContent = `Posted by: ${notice.author}`;

            article.append(
                heading,
                meta,
                message,
                author
            );

            noticeList.appendChild(article);

        });

    };

    renderNotices();


    // ==========================================
    // POST A SCHOOL NOTICE
    // ==========================================

    noticeForm?.addEventListener("submit", (event) => {

        event.preventDefault();

        showMessage(noticeMsg, "");

        // Require login before posting
        const user = getCurrentUser();

        if (!user) {

            showMessage(
                noticeMsg,
                "Please log in before posting a notice."
            );

            openModal("login");

            return;
        }

        const form = noticeForm.elements;

        const title = form.title.value.trim();
        const category = form.category.value;
        const date = form.date.value;
        const message = form.message.value.trim();
        const email = form.email.value.trim().toLowerCase();

        if (!title || !date || !message || !email) {

            showMessage(
                noticeMsg,
                "Please complete all notice fields."
            );

            return;
        }

        if (email !== user.email) {

            showMessage(
                noticeMsg,
                "Please use the email address of your logged-in account."
            );

            return;
        }

        const notices = getNotices();

        notices.push({

            title: title,
            category: category,
            date: date,
            message: message,
            author: user.name,
            email: user.email

        });

        store.set(
            "schoolNotices",
            JSON.stringify(notices)
        );

        noticeForm.reset();

        renderNotices();

        showMessage(
            noticeMsg,
            "Your notice was successfully posted!",
            true
        );

    });

};


// ==========================================
// START APPLICATION SAFELY
// ==========================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        startApp,
        { once: true }
    );

} else {

    startApp();

}
