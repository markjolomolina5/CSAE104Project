
// PINMILAPIL NATIONAL HIGH SCHOOL
// SCHOOL NOTICE BOARD

// SPLASH SCREEN: HIDE AFTER 2 SECONDS
const splash = document.getElementById("splash");

window.addEventListener("load", () => {
  setTimeout(() => {
    splash.classList.add("hidden");
  }, 2000);
});

// GET HTML ELEMENTS
const noticeList = document.getElementById("noticeList");
const deadlineList = document.getElementById("deadlineList");
const noticeForm = document.getElementById("noticeForm");
const postReminder = document.getElementById("postReminder");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginNav = document.getElementById("loginNav");
const logoutBtn = document.getElementById("logoutBtn");
const accountMessage = document.getElementById("accountMessage");

// LOAD SAVED DATA
let users = JSON.parse(localStorage.getItem("schoolUsers")) || [];

let notices = JSON.parse(localStorage.getItem("schoolNotices")) || [
  {
    id: 1,
    title: "Welcome to Our School Notice Board",
    category: "Notice",
    date: "2026-01-01",
    description: "Welcome! Visit this page regularly for school announcements and updates."
  },
  {
    id: 2,
    title: "Important School Reminder",
    category: "Notice",
    date: "2026-01-02",
    description: "Please stay updated with your class announcements and school activities."
  },
  {
    id: 3,
    title: "Submission of Requirements",
    category: "Deadline",
    date: "2026-01-15",
    description: "Students are reminded to submit their required school documents."
  }
];

let currentUser = localStorage.getItem("schoolCurrentUser");

// SAVE DATA
function saveUsers() {
  localStorage.setItem("schoolUsers", JSON.stringify(users));
}

function saveNotices() {
  localStorage.setItem("schoolNotices", JSON.stringify(notices));
}

// DISPLAY NOTICES AND DEADLINES
function displayNotices() {
  noticeList.innerHTML = "";
  deadlineList.innerHTML = "";

  const generalNotices = notices.filter(
    notice => notice.category === "Notice"
  );

  const deadlines = notices.filter(
    notice => notice.category === "Deadline"
  );

  if (generalNotices.length === 0) {
    noticeList.innerHTML = "<p>No school notices available.</p>";
  }

  if (deadlines.length === 0) {
    deadlineList.innerHTML = "<p>No upcoming deadlines available.</p>";
  }

  generalNotices.forEach(notice => {
    noticeList.appendChild(createNoticeCard(notice));
  });

  deadlines.forEach(notice => {
    deadlineList.appendChild(createNoticeCard(notice));
  });
}

// CREATE NOTICE CARD
function createNoticeCard(notice) {
  const card = document.createElement("article");
  card.className = "notice-card";

  const category = document.createElement("span");
  category.className = "category";
  category.textContent = notice.category;

  const title = document.createElement("h3");
  title.textContent = notice.title;

  const date = document.createElement("p");
  date.className = "notice-date";
  date.textContent = "Date: " + notice.date;

  const description = document.createElement("p");
  description.textContent = notice.description;

  card.append(category, title, date, description);

  return card;
}

// SHOW REGISTER FORM
showRegister.addEventListener("click", function(event) {
  event.preventDefault();

  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  accountMessage.textContent = "";
});

// SHOW LOGIN FORM
showLogin.addEventListener("click", function(event) {
  event.preventDefault();

  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  accountMessage.textContent = "";
});

// REGISTER ACCOUNT
registerForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value;

  if (username.length < 3) {
    alert("Username must contain at least 3 characters.");
    return;
  }

  if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
    alert("This username is already registered.");
    return;
  }

  users.push({
    username: username,
    password: password
  });

  saveUsers();

  registerForm.reset();
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");

  accountMessage.textContent = "Registration successful! You can now log in.";
});

// LOGIN ACCOUNT
loginForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  const user = users.find(
    user =>
      user.username.toLowerCase() === username.toLowerCase() &&
      user.password === password
  );

  if (!user) {
    alert("Incorrect username or password.");
    return;
  }

  currentUser = user.username;
  localStorage.setItem("schoolCurrentUser", currentUser);

  loginForm.reset();
  accountMessage.textContent = "Welcome, " + currentUser + "! You are logged in.";

  updateLoginStatus();
});

// LOGOUT
logoutBtn.addEventListener("click", function() {
  localStorage.removeItem("schoolCurrentUser");
  currentUser = null;

  accountMessage.textContent = "You have successfully logged out.";

  updateLoginStatus();
});

// UPDATE LOGIN DISPLAY
function updateLoginStatus() {
  if (currentUser) {
    loginNav.textContent = "Logged in: " + currentUser;
    loginNav.href = "#account";

    logoutBtn.classList.remove("hidden");
    noticeForm.classList.remove("hidden");
    postReminder.classList.add("hidden");

    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
  } else {
    loginNav.textContent = "Login";
    loginNav.href = "#account";

    logoutBtn.classList.add("hidden");
    noticeForm.classList.add("hidden");
    postReminder.classList.remove("hidden");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  }
}

// POST A NEW NOTICE
noticeForm.addEventListener("submit", function(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Please log in first.");
    return;
  }

  const title = document.getElementById("noticeTitle").value.trim();
  const category = document.getElementById("noticeCategory").value;
  const date = document.getElementById("noticeDate").value;
  const description = document.getElementById("noticeDescription").value.trim();

  if (!title || !date || !description) {
    alert("Please complete all fields.");
    return;
  }

  const newNotice = {
    id: Date.now(),
    title: title,
    category: category,
    date: date,
    description: description
  };

  notices.unshift(newNotice);

  saveNotices();
  displayNotices();

  noticeForm.reset();

  alert("Your notice has been published successfully!");
});

// INITIALIZE WEBSITE
displayNotices();
updateLoginStatus();
