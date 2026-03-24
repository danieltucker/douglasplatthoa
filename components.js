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
        <li><a href="${to('#documents')}">Documents</a></li>
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

  // ─── DOCUMENT PASSWORD MODAL ────────────────────────────
  // Injects shared modal CSS, HTML, and fetch-based auth logic.
  // The password the user types is passed directly to the server
  // via HTTP Basic Auth — no client-side password comparison.

  const modalCSS = `
    .doc-modal-overlay {
      display: none; position: fixed; inset: 0; z-index: 999;
      background: rgba(0,0,0,.45); backdrop-filter: blur(4px);
      align-items: center; justify-content: center;
    }
    .doc-modal-overlay.active { display: flex; }
    .doc-modal {
      background: #ffffff; border-radius: 16px;
      padding: 2rem 2.2rem; max-width: 400px; width: 90%;
      box-shadow: 0 6px 28px rgba(45,90,39,.14);
    }
    .doc-modal h3 {
      font-family: 'Playfair Display', serif;
      color: #2d5a27; font-size: 1.3rem; margin-bottom: .5rem;
    }
    .doc-modal p { font-size: .92rem; color: #4a4a4a; margin-bottom: 1.2rem; }
    .doc-modal input[type="password"] {
      width: 100%; padding: .65rem .9rem; border-radius: 8px;
      border: 1.5px solid rgba(125,186,110,.4);
      font-family: 'Nunito', sans-serif;
      font-size: .95rem; margin-bottom: .5rem; outline: none;
      transition: border-color .2s; box-sizing: border-box;
    }
    .doc-modal input[type="password"]:focus { border-color: #4a8c3f; }
    .doc-modal-error { font-size: .82rem; color: #c0392b; min-height: 1.1em; margin-bottom: .7rem; }
    .doc-modal-btns { display: flex; gap: .75rem; justify-content: flex-end; margin-top: .5rem; }
    .doc-modal-loading { font-size: .82rem; color: #4a8c3f; min-height: 1.1em; margin-bottom: .7rem; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = modalCSS;
  document.head.appendChild(styleEl);

  const modalHTML = `
    <div class="doc-modal-overlay" id="doc-modal-overlay">
      <div class="doc-modal">
        <h3>🔒 Password Required</h3>
        <p>HOA documents are password-protected. Contact <strong>board@ferndalehoa.com</strong> to request access.</p>
        <input type="password" id="doc-modal-input" placeholder="Enter password…" />
        <div class="doc-modal-error" id="doc-modal-error"></div>
        <div class="doc-modal-loading" id="doc-modal-loading"></div>
        <div class="doc-modal-btns">
          <button class="btn btn-secondary" style="padding:.55rem 1.1rem;font-size:.88rem;" id="doc-modal-cancel">Cancel</button>
          <button class="btn btn-primary"   style="padding:.55rem 1.1rem;font-size:.88rem;" id="doc-modal-submit">Open Document</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  let pendingHref = null;

  function openModal(href) {
    pendingHref = href;
    document.getElementById('doc-modal-input').value = '';
    document.getElementById('doc-modal-error').textContent = '';
    document.getElementById('doc-modal-loading').textContent = '';
    document.getElementById('doc-modal-overlay').classList.add('active');
    setTimeout(() => document.getElementById('doc-modal-input').focus(), 50);
  }

  function closeModal() {
    document.getElementById('doc-modal-overlay').classList.remove('active');
    pendingHref = null;
  }

  // Intercept all doc-card clicks
  document.addEventListener('click', function (e) {
    const card = e.target.closest('.doc-card');
    if (card) {
      e.preventDefault();
      openModal(card.getAttribute('href'));
    }
  });

  document.getElementById('doc-modal-cancel').addEventListener('click', closeModal);

  document.getElementById('doc-modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  async function tryOpenDoc() {
    const password = document.getElementById('doc-modal-input').value;
    if (!password) {
      document.getElementById('doc-modal-error').textContent = 'Please enter a password.';
      return;
    }

    const errorEl   = document.getElementById('doc-modal-error');
    const loadingEl = document.getElementById('doc-modal-loading');
    const submitBtn = document.getElementById('doc-modal-submit');

    errorEl.textContent   = '';
    loadingEl.textContent = 'Verifying…';
    submitBtn.disabled    = true;

    try {
      const resp = await fetch(pendingHref, {
        headers: { 'Authorization': 'Basic ' + btoa('board:' + password) }
      });

      if (resp.ok) {
        const blob = await resp.blob();
        const url  = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 30000);
        closeModal();
      } else if (resp.status === 401) {
        errorEl.textContent = 'Incorrect password. Please contact the board for access.';
      } else {
        errorEl.textContent = 'Could not load document (error ' + resp.status + '). Please try again.';
      }
    } catch (err) {
      errorEl.textContent = 'Network error — please check your connection and try again.';
    } finally {
      loadingEl.textContent = '';
      submitBtn.disabled    = false;
    }
  }

  document.getElementById('doc-modal-submit').addEventListener('click', tryOpenDoc);
  document.getElementById('doc-modal-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') tryOpenDoc();
  });

})();
