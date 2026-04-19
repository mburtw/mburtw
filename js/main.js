/* ============================================================
   MOLLY BURT-WESTVIG — SHARED JAVASCRIPT
   ============================================================
   Include this file on every page: <script src="../js/main.js"></script>
   (Use <script src="js/main.js"></script> on index.html)
   ============================================================ */

/* ---- CUSTOM CURSOR ---- */
const dot = document.getElementById('cursor-dot');
if (dot) {
  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  });
  function registerHover(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
      el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
    });
  }
  registerHover('a, button, .link-hover, .work-item, .ex-row, .mb-logo-box');
}

/* ---- RANDOM LOGO ---- */
// ↓ EDIT: Add your logo filenames here (place files in /images/ folder)
const logoFiles = ['Logo_1.png', 'Logo_2.png', 'Logo_3.png', 'Logo_4.png'];
let lastLogo = '';

function randomLogo() {
  const available = logoFiles.filter(l => l !== lastLogo);
  const pick = available[Math.floor(Math.random() * available.length)];
  lastLogo = pick;
  return pick;
}

document.addEventListener('DOMContentLoaded', () => {
  const logoEl = document.getElementById('navLogo');
  if (logoEl) {
    // Set initial random logo
    const initial = randomLogo();
    logoEl.src = 'images/' + initial;
    logoEl.addEventListener('click', () => {
      logoEl.src = 'images/' + randomLogo();
    });
  }
});

/* ---- MOBILE MENU ---- */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('mbHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  }
  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  }
});

/* ---- CV OVERLAY ---- */
document.addEventListener('DOMContentLoaded', () => {
  const cvLink = document.getElementById('cvNavLink');
  const cvBackdrop = document.getElementById('cvBackdrop');
  const cvClose = document.getElementById('cvClose');

  if (cvLink && cvBackdrop) {
    cvLink.addEventListener('click', e => {
      e.preventDefault();
      cvBackdrop.classList.add('open');
    });
  }
  if (cvClose && cvBackdrop) {
    cvClose.addEventListener('click', () => cvBackdrop.classList.remove('open'));
  }
  if (cvBackdrop) {
    cvBackdrop.addEventListener('click', e => {
      if (e.target === cvBackdrop) cvBackdrop.classList.remove('open');
    });
  }
});

/* ---- FULLSCREEN IMAGE OVERLAY ---- */
// Called by individual pages with their own work items
function initFullscreen(itemSelector, overlayId) {
  const items = document.querySelectorAll(itemSelector);
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;

  const returnBtn = overlay.querySelector('.fs-return');
  const prevBtn = overlay.querySelector('#fsPrev');
  const nextBtn = overlay.querySelector('#fsNext');
  const imgWrap = overlay.querySelector('.fs-img-wrap');
  const capTitle = overlay.querySelector('.fs-cap-title');
  const capDate = overlay.querySelector('#fsCaptionDate');
  const capMat = overlay.querySelector('#fsCaptionMat');
  const capBlurb = overlay.querySelector('#fsCaptionBlurb');
  const counter = overlay.querySelector('.fs-counter');

  let visible = [];
  let idx = 0;

  function getVisible() {
    return Array.from(items).filter(i => i.style.display !== 'none');
  }

  function openAt(i) {
    visible = getVisible();
    idx = i;
    render();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function render() {
    const item = visible[idx];
    if (!item) return;
    const img = item.querySelector('img');
    const title = item.querySelector('.cap-title');
    const meta = item.querySelector('.cap-meta');

    if (imgWrap) {
      imgWrap.innerHTML = '';
      if (img) {
        const clone = img.cloneNode();
        clone.style.maxWidth = '100%';
        clone.style.maxHeight = '60vh';
        clone.style.objectFit = 'contain';
        imgWrap.appendChild(clone);
      }
    }
    if (capTitle && title) capTitle.textContent = title.textContent;
    if (counter) counter.textContent = (idx + 1) + ' / ' + visible.length;
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      visible = getVisible();
      const visIdx = visible.indexOf(item);
      if (visIdx !== -1) openAt(visIdx);
    });
  });

  if (returnBtn) returnBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', () => { idx = (idx - 1 + visible.length) % visible.length; render(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { idx = (idx + 1) % visible.length; render(); });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') { idx = (idx - 1 + visible.length) % visible.length; render(); }
    if (e.key === 'ArrowRight') { idx = (idx + 1) % visible.length; render(); }
  });
}
