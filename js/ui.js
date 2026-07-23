import { debounce, getStorage, setStorage, showToast } from "./helper.js";
import { loadPage } from "./router.js";

function updateThemeToggle(toggle, isDark) {
  if (!toggle) return;

  toggle.innerHTML = `<span class="text-base leading-none">${isDark ? "🌙" : "☀︎"}</span>`;
  toggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );
  toggle.classList.toggle("bg-slate-900", isDark);
  toggle.classList.toggle("text-slate-100", isDark);
  toggle.classList.toggle("bg-white", !isDark);
  toggle.classList.toggle("text-slate-700", !isDark);
}

export function initTheme() {
  const root = document.documentElement;
  const savedTheme = getStorage("theme", "light");
  const isDark = savedTheme === "dark";
  root.classList.toggle("dark", isDark);
  const toggle = document.getElementById("theme-toggle");
  updateThemeToggle(toggle, isDark);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const nextDark = root.classList.toggle("dark");
      setStorage("theme", nextDark ? "dark" : "light");
      updateThemeToggle(toggle, nextDark);
      showToast(`Switched to ${nextDark ? "dark" : "light"} mode`);
    });
  }
}

export function initMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => menu.classList.toggle("hidden"));
}

export function initScrollTop() {
  const button = document.getElementById("scroll-top");
  if (!button) return;
  const toggle = debounce(() => {
    button.classList.toggle("hidden", window.scrollY < 240);
  }, 100);
  window.addEventListener("scroll", toggle);
  button.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

export function initSearch(inputSelector, items, render) {
  const input = document.querySelector(inputSelector);
  if (!input) return;
  input.addEventListener("input", (event) => {
    const term = event.target.value.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term),
    );
    render(filtered);
  });
}

export function initLoader() {
  const loader = document.querySelector(".loader");
  if (!loader) return;
  window.addEventListener("load", () => loader.classList.add("hidden"));
}

const menus = [
  { name: "Home", page: "home" },
  { name: "Calculators", page: "calculators" },
  { name: "Formulas", page: "formulas" },
  { name: "Examples", page: "examples" },
  { name: "Practice", page: "practice" },
  { name: "About", page: "about" },
  { name: "Contact", page: "contact" },
  { name: "FAQ", page: "faq" },
];

export function initNavigation() {
  const desktop = document.getElementById("desktop-menu");
  const mobile = document.getElementById("mobile-menu-links");

  if (!desktop || !mobile) return;

  desktop.innerHTML = "";
  mobile.innerHTML = "";

  // Generate menu links
  menus.forEach((menu) => {
    desktop.innerHTML += `
      <a href="#${menu.page}"
         class="nav-link transition hover:text-blue-600"
         data-page="${menu.page}">
         ${menu.name}
      </a>
    `;

    mobile.innerHTML += `
      <a href="#${menu.page}"
         class="nav-link transition hover:text-blue-600"
         data-page="${menu.page}">
         ${menu.name}
      </a>
    `;
  });

  // Single event listener for all navigation clicks
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-page]");
    if (!link) return;

    e.preventDefault();
    const page = link.dataset.page;

    // Update URL hash
    location.hash = `#${page}`;

    // Load page content
    loadPage(page);

    // Update active nav styling
    setActiveNav(page);

    // Close mobile menu if open
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.add("hidden");
    }
  });
}
export function setActiveNav(page) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("text-blue-600", "font-semibold");
  });

  document.querySelectorAll(`[data-page="${page}"]`).forEach((link) => {
    link.classList.add("text-blue-600", "font-semibold");
  });
}
