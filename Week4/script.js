const root = document.documentElement;
const screens = document.querySelectorAll(".screen");
const splash = document.querySelector("#splash");
const toggle = document.querySelector("#themeToggle");
const regForm = document.querySelector("#regForm");
const regMsg = document.querySelector("#regMsg");
const logForm = document.querySelector("#logForm");
const logMsg = document.querySelector("#logMsg");
const hello = document.querySelector("#welcomeText");

/* ---------- Screens ---------- */
// show hides every screen except the one you name
const show = (id) => {
  screens.forEach((s) => s.classList.toggle("hidden", s.id !== id));
  regMsg.textContent = "";
  logMsg.textContent = "";
  window.scrollTo(0, 0);
};

/* ---------- Splash: 2 seconds, then the notice board ---------- */
setTimeout(() => splash.classList.add("hidden"), 2000);

/* ---------- One click listener for links and buttons ---------- */
const goTo = {
  navLogin: "login",
  toLogin: "login",
  toRegister: "register",
  logout: "login",
};

document.addEventListener("click", (e) => {
  const el = e.target.closest("a, button");
  if (!el) return;
  const id = goTo[el.id];
  if (id) {
    e.preventDefault();
    show(id);
  } else if (el.matches("nav a")) {
    show("home"); // Notices, Deadlines, Post a notice
  }
});

/* ---------- Saved users (practice only: localStorage) ---------- */
const getUsers = () => JSON.parse(localStorage.getItem("users")) ?? [];

/* ---------- Register ---------- */
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
      name: f.name.value, email,
      password: f.password.value,
    }];
    localStorage.setItem("users", JSON.stringify(users));
    regForm.reset();
    show("login");
  } catch (error) {
    regMsg.textContent = error.message;
  }
});

/* ---------- Login ---------- */
logForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = logForm.elements;
  const mail = f.email.value.trim().toLowerCase();
  const user = getUsers().find((u) => u.email === mail);
  if (user?.password === f.password.value) {
    hello.textContent = `Welcome, ${user.name}!`;
    logForm.reset();
    show("welcome");
  } else {
    logMsg.textContent = "Wrong email or password";
  }
});

/* ---------- Light / dark theme (remembered) ---------- */
const setTheme = (name) => {
  const dark = name === "dark";
  root.dataset.theme = name;
  toggle.textContent = dark ? "Light" : "Dark";
  localStorage.setItem("theme", name);
};

const systemDark = matchMedia("(prefers-color-scheme: dark)").matches;
const saved = localStorage.getItem("theme");
setTheme(saved ?? (systemDark ? "dark" : "light"));

toggle.onclick = () => {
  const dark = root.dataset.theme === "dark";
  setTheme(dark ? "light" : "dark");
};
