
document.addEventListener("DOMContentLoaded", function () {

    // Splash Screen
   document.addEventListener("DOMContentLoaded", function () {
    const splash = document.getElementById("splash");

    if (!splash) return;

    setTimeout(function () {
        splash.remove();
    }, 1000);
});
window.addEventListener("load", function () {
    setTimeout(hideSplashScreen, 1000);
});

    // Elements
    const navLogin = document.getElementById("navLogin");
    const authModal = document.getElementById("authModal");
    const closeModal = document.getElementById("closeModal");

    const logForm = document.getElementById("logForm");
    const regForm = document.getElementById("regForm");
    const welcomeView = document.getElementById("welcomeView");

    const switchToRegister = document.getElementById("switchToRegister");
    const switchToLogin = document.getElementById("switchToLogin");
    const logoutBtn = document.getElementById("logoutBtn");

    const noticeForm = document.getElementById("noticeForm");
    const noticeList = document.getElementById("noticeList");

    // Account Storage
    let accounts = [];

    try {
        accounts = JSON.parse(localStorage.getItem("schoolAccounts")) || [];
    } catch (error) {
        accounts = [];
    }

    let currentUser = null;

    try {
        currentUser = JSON.parse(localStorage.getItem("schoolCurrentUser"));
    } catch (error) {
        currentUser = null;
    }

    // Modal Functions
    function openModal() {
        authModal.classList.remove("hidden");
        showLogin();
    }

    function closeAuthModal() {
        authModal.classList.add("hidden");
    }

    function showLogin() {
        logForm.classList.remove("hidden");
        regForm.classList.add("hidden");
        welcomeView.classList.add("hidden");
    }

    function showRegister() {
        logForm.classList.add("hidden");
        regForm.classList.remove("hidden");
        welcomeView.classList.add("hidden");
    }

    function showWelcome(user) {
        logForm.classList.add("hidden");
        regForm.classList.add("hidden");
        welcomeView.classList.remove("hidden");

        document.getElementById("welcomeText").textContent =
            "Welcome, " + user.name + "!";
    }

    function updateLoginLink() {
        navLogin.textContent = currentUser ? "My Account" : "Login";
    }

    navLogin.addEventListener("click", function (event) {
        event.preventDefault();

        openModal();

        if (currentUser) {
            showWelcome(currentUser);
        }
    });

    closeModal.addEventListener("click", closeAuthModal);

    authModal.addEventListener("click", function (event) {
        if (event.target === authModal) {
            closeAuthModal();
        }
    });

    switchToRegister.addEventListener("click", function (event) {
        event.preventDefault();
        showRegister();
    });

    switchToLogin.addEventListener("click", function (event) {
        event.preventDefault();
        showLogin();
    });

    // Registration
    regForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim().toLowerCase();
        const password = document.getElementById("regPassword").value;
        const confirm = document.getElementById("regConfirm").value;
        const regMsg = document.getElementById("regMsg");

        if (password.length < 8) {
            regMsg.textContent = "Password must be at least 8 characters.";
            return;
        }

        if (password !== confirm) {
            regMsg.textContent = "Passwords do not match.";
            return;
        }

        if (accounts.some(account => account.email === email)) {
            regMsg.textContent = "This email is already registered.";
            return;
        }

        const newAccount = { name, email, password };

        accounts.push(newAccount);
        localStorage.setItem("schoolAccounts", JSON.stringify(accounts));

        regMsg.textContent = "Registration successful! You can now log in.";
        regForm.reset();
        showLogin();
    });

    // Login
    logForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("logEmail").value.trim().toLowerCase();
        const password = document.getElementById("logPassword").value;
        const logMsg = document.getElementById("logMsg");

        const account = accounts.find(function (user) {
            return user.email === email && user.password === password;
        });

        if (!account) {
            logMsg.textContent = "Incorrect email or password.";
            return;
        }

        currentUser = {
            name: account.name,
            email: account.email
        };

        localStorage.setItem("schoolCurrentUser", JSON.stringify(currentUser));

        logMsg.textContent = "";
        showWelcome(currentUser);
        updateLoginLink();
        logForm.reset();
    });

    // Logout
    logoutBtn.addEventListener("click", function () {
        currentUser = null;
        localStorage.removeItem("schoolCurrentUser");

        updateLoginLink();
        closeAuthModal();
        showLogin();
    });

    // Restore Login
    if (currentUser && !accounts.some(account => account.email === currentUser.email)) {
        currentUser = null;
        localStorage.removeItem("schoolCurrentUser");
    }

    updateLoginLink();

    // Post Notice
    noticeForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;
        const message = document.getElementById("message").value.trim();
        const email = document.getElementById("noticeEmail").value.trim();

        const noticeMsg = document.getElementById("noticeMsg");

        if (!title || !date || !message || !email) {
            noticeMsg.textContent = "Please complete all fields.";
            return;
        }

        const article = document.createElement("article");
        article.className = "notice";

        const heading = document.createElement("h3");
        heading.textContent = title;

        const meta = document.createElement("p");
        meta.className = "meta";

        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = category;

        meta.append(
            document.createTextNode(date + " · "),
            tag
        );

        const description = document.createElement("p");
        description.textContent = message;

        article.append(heading, meta, description);
        noticeList.prepend(article);

        noticeMsg.textContent = "Your notice has been posted successfully!";
        noticeForm.reset();
    });

});
