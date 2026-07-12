// load the page content into the page container
export async function loadPage(page) {
  const pageContainer = document.getElementById("page-content");

  if (!pageContainer) return;

  try {
    const response = await fetch(`components/pages/${page}.html`);

    if (!response.ok) {
      throw new Error("Page not found");
    }

    const html = await response.text();

    pageContainer.innerHTML = html;
  } catch (error) {
    pageContainer.innerHTML = `
      <div class="py-20 text-center">
        <h2 class="text-3xl font-bold text-red-500">404</h2>
        <p class="mt-3">Page "${page}" not found.</p>
      </div>
    `;
    history.pushState({}, "", `#${page}`);
  }
}

// support browser back and forward buttons
export function initRouter(setActiveNav) {

  window.addEventListener("popstate", () => {

    const page = location.hash.replace("#", "") || "home";

    loadPage(page);

    setActiveNav(page);

  });

}