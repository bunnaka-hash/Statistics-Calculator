import { debounce, getStorage, setStorage, showToast } from "./helper.js";

export function initTheme() {
  const root = document.documentElement;
  const savedTheme = getStorage("theme", "light");
  root.classList.toggle("dark", savedTheme === "dark");
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark = root.classList.toggle("dark");
      setStorage("theme", isDark ? "dark" : "light");
      showToast(`Switched to ${isDark ? "dark" : "light"} mode`);
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



export function initNavigation(loadPage) {
  const desktop = document.getElementById("desktop-menu");
  const mobile = document.getElementById("mobile-menu-links");

  if (!desktop || !mobile) return;

  desktop.innerHTML = "";
  mobile.innerHTML = "";

  menus.forEach((menu) => {
    desktop.innerHTML += `
      <a href="#"
         class="nav-link transition hover:text-blue-600"
         data-page="${menu.page}">
         ${menu.name}
      </a>
    `;

    mobile.innerHTML += `
      <a href="#"
         class="nav-link transition hover:text-blue-600"
         data-page="${menu.page}">
         ${menu.name}
      </a>
    `;
    document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-page]");

  if (!link) return;

  e.preventDefault();

  const page = link.dataset.page;

  loadPage(page);

  setActiveNav(page);
});
  });
  document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-page]");

  if (!link) return;

  e.preventDefault();

  const page = link.dataset.page;

  loadPage(page);

  setActiveNav(page);
});



  // More code comes below...
}
export function setActiveNav(page) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("text-blue-600", "font-semibold");
  });

  document.querySelectorAll(`[data-page="${page}"]`).forEach((link) => {
    link.classList.add("text-blue-600", "font-semibold");
  });
}

