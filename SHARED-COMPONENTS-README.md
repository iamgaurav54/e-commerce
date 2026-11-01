# Shared header and footer

Every page (`index.html`, `shop.html`, `bags.html`, `collection.html`) now loads:
- `Component/header.html`
- `Component/footer.html`

Edit those two files once to update all pages. `components.js` handles loading.

**Run on an HTTP server**, not by double-clicking the HTML file (browsers block `fetch` on `file://`).
Example: in this folder run `python -m http.server 8000`, then visit `http://localhost:8000`.

To add a new page, include `<div id="site-header"></div>` after `<body>`, `<div id="site-footer"></div>` before `</body>`, and `<script src="components.js" defer></script>`. Include the shared CSS and Bootstrap as needed.
