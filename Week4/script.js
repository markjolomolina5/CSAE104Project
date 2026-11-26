const screens = document.querySelectorAll(".screen");
const splash = document.querySelector("#splash");
const regForm = document.querySelector("#regForm");
const regMsg = document.querySelector("#regMsg");
const logForm = document.querySelector("#logForm");
const logMsg = document.querySelector("#logMsg");
const hello = document.querySelector("#welcomeText");

/* ---------- Safe storage with memory fallback ---------- */
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

/* ---------- Screens visibility toggle ---------- */
const show = (id) => {
  screens.forEach((s) => {
    if (s.id === id) {
      s.classList.remove("hidden");
    } else {
      s.classList.add("hidden");
    }
  });
  window.scrollTo(0, 0);
};

/* ---------- Splash: 2 seconds, then show home ---------- */
const hideSplash = () => {
  if (splash) splash.classList.add("hidden");
};
setTimeout(hideSplash, 2000);
if (splash) splash.addEventListener("click", hideSplash);

/* ---------- Bulletproof navigation click handler ---------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("a, button");
  if (!el) return;

  const targetId = el.getAttribute("data-target");
  if (targetId) {
    e.preventDefault();
    if (regMsg) regMsg.textContent = "";
    if (logMsg) logMsg.textContent = "";
    show(targetId);
  }
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
    if (regMsg) regMsg.textContent = "";
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
      
      show("login");
      if (logMsg) {
        logMsg.style.color = "var(--brand)";
        logMsg.textContent = "Account created successfully! Please log in.";
      }
    } catch (error) {
      if (regMsg) {
        regMsg.style.color = "#c92a2a";
        regMsg.textContent = error.message;
      }
    }
  });
}

/* ---------- Login ---------- */
if (logForm) {
  logForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (logMsg) {
      logMsg.style.color = "#c92a2a";
      logMsg.textContent = "";
    }
    
    const f = logForm.elements;
    const mail = f.email.value.trim().toLowerCase();
    const password = f.password.value;
    
    const users = getUsers();
    const user = users.find((u) => u.email === mail);
    
    if (!user) {
      if (logMsg) logMsg.textContent = "No account found with this email.";
    } else if (user.password !== password) {
      if (logMsg) logMsg.textContent = "Incorrect password.";
    } else {
      if (hello) hello.textContent = `Welcome, ${user.name}!`;
      logForm.reset();
      show("welcome");
    }
  });
}