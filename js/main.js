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
// HERO LOGO — MOUSE-TILT PARALLAX
// -----------------------------------------------------------
function setupHeroTilt() {
  const stage = document.getElementById('heroVisual');
  const logo = document.getElementById('heroLogo');
  if (!stage || !logo) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const maxTilt = 16;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

  function render() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    logo.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg)`;
    requestAnimationFrame(render);
  }

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = relX * maxTilt * 2;
    targetY = relY * -maxTilt * 2;
  });

  stage.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  requestAnimationFrame(render);
}

// -----------------------------------------------------------
// INIT
// -----------------------------------------------------------


// -----------------------------------------------------------
// ABOUT: slide the grey name print in when the section scrolls into view
// -----------------------------------------------------------
function setupAboutPrint() {
  const about = document.getElementById('about');
  if (!about) return;

  if (!('IntersectionObserver' in window)) {
    about.classList.add('is-visible');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Slide in when 25% of the section is on screen, slide out when less
      about.classList.toggle('is-visible', entry.intersectionRatio >= 0.25);
    });
  }, { threshold: 0.25 });

  observer.observe(about);
}
function setupIndustryCarousel() {
  const track = document.getElementById('industryTrack');
  if (!track) return;

  // Wrap the cards in a moving strip
  const strip = document.createElement('div');
  strip.className = 'industry-strip';
  while (track.firstChild) strip.appendChild(track.firstChild);

  // Duplicate the cards so the loop never shows a gap
  Array.from(strip.querySelectorAll('.industry-item')).forEach((card) => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    strip.appendChild(copy);
  });

  track.appendChild(strip);
}

// -----------------------------------------------------------
// ABOUT: scale the SENEMATI print so its letters fill the section height
// -----------------------------------------------------------
function fitAboutPrint() {
  const about = document.getElementById('about');
  const print = about ? about.querySelector('.about-print') : null;
  const text = print ? print.querySelector('.about-print-text') : null;
  const row = about ? about.querySelector('.mission-row') : null;
  if (!text || !row || print.offsetParent === null) return; // hidden on small screens

  const fill = 0.58; // share of the section height the word covers (0.5 = smaller, 0.7 = bigger)

  // size the word
  text.style.fontSize = '100px';
  const naturalLength = text.getBoundingClientRect().height;
  const fitToHeight = 100 * (about.clientHeight * fill) / naturalLength;
  const fitToWidth = print.clientWidth * 0.8; // never wider than the empty space
  text.style.fontSize = Math.min(fitToHeight, fitToWidth) + 'px';
  const length = text.getBoundingClientRect().height;

  // centre the word on the middle of the Mission / Vision row
  const a = about.getBoundingClientRect();
  const r = row.getBoundingClientRect();
  const rowCenter = r.top - a.top + r.height / 2;
  let top = rowCenter - length / 2;
  top = Math.max(24, Math.min(top, about.clientHeight - length - 24)); // stay inside the section

  print.style.top = top + 'px';
  print.style.bottom = 'auto';
  print.style.height = length + 'px';
}
document.addEventListener('DOMContentLoaded', () => {
  renderApps();
  setupNavToggle();
  setYear();
  setupHeroTilt();
  setupAboutPrint();
  setupIndustryCarousel();
    fitAboutPrint();
  window.addEventListener('resize', fitAboutPrint);
  window.addEventListener('load', fitAboutPrint);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAboutPrint);
});
