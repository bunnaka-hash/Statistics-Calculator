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
