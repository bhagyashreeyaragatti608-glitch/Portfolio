const roles = [
  "AI Engineer",
  "Data Analyst",
  "Machine Learning Enthusiast",
  "Computer Vision Developer",
  "Intern at Vinyas Innovative Technologies Ltd."
];

const skillGroups = [
  {
    title: "Programming Languages",
    icon: "fa-solid fa-code",
    items: ["Python", "Java", "C", "SQL", "HTML"]
  },
  {
    title: "AI & Data",
    icon: "fa-solid fa-brain",
    items: ["Artificial Intelligence", "Machine Learning", "Computer Vision", "Data Analytics", "Power BI", "Tableau", "Excel"]
  },
  {
    title: "Database & Tools",
    icon: "fa-solid fa-screwdriver-wrench",
    items: ["MySQL", "Git", "GitHub", "VS Code", "CodeBlocks", "LaTeX"]
  },
  {
    title: "Soft Skills",
    icon: "fa-solid fa-people-group",
    items: ["Leadership", "Problem Solving", "Teamwork"]
  }
];

const root = document.documentElement;
const typingText = document.querySelector("#typingText");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const themeToggle = document.querySelector(".theme-toggle");
const progress = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");
const skillsGrid = document.querySelector("#skillsGrid");
const profilePhotoCard = document.querySelector("#profilePhotoCard");
const profilePhotoInput = document.querySelector("#profilePhotoInput");
const profilePhotoPreview = document.querySelector("#profilePhotoPreview");
const profilePhotoImage = document.querySelector("#profilePhotoImage");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  const current = roles[roleIndex];
  typingText.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    setTimeout(typeRole, 65);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeRole, 1200);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeRole, 35);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeRole, 250);
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  const icon = themeToggle.querySelector("i");
  icon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

function renderSkills() {
  skillsGrid.innerHTML = `
    <article class="skill-card skills-panel visible">
      ${skillGroups.map((group) => `
        <section class="skill-group" aria-label="${group.title}">
          <header>
            <i class="${group.icon}" aria-hidden="true"></i>
            <h3>${group.title}</h3>
          </header>
          <div class="skill-chip-list">
            ${group.items.map((item) => `<span>${item}</span>`).join("")}
          </div>
        </section>
      `).join("")}
    </article>
  `;
}

function setProfilePhoto(imageData, lockPhoto = false) {
  profilePhotoImage.src = imageData;
  profilePhotoPreview.classList.add("has-photo");

  if (lockPhoto) {
    profilePhotoCard.classList.add("photo-saved");
  }
}

function updateScrollState() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${height > 0 ? scrollTop / height : 0})`;
  backToTop.classList.toggle("show", scrollTop > 500);
}

function setActiveNav() {
  let current = "home";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

function closeNav() {
  navPanel.classList.remove("open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.querySelector("i").className = "fa-solid fa-bars";
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

navToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.querySelector("i").className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "light" ? "dark" : "light");
});

document.querySelector("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  document.querySelector(".form-status").textContent = "Thank you. Your message is ready to be connected to a form service.";
});

profilePhotoInput.addEventListener("change", () => {
  const file = profilePhotoInput.files[0];

  if (!file || !file.type.startsWith("image/")) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    setProfilePhoto(reader.result, true);
    localStorage.setItem("portfolio-profile-photo", reader.result);
  });
  reader.readAsDataURL(file);
});

profilePhotoImage.addEventListener("load", () => {
  profilePhotoPreview.classList.add("has-photo");
});

profilePhotoImage.addEventListener("error", () => {
  profilePhotoPreview.classList.remove("has-photo");
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  updateScrollState();
  setActiveNav();
}, { passive: true });

document.querySelector("#year").textContent = new Date().getFullYear();
applyTheme(localStorage.getItem("portfolio-theme") || "dark");
const savedProfilePhoto = localStorage.getItem("portfolio-profile-photo");
if (savedProfilePhoto) {
  setProfilePhoto(savedProfilePhoto, true);
} else if (profilePhotoImage.complete && profilePhotoImage.naturalWidth > 0) {
  profilePhotoPreview.classList.add("has-photo");
}
renderSkills();
typeRole();
updateScrollState();
setActiveNav();
