// Shared preference key and system default; no calculator engine is loaded on articles.
(() => {
    let saved;
    try { saved = localStorage.getItem('theme'); } catch { /* Reading works without storage. */ }
    document.body.classList.toggle('dark-mode', saved === 'dark' || (saved !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches));
    document.addEventListener('DOMContentLoaded', () => {
        const button = document.getElementById('knowledge-theme');
        const label = () => { button.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode'; };
        label();
        button.hidden = false;
        button.addEventListener('click', () => {
            const dark = document.body.classList.toggle('dark-mode');
            try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch { /* Session-only theme still works. */ }
            label();
        });
        // The existing GA4 configuration disables automatic page_view for the calculator SPA.
        // Articles are static navigations, so send one page view using that same configuration.
        if (typeof window.gtag === 'function') window.gtag('event', 'page_view', {page_title: document.title, page_location: location.href, page_path: location.pathname});
        if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js').catch(() => { /* Content remains usable online. */ });
    });
})();
