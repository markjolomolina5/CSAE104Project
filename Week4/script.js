// ---------- Saved users (from the slides) ----------
const getUsers = () => {
  const raw = localStorage.getItem("users");
  return JSON.parse(raw) ?? [];
};

// ---------- Elements ----------
const modal = document.querySelector("#authModal");
const regForm = document.querySelector("#regForm");
const logForm = document.querySelector("#logForm");
const regMsg = document.querySelector("#regMsg");
const logMsg = document.querySelector("#logMsg");
const greeting = document.querySelector("#userGreeting");
const loginItem = document.querySelector("#openLogin");
const logoutItem = document.querySelector("#logout");

// Show a message (green when ok is true, red otherwise)
const say = (el, text, ok = false) => {
  el.textContent = text;
  el.classList.toggle("ok", ok);
};

// ---------- Switch between the login and register forms ----------
const showForm = (name) => {
  logForm.classList.toggle("hidden", name !== "login");
  regForm.classList.toggle("hidden", name !== "register");
  say(logMsg, "");
  say(regMsg, "");
};

const openModal = (name) => {
  showForm(name);
  modal.classList.remove("hidden");
  (name === "login" ? logForm : regForm).elements[0].focus();
};

const closeModal = () => modal.classList.add("hidden");

// ---------- Nav line: Login, or the name and Log out ----------
const updateNav = () => {
  const email = localStorage.getItem("currentUser");
  const user = getUsers().find((u) => u.email === email);

  greeting.textContent = user ? `Welcome, ${user.name}!` : "";
  greeting.classList.toggle("hidden", !user);
  logoutItem.classList.toggle("hidden", !user);
  loginItem.classList.toggle("hidden", !!user);
};

// One click listener handles the buttons and links
document.addEventListener("click", (e) => {
  const on = (id) => e.target.closest("#" + id);

  if (on("openLogin")) openModal("login");
  if (on("toRegister")) {
    e.preventDefault();
    showForm("register");
    regForm.elements[0].focus();
  }
  if (on("toLogin")) {
    e.preventDefault();
    showForm("login");
    logForm.elements[0].focus();
  }
  if (on("logout")) {
    localStorage.removeItem("currentUser");
    updateNav();
  }
  if (on("closeModal") || e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ---------- Check the registration form, then save the user ----------
regForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = regForm.elements;
  try {
    if (f.password.value.length < 8)
      throw new Error("Password too short");
    if (f.password.value !== f.confirm.value)
      throw new Error("Passwords do not match");

    const email = f.email.value.trim().toLowerCase();
    if (getUsers().some((u) => u.email === email))
      throw new Error("Email already used");
    const users = [...getUsers(), {
      name: f.name.value.trim(), email,
      password: f.password.value,
    }];
    localStorage.setItem("users", JSON.stringify(users));
    regForm.reset();
    showForm("login");
    say(logMsg, "Account created! Please log in.", true);
    logForm.elements[0].focus();
  } catch (error) {
    say(regMsg, error.message);
  }
});

// ---------- Check the login ----------
logForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = logForm.elements;
  const mail = f.email.value.trim().toLowerCase();
  const user = getUsers().find((u) => u.email === mail);
  if (user?.password === f.password.value) {
    localStorage.setItem("currentUser", user.email);
    logForm.reset();
    closeModal();
    updateNav();
  } else {
    say(logMsg, "Wrong email or password");
  }
});

updateNav();

// ---------- Theme button: remembers the choice (from the slides) ----------
const root = document.documentElement;
const toggle = document.querySelector("#themeToggle");

const setTheme = (name) => {
  const dark = name === "dark";
  root.dataset.theme = name;
  toggle.textContent = dark ? "Light" : "Dark";
  localStorage.setItem("theme", name);
};
const systemDark = matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
const saved = localStorage.getItem("theme");
setTheme(saved ?? (systemDark ? "dark" : "light"));

toggle.onclick = () => {
  const dark = root.dataset.theme === "dark";
  setTheme(dark ? "light" : "dark");
};