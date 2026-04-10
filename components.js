(function () {
  // Detect if we're on the home page so links resolve correctly
  const isHome = /\/(index\.html)?$/.test(window.location.pathname);
  const base = isHome ? '' : 'index.html';

  function to(hash) {
    return base + hash;
  }

  // ─── NAV ────────────────────────────────────────────────
  const navEl = document.getElementById('site-nav');
  if (navEl) {
    navEl.innerHTML = `
      <a href="index.html" class="nav-logo">
        <span class="leaf">🌿</span>
        Douglas Plats HOA
      </a>
      <ul class="nav-links">
        <li><a href="${to('#news')}">News</a></li>
        <li><a href="budget-meeting-2026.html">2026 Meeting</a></li>
        <li><a href="documents.html">Documents</a></li>
        <li><a href="${to('#contact')}">Contact</a></li>
      </ul>
      <a href="${to('#contact')}" class="btn btn-primary" style="padding:.55rem 1.2rem; font-size:.88rem;">Get in Touch</a>
    `;
  }

  // ─── FOOTER ─────────────────────────────────────────────
  const footerEl = document.getElementById('site-footer');
  if (footerEl) {
    footerEl.innerHTML = `
      <div class="footer-inner">
        <div class="footer-logo">🌿 Douglas Plats HOA</div>
        <div class="footer-links">
          <a href="${to('#news')}">News</a>
          <a href="documents.html">Documents</a>
          <a href="${to('#contact')}">Contact</a>
        </div>
      </div>
      <div class="footer-inner">
        <p class="footer-copy">© 2026 Douglas Plats Homeowners Association · All rights reserved.<br>
        Designed &amp; Hosted by <a href="https://bellinghamhosting.com" target="_blank" style="color:rgba(255,255,255,.6); text-decoration:underline;">bellinghamhosting.com</a></p>
      </div>
    `;
  }


})();
