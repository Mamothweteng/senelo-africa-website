/* =========================================================
   SENELO AFRICA GROUP HOLDINGS — MAIN.JS
   ========================================================= */

// -----------------------------------------------------------
// 1. APP DATA — add a new web app by adding an object here.
//    Each app renders as a card in the #appGrid section.
//    status: "live" | "dev"
//    launchType: "link" (opens in new tab) or "embed" (opens
//    an /apps/<slug>.html page with the app in an iframe)
// -----------------------------------------------------------


// -----------------------------------------------------------
// 2. RENDER APP CARDS
// -----------------------------------------------------------
function renderApps() {
  const grid = document.getElementById('appGrid');
  const statApps = document.getElementById('statApps');
  if (!grid) return;

  grid.innerHTML = apps.map(app => {
    const isLive = app.status === 'live';
    const tag = isLive ? 'a' : 'div';
    const linkAttrs = isLive ? `href="${app.url}" target="_blank" rel="noopener"` : '';

    return `
      <${tag} class="app-card ${isLive ? '' : 'is-pending'}" ${linkAttrs}>
        <div class="app-icon-wrap"><div class="app-icon"></div></div>
        <h3>${app.name}</h3>
        <p>${app.description}</p>
        <span class="app-status ${isLive ? '' : 'status-dev'}">
          ${isLive ? 'Live' : 'In development'}
        </span>
        ${app.subdomain ? `<span class="app-subdomain">${app.subdomain}</span>` : ''}
        ${isLive ? '<span class="app-launch">Launch app</span>' : ''}
      </${tag}>
    `;
  }).join('');

  if (statApps) {
    const liveCount = apps.filter(a => a.status === 'live').length;
    animateCount(statApps, liveCount);
  }
}

// -----------------------------------------------------------
// 3. SIMPLE COUNT-UP ANIMATION FOR THE STATS ROW
// -----------------------------------------------------------
function animateCount(el, target) {
  let current = 0;
  const step = Math.max(1, Math.round(target / 20));
  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current < target) requestAnimationFrame(tick);
  };
  tick();
}

// -----------------------------------------------------------
// 4. MOBILE NAV TOGGLE
// -----------------------------------------------------------
function setupNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is tapped (mobile)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// -----------------------------------------------------------
// 5. FOOTER YEAR
// -----------------------------------------------------------
function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// -----------------------------------------------------------
// INIT
// -----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderApps();
  setupNavToggle();
  setYear();
});
