# Statistics Calculator - SPA Structure Guide

## Overview

Your project has been restructured into a **Single Page Application (SPA)** where the layout stays fixed and only the content area changes dynamically without full page reloads.

## How It Works

### 1. **Entry Point** (`index.html`)

- Single HTML file that loads the app
- Contains the `<div id="app"></div>` container
- Includes a scroll-to-top button
- Loads `app.js` module

### 2. **Application Initialization** (`js/app.js`)

When the page loads, `initializeApp()`:

1. Loads the layout from `components/layouts/main.layout.html`
2. Loads the header/navbar from `components/header.html`
3. Loads the footer from `components/footer.html`
4. Initializes all UI features (theme, mobile menu, scroll, etc.)
5. Sets up navigation and routing
6. Loads the home page by default
7. Initializes page-specific features with a small delay

### 3. **Layout Structure** (`components/layouts/main.layout.html`)

```html
<div class="flex min-h-screen flex-col">
  <div id="header"></div>
  <!-- Navbar stays fixed here -->
  <main id="page-content"></main>
  <!-- Content changes here -->
  <div id="footer"></div>
  <!-- Footer stays fixed here -->
</div>
```

### 4. **Navigation** (`js/ui.js`)

The `initNavigation()` function:

- Creates all menu links with `data-page` attributes
- Uses hash-based routing (e.g., `#home`, `#calculators`, `#about`)
- Single event listener for all nav clicks
- When a link is clicked:
  - Updates the URL hash (`location.hash = '#page-name'`)
  - Loads page content dynamically
  - Highlights the active nav link
  - Closes mobile menu if open

### 5. **Page Loading** (`js/router.js`)

The `loadPage(page)` function:

- Fetches the page HTML from `components/pages/{page}.html`
- Injects it into `<main id="page-content">`
- Scrolls to top automatically
- Shows 404 if page not found
- No full page reload!

### 6. **Browser History**

The `initRouter(setActiveNav)` function:

- Listens for back/forward button clicks (`popstate` event)
- Updates content when user navigates browser history
- Keeps nav highlighting in sync

## Components Loaded

| Component     | Location                              | Loaded Into     |
| ------------- | ------------------------------------- | --------------- |
| Layout        | `components/layouts/main.layout.html` | `#app`          |
| Header/Navbar | `components/header.html`              | `#header`       |
| Footer        | `components/footer.html`              | `#footer`       |
| Pages         | `components/pages/{page}.html`        | `#page-content` |

## Menu Pages Available

The navigation menu includes these pages (all from `components/pages/`):

- Home (`home.html`)
- Calculators (`calculators.html`)
- Formulas (`formulas.html`)
- Examples (`examples.html`)
- Practice (`practice.html`)
- About (`about.html`)
- Contact (`contact.html`)
- FAQ (`faq.html`)

## Navigation Flow

### User clicks "Calculators" link:

```
1. Click event caught by global listener
2. Extract page name: "calculators"
3. Update URL: window.location.hash = "#calculators"
4. Call loadPage("calculators")
5. Fetch components/pages/calculators.html
6. Inject HTML into <main id="page-content">
7. Call setActiveNav("calculators")
8. Highlight "Calculators" link in navbar
9. Close mobile menu if open
10. Scroll page to top
```

### User clicks browser back button:

```
1. "popstate" event fires
2. Extract page from URL hash
3. Call loadPage(page)
4. Call setActiveNav(page)
5. Content updates, nav highlighting updates
```

## Key Features

✅ **No Page Reloads** - Content loads via fetch/AJAX  
✅ **Fixed Layout** - Header and footer always visible  
✅ **Dynamic Content** - Only the main area changes  
✅ **Browser History** - Back/forward buttons work  
✅ **URL Hash Routing** - Each page has a URL (#home, #calculators, etc.)  
✅ **Mobile Responsive** - Mobile menu works seamlessly  
✅ **Smooth UX** - Automatic scroll to top when navigating  
✅ **Active State** - Current page is highlighted in navbar

## File Structure

```
index.html                              (Entry point)
js/
├── app.js                             (App initialization)
├── router.js                          (Page loading & history)
├── ui.js                              (Navigation & UI init)
├── statistics.js
├── probability.js
├── distributions.js
├── regression.js
├── validation.js
├── helper.js
└── ...other files
components/
├── layouts/
│   └── main.layout.html              (Main layout template)
├── header.html                       (Navbar)
├── footer.html                       (Footer - NEW)
└── pages/
    ├── home.html
    ├── calculators.html
    ├── formulas.html
    ├── examples.html
    ├── practice.html
    ├── about.html
    ├── contact.html
    └── faq.html
```

## How to Add New Pages

1. Create a new HTML file in `components/pages/` (e.g., `new-page.html`)
2. Add it to the menu in `js/ui.js`:
   ```javascript
   const menus = [
     // ... existing entries ...
     { name: "New Page", page: "new-page" },
   ];
   ```
3. Users can now click it and the page loads dynamically!

## Tips

- Each page HTML should contain the content only, no full HTML structure
- Use IDs to target content for dynamic features (e.g., calculator lists)
- The layout and components stay in memory while navigating
- Styling is persistent across page changes
- Theme/dark mode settings persist across navigation
