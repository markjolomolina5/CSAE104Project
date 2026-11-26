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

/* ---------- Safe storage with fallback ---------- */
const memory = {};
const store = {
  get(key) {
    try { return localStorage.getItem(key); }
    catch { return memory[key] ?? null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); }
    catch { memory[key] = value; }
  },
};

/* ---------- Splash screen timer ---------- */
const hideSplash = () => {
  if (splash) splash.classList.add("hidden");
};
setTimeout(hideSplash, 2000);
if (splash) splash.addEventListener("click", hideSplash);

/* ---------- Floating Modal Controls ---------- */
const openModal = (view = "login") => {
  authModal.classList.remove("hidden");
  logMsg.textContent = "";
  regMsg.textContent = "";
  
  const loggedUser = store.get("currentUser");
  if (loggedUser) {
    showWelcome(loggedUser);
  } else if (view === "register") {
    showRegisterForm();
  } else {
    showLoginForm();
  }
};

const closeModalWindow = () => {
  authModal.classList.add("hidden");
};

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
  hello.textContent = `Welcome, ${name}!`;
  welcomeView.classList.remove("hidden");
  logForm.classList.add("hidden");
  regForm.classList.add("hidden");
};

/* Open modal when clicking Login in navbar */
navLogin.addEventListener("click", (e) => {
  e.preventDefault();
  const loggedUser = store.get("currentUser");
  openModal(loggedUser ? "welcome" : "login");
});

/* Close modal on X button or backdrop click */
closeModal.addEventListener("click", closeModalWindow);
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) closeModalWindow();
});

/* Switch views inside the modal */
switchToRegister.addEventListener("click", (e) => {
  e.preventDefault();
  showRegisterForm();
});

switchToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  showLoginForm();
});

/* ---------- Saved users helper ---------- */
const getUsers = () => {
  try { return JSON.parse(store.get("users")) ?? []; }
  catch { return []; }
};

/* ---------- Register ---------- */
if (regForm) {
  regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    regMsg.textContent = "";
    const f = regForm.elements;
    try {
      if (f.password.value.length < 8)
        throw new Error("Password must be at least 8 characters");
      if (f.password.value !== f.confirm.value)
        throw new Error("Passwords do not match");
      
      const email = f.email.value.trim().toLowerCase();
      const currentUsers = getUsers();
      
      if (currentUsers.some((u) => u.email === email))
        throw new Error("Email already registered");
      
      const users = [...currentUsers, {
        name: f.name.value.trim(),
        email,
        password: f.password.value,
      }];
      
      store.set("users", JSON.stringify(users));
      regForm.reset();
      
      // Switch back to login view and show success message
      showLoginForm();
      logMsg.style.color = "var(--brand)";
      logMsg.textContent = "Account created! Please log in.";
    } catch (error) {
      regMsg.style.color = "#c92a2a";
      regMsg.textContent = error.message;
    }
  });
}

/* ---------- Login ---------- */
if (logForm) {
  logForm.addEventListener("submit", (e) => {
    e.preventDefault();
    logMsg.style.color = "#c92a2a";
    logMsg.textContent = "";
    
    const f = logForm.elements;
    const mail = f.email.value.trim().toLowerCase();
    const password = f.password.value;
    
    const users = getUsers();
    const user = users.find((u) => u.email === mail);
    
    if (!user) {
      logMsg.textContent = "No account found with this email.";
    } else if (user.password !== password) {
      logMsg.textContent = "Incorrect password.";
    } else {
      store.set("currentUser", user.name);
      logForm.reset();
      showWelcome(user.name);
      navLogin.textContent = user.name;
    }
  });
}

/* ---------- Logout ---------- */
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    store.set("currentUser", "");
    navLogin.textContent = "Login";
    showLoginForm();
    closeModalWindow();
  });
}

/* Check login state on page load */
window.addEventListener("DOMContentLoaded", () => {
  const loggedUser = store.get("currentUser");
  if (loggedUser) {
    navLogin.textContent = loggedUser;
  }
});