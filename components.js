// Single source of truth for the shared header and footer.
// Run this website through a local/server HTTP URL (not file://).
(async function () {
  async function insert(id, url) {
    const target = document.getElementById(id);
    if (!target) return;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      target.innerHTML = await response.text();
    } catch (error) {
      console.error(`Unable to load ${url}:`, error);
    }
  }
  await Promise.all([
    insert('site-header', 'Component/header.html'),
    insert('site-footer', 'Component/footer.html')
  ]);
  document.dispatchEvent(new CustomEvent('site-components-ready'));
})();
