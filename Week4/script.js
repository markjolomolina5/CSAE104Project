
document.addEventListener("DOMContentLoaded", () => {

  // =====================================
  // GET HTML ELEMENTS
  // =====================================

  const splash = document.getElementById("splash");
  const navLogin = document.getElementById("navLogin");

  const authModal = document.getElementById("authModal");
  const closeModal = document.getElementById("closeModal");

  const logForm = document.getElementById("logForm");
  const regForm = document.getElementById("regForm");

  const welcomeView = document.getElementById("welcomeView");
  const welcomeText = document.getElementById("welcomeText");

  const logMsg = document.getElementById("logMsg");
  const regMsg = document.getElementById("regMsg");

  const switchToRegister = document.getElementById("switchToRegister");
  const switchToLogin = document.getElementById("switchToLogin");

  const logoutBtn = document.getElementById("logoutBtn");

  const noticeForm = document.getElementById("noticeForm");
  const noticeList = document.getElementById("noticeList");
  const noticeMsg = document.getElementById("noticeMsg");

  // =====================================
  // SAFE STORAGE
  // =====================================

  const memory = {};

  const store = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return memory[key] ?? null;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        memory[key] = value;
      }
    }
  };

  // =====================================
  // SPLASH SCREEN
  // =====================================

  const hideSplash = () => {
    if (splash) {
      splash.classList.add("hidden");
    }
  };

  setTimeout(hideSplash, 2000);

  if (splash) {
    splash.addEventListener("click", hideSplash);
  }

  // =====================================
  // USER STORAGE
  // =====================================

  const getUsers = () => {
    try {
      return JSON.parse(store.get("users") || "[]");
    } catch {
      return [];
    }
  };

  const getCurrentUser = () => {
    return store.get("currentUser") || "";
  };

  // =====================================
  // MODAL FUNCTIONS
  // =====================================

  const showLoginForm = () => {
    logForm.classList.remove("hidden");
    regForm.classList.add("hidden");
    welcomeView.classList.add("hidden");
  };

  const showRegisterForm = () => {
    regForm.classList.remove("hidden");
    logForm.classList.add("hidden");
    welcomeView.classList.add("hidden");
  };

  const showWelcome = (name) => {
    welcomeText.textContent = `Welcome, ${name}!`;

    welcomeView.classList.remove("hidden");
    logForm.classList.add("hidden");
    regForm.classList.add("hidden");
  };

  const openModal = () => {
    authModal.classList.remove("hidden");

    logMsg.textContent = "";
    regMsg.textContent = "";

    const currentUser = getCurrentUser();

    if (currentUser) {
      showWelcome(currentUser);
    } else {
      showLoginForm();
    }
  };

  const closeModalWindow = () => {
    authModal.classList.add("hidden");
  };

  // =====================================
  // LOGIN NAVIGATION BUTTON
  // =====================================

  navLogin.addEventListener("click", (event) => {
    event.preventDefault();
    openModal();
  });

  // =====================================
  // CLOSE MODAL
  // =====================================

  closeModal.addEventListener("click", closeModalWindow);

  authModal.addEventListener("click", (event) => {
    if (event.target === authModal) {
      closeModalWindow();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !authModal.classList.contains("hidden")
    ) {
      closeModalWindow();
    }
  });

  // =====================================
  // SWITCH LOGIN AND REGISTER
  // =====================================

  switchToRegister.addEventListener("click", (event) => {
    event.preventDefault();

    regMsg.textContent = "";
    showRegisterForm();
  });

  switchToLogin.addEventListener("click", (event) => {
    event.preventDefault();

    logMsg.textContent = "";
    showLoginForm();
  });

  // =====================================
  // REGISTER ACCOUNT
  // =====================================

  regForm.addEventListener("submit", (event) => {
    event.preventDefault();

    regMsg.textContent = "";
    regMsg.style.color = "#c92a2a";

    const name = regForm.elements["name"].value.trim();

    const email = regForm.elements["email"]
      .value.trim().toLowerCase();

    const password = regForm.elements["password"].value;

    const confirm = regForm.elements["confirm"].value;

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
        throw new Error("This email is already registered.");
      }

      users.push({
        name: name,
        email: email,
        password: password
      });

      store.set("users", JSON.stringify(users));

      regForm.reset();

      showLoginForm();

      logMsg.style.color = "var(--brand)";
      logMsg.textContent =
        "Account created successfully! Please log in.";

    } catch (error) {
      regMsg.textContent = error.message;
    }
  });

  // =====================================
  // LOGIN ACCOUNT
  // =====================================

  logForm.addEventListener("submit", (event) => {
    event.preventDefault();

    logMsg.style.color = "#c92a2a";
    logMsg.textContent = "";

    const email = logForm.elements["email"]
      .value.trim().toLowerCase();

    const password = logForm.elements["password"].value;

    const users = getUsers();

    const user = users.find(
      account => account.email === email
    );

    if (!user) {
      logMsg.textContent =
        "No account found with this email.";
      return;
    }

    if (user.password !== password) {
      logMsg.textContent = "Incorrect password.";
      return;
    }

    // Save login state
    store.set("currentUser", user.name);

    // Update navigation
    navLogin.textContent = user.name;

    // Reset form
    logForm.reset();

    // Display welcome screen
    showWelcome(user.name);
  });

  // =====================================
  // LOGOUT
  // =====================================

  logoutBtn.addEventListener("click", () => {

    store.set("currentUser", "");

    navLogin.textContent = "Login";

    showLoginForm();

    closeModalWindow();
  });

  // =====================================
  // NOTICE STORAGE
  // =====================================

  const getNotices = () => {
    try {
      return JSON.parse(store.get("schoolNotices") || "[]");
    } catch {
      return [];
    }
  };

  // =====================================
  // DISPLAY SAVED NOTICES
  // =====================================

  const renderNotices = () => {

    const notices = getNotices();

    notices.forEach(notice => {

      const article = document.createElement("article");
      article.className = "notice";

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

      const message = document.createElement("p");
      message.textContent = notice.message;

      meta.append(date, separator, tag);
      article.append(heading, meta, message);

      noticeList.prepend(article);
    });
  };

  // =====================================
  // POST A NOTICE
  // =====================================

  noticeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    noticeMsg.textContent = "";

    const currentUser = getCurrentUser();

    // Require login before posting
    if (!currentUser) {
      noticeMsg.style.color = "#c92a2a";
      noticeMsg.textContent =
        "Please log in before posting a notice.";

      openModal();
      return;
    }

    const title = noticeForm.elements["title"].value.trim();

    const category = noticeForm.elements["category"].value;

    const date = noticeForm.elements["date"].value;

    const message = noticeForm.elements["message"].value.trim();

    if (!title || !date || !message) {
      noticeMsg.style.color = "#c92a2a";
      noticeMsg.textContent =
        "Please complete all notice fields.";
      return;
    }

    const notices = getNotices();

    const newNotice = {
      title: title,
      category: category,
      date: date,
      message: message,
      author: currentUser
    };

    notices.unshift(newNotice);

    store.set("schoolNotices", JSON.stringify(notices));

    // Display newly posted notice
    const article = document.createElement("article");
    article.className = "notice";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const meta = document.createElement("p");
    meta.className = "meta";

    const time = document.createElement("time");
    time.dateTime = date;
    time.textContent = date;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = category;

    const messageParagraph = document.createElement("p");
    messageParagraph.textContent = message;

    meta.append(
      time,
      document.createTextNode(" · "),
      tag
    );

    article.append(
      heading,
      meta,
      messageParagraph
    );

    noticeList.prepend(article);

    noticeForm.reset();

    noticeMsg.style.color = "var(--brand)";
    noticeMsg.textContent =
      "Notice posted successfully!";

  });

  // =====================================
  // RESTORE LOGIN AND NOTICES
  // =====================================

  const currentUser = getCurrentUser();

  if (currentUser) {
    navLogin.textContent = currentUser;
  }

  renderNotices();

});
