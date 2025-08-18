const toggle = document.querySelector('[data-nav-toggle]');
const menu = document.getElementById('nav-menu');
const darkModeToggle = document.getElementById('darkModeToggle');
const roleText = document.getElementById("role-text");

// -------------------------
// Navbar Menu Toggle
// -------------------------
function closeMenu() {
  if (!menu || !toggle) return;
  menu.dataset.open = 'false';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.dataset.open === 'true';
    menu.dataset.open = String(!isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  });

  // Debounced resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 768) closeMenu();
    }, 150);
  });

  document.querySelectorAll('.nav__menu a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMenu();
    });
  });
}

// -------------------------
// Dark Mode Toggle + Persistence
// -------------------------
function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add("dark");  // ✅ add class
    darkModeToggle.textContent = "☀️";   // Light mode icon
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark"); // ✅ remove class
    darkModeToggle.textContent = "🌙";     // Dark mode icon
    localStorage.setItem("theme", "light");
  }
}

// On page load → Apply saved preference
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  setDarkMode(true);
} else {
  // Default is light mode
  setDarkMode(false);
}

// Toggle when user clicks button
darkModeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  setDarkMode(!isDark);
});



// -------------------------
// Animated roles (Typing Effect)
// -------------------------
const roles = [
  "Software Engineer",
  "Full Stack Developer",
  "AI & ML Enthusiast"
];

let roleIndex = 0;
const typingSpeed = 100; // ms per char
const erasingSpeed = 50; // ms per char
const delayAfterTyping = 1500;
const delayAfterErasing = 500;

function typeRole() {
  if (!roleText) return;
  const role = roles[roleIndex];
  let i = 0;
  roleText.textContent = "";

  function type() {
    if (i < role.length) {
      roleText.textContent += role[i++];
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(eraseRole, delayAfterTyping);
    }
  }
  type();
}

function eraseRole() {
  if (!roleText) return;
  const role = roles[roleIndex];
  let i = role.length;

  function erase() {
    if (i > 0) {
      roleText.textContent = role.substring(0, --i);
      setTimeout(erase, erasingSpeed);
    } else {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRole, delayAfterErasing);
    }
  }
  erase();
}

// Start animation
typeRole();

const form = document.querySelector(".contact__form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop default form submission

    const formData = new FormData(form);
    const status = document.createElement("p");
    status.style.marginTop = "1rem";

    try {
      let response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent = "✅ Thank you! Your message has been sent.";
        status.style.color = "green";
        form.reset(); // clear form after submission
      } else {
        status.textContent = "❌ Oops! Something went wrong. Please try again.";
        status.style.color = "red";
      }
    } catch (error) {
      status.textContent = "⚠️ Network error. Please check your connection.";
      status.style.color = "orange";
    }

    // Append message only once (remove old ones if any)
    const oldStatus = form.querySelector("p");
    if (oldStatus) oldStatus.remove();
    form.appendChild(status);
  });