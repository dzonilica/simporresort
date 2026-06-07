/* ══════════════════════════════════════
   SIMPOR DOG RESORT — STANDALONE SCRIPT
══════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);


/* ─── I18N (EN / SR) ─── */
function getLang() {
  return localStorage.getItem('simpor-lang') || 'sr';
}
function applyLanguage(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem('simpor-lang', lang);

  document.querySelectorAll('[data-sr]').forEach(el => {
    if (el.dataset.en === undefined) el.dataset.en = el.textContent;
    el.textContent = lang === 'sr' ? el.dataset.sr : el.dataset.en;
  });
  document.querySelectorAll('[data-sr-html]').forEach(el => {
    if (el.dataset.enHtml === undefined) el.dataset.enHtml = el.innerHTML;
    el.innerHTML = lang === 'sr' ? el.dataset.srHtml : el.dataset.enHtml;
  });
  document.querySelectorAll('[data-sr-placeholder]').forEach(el => {
    if (el.dataset.enPlaceholder === undefined) el.dataset.enPlaceholder = el.placeholder || '';
    el.placeholder = lang === 'sr' ? el.dataset.srPlaceholder : el.dataset.enPlaceholder;
  });
  document.querySelectorAll('[data-sr-title]').forEach(el => {
    if (el.dataset.enTitle === undefined) el.dataset.enTitle = el.getAttribute('title') || '';
    el.setAttribute('title', lang === 'sr' ? el.dataset.srTitle : el.dataset.enTitle);
  });
  // <title> tag
  const t = document.querySelector('title[data-sr]');
  if (t) {
    if (t.dataset.en === undefined) t.dataset.en = t.textContent;
    document.title = lang === 'sr' ? t.dataset.sr : t.dataset.en;
  }

  // Toggle UI (all toggle variants — desktop nav, mobile nav, mobile overlay)
  document.querySelectorAll('[data-lang-set]').forEach(a => {
    a.classList.toggle('active', a.dataset.langSet === lang);
  });
}
function toggleLanguage(lang) { applyLanguage(lang); }
window.toggleLanguage = toggleLanguage;
// Apply language as early as possible (before DOMContentLoaded fires for body)
applyLanguage(getLang());
document.addEventListener('DOMContentLoaded', () => applyLanguage(getLang()));


/* ─── ACTIVE PAGE INDICATOR ─── */
function markActivePage() {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('#nav .nav-links a, .mobile-overlay a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase().split('#')[0];
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}
document.addEventListener('DOMContentLoaded', markActivePage);

/* ─── LOADER ─── */
const HAS_LOADER = !!document.getElementById('loader');
const HAS_RESORT_HERO = !!document.getElementById('resort-hero');

if (HAS_LOADER) {
  const loaderTL = gsap.timeline({
    onComplete: () => {
      const loader = document.getElementById('loader');
      if (loader) loader.style.pointerEvents = 'none';
      updateNavState();
      if (HAS_RESORT_HERO) startResortHero();
    }
  });

  loaderTL
    .from('#loaderIcon', { opacity: 0, scale: 0.6, duration: 0.55, ease: 'back.out(1.4)' })
    .from('#loaderLogo div:nth-child(2)', { opacity: 0, y: 8, duration: 0.4 }, '-=0.1')
    .to('#loaderLine', { width: 80, duration: 0.55, ease: 'power2.inOut' })
    .to('#loaderSub', { opacity: 1, y: 0, duration: 0.4 }, '-=0.1')
    .to({}, { duration: 0.4 })
    .to('#loaderLogo', { opacity: 0, y: -18, duration: 0.4, ease: 'power2.in' })
    .to('#loaderPanelTop', {
      scaleY: 0, duration: 0.85,
      ease: 'power4.inOut', transformOrigin: 'top'
    }, '-=0.08');
} else {
  // No loader on this page — kick off page-level effects immediately
  document.addEventListener('DOMContentLoaded', () => {
    updateNavState();
    if (HAS_RESORT_HERO) startResortHero();
  });
}


/* ─── HERO ENTRANCE ─── */
function startResortHero() {
  gsap.set('.resort-hero-tag', { opacity: 0, x: -20 });
  gsap.set('.resort-breadcrumb', { opacity: 0, y: 10 });
  gsap.set('#resortBadge', { opacity: 0 });

  gsap.timeline()
    .to('#resortHeroBg', { scale: 1, duration: 2.2, ease: 'power3.out' })
    .to('.resort-hero-tag', { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, 0.3)
    .to('.resort-breadcrumb', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2)
    .to('.resort-hero-h1 .line-inner', { y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.14 }, 0.5)
    .to('.resort-hero-sub', { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, 1.1)
    .to('.resort-hero-ctas', { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 1.35)
    .to('#resortBadge', { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.5)
    .to('#scrollHint', { opacity: 1, duration: 0.5 }, 1.75);
}


/* ─── HERO PARALLAX ─── */
if (HAS_RESORT_HERO && document.getElementById('resortHeroBg')) {
  gsap.to('#resortHeroBg', {
    yPercent: 22, ease: 'none',
    scrollTrigger: {
      trigger: '#resort-hero', start: 'top top', end: 'bottom top', scrub: true
    }
  });
}


/* ─── SCROLL REVEALS ─── */
gsap.utils.toArray('.fade-up').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
    delay: (i % 3) * 0.06,
    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
  });
});

gsap.utils.toArray('.fade-right').forEach((el) => {
  gsap.to(el, {
    opacity: 1, x: 0, duration: 0.95, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
  });
});


/* ─── CLIP REVEAL ─── */
gsap.utils.toArray('.clip-reveal').forEach((el, i) => {
  gsap.to(el, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 0.9, ease: 'power3.inOut',
    delay: i * 0.08,
    scrollTrigger: { trigger: el, start: 'top 90%' }
  });
});


/* ─── FEATURES STAGGER ─── */
gsap.utils.toArray('.resort-feature').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 48 },
    {
      opacity: 1, y: 0, duration: 0.85, ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 88%' },
      delay: i * 0.08
    }
  );
});


/* ─── GALLERY CLIP WIPE ─── */
gsap.utils.toArray('.rg-item').forEach((item, i) => {
  gsap.fromTo(item,
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.9, ease: 'power3.inOut',
      scrollTrigger: { trigger: item, start: 'top 90%' },
      delay: i * 0.1
    }
  );
});


/* ─── ACHIEVEMENT ITEMS ─── */
gsap.utils.toArray('.ach-item').forEach((item, i) => {
  gsap.fromTo(item,
    { opacity: 0, x: -20 },
    {
      opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: item, start: 'top 88%' },
      delay: i * 0.1
    }
  );
});


/* ─── NAV SCROLL ─── */
function updateNavState() {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', updateNavState, { passive: true });
updateNavState();


/* ─── MOBILE MENU ─── */
function toggleMobile() {
  const m = document.getElementById('mobileOverlay');
  const h = document.querySelector('.hamburger');
  if (m) m.classList.toggle('open');
  if (h) h.classList.toggle('active');
}
function closeMobile() {
  const m = document.getElementById('mobileOverlay');
  const h = document.querySelector('.hamburger');
  if (m) m.classList.remove('open');
  if (h) h.classList.remove('active');
}
window.toggleMobile = toggleMobile;
window.closeMobile = closeMobile;


/* ─── SMOOTH ANCHOR LINKS ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* ══════════════════════════════════════
   PHOTO STRIP — DRAG SCROLL + LIGHTBOX
══════════════════════════════════════ */
(function(){
  const wrap = document.getElementById('pgStripWrap');
  if (!wrap) return;

  const thumbs = document.querySelectorAll('.pg-thumb');
  const totalEl = document.getElementById('pgTotal');
  if (totalEl) totalEl.textContent = String(thumbs.length).padStart(2, '0');

  let isDown = false, startX = 0, scrollLeft = 0;
  wrap.addEventListener('mousedown', e => {
    isDown = true; startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
    wrap.style.userSelect = 'none';
  });
  wrap.addEventListener('mouseleave', () => { isDown = false; });
  wrap.addEventListener('mouseup', () => { isDown = false; wrap.style.userSelect = ''; });
  wrap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX) * 1.4;
    updatePgCounter();
  });
  wrap.addEventListener('touchstart', e => {
    startX = e.touches[0].pageX; scrollLeft = wrap.scrollLeft;
  }, { passive: true });
  wrap.addEventListener('touchmove', e => {
    wrap.scrollLeft = scrollLeft - (e.touches[0].pageX - startX) * 1.2;
    updatePgCounter();
  }, { passive: true });
  wrap.addEventListener('scroll', updatePgCounter, { passive: true });

  // Build lightbox items list and bind click
  const pgItems = [];
  thumbs.forEach(th => {
    pgItems.push({
      type: th.dataset.type || 'image',
      src: th.dataset.src
    });
    th.addEventListener('click', () => openPgLb(parseInt(th.dataset.idx, 10)));
  });
  window._pgItems = pgItems;
})();

function pgScroll(dir) {
  const wrap = document.getElementById('pgStripWrap');
  if (!wrap) return;
  wrap.scrollLeft += dir * 420;
  setTimeout(updatePgCounter, 430);
}
function updatePgCounter() {
  const wrap = document.getElementById('pgStripWrap');
  if (!wrap) return;
  const first = wrap.querySelector('.pg-thumb');
  if (!first) return;
  const w = first.offsetWidth + 12;
  const idx = Math.round(wrap.scrollLeft / w);
  const el = document.getElementById('pgCurrent');
  if (el) el.textContent = String(idx + 1).padStart(2, '0');
}
window.pgScroll = pgScroll;


/* ─── PHOTO STRIP LIGHTBOX ─── */
let _pgCur = 0;
function openPgLb(idx) {
  const lb = document.getElementById('pgLightbox');
  const items = window._pgItems;
  if (!lb || !items || idx < 0 || idx >= items.length) return;
  _pgCur = idx;
  const item = items[idx];
  const img = document.getElementById('pgLbImg');
  const vid = document.getElementById('pgLbVid');
  if (item.type === 'video') {
    img.style.display = 'none';
    vid.style.display = 'block';
    vid.src = item.src;
    vid.load();
  } else {
    if (vid) { vid.pause(); vid.src = ''; vid.style.display = 'none'; }
    img.style.display = 'block';
    img.src = item.src;
  }
  const info = document.getElementById('pgLbInfo');
  if (info) info.textContent = (idx + 1) + ' / ' + items.length;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePgLb() {
  const lb = document.getElementById('pgLightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
  const vid = document.getElementById('pgLbVid');
  if (vid) { vid.pause(); vid.src = ''; }
}
function pgLbNav(dir) {
  const items = window._pgItems;
  if (!items) return;
  openPgLb((_pgCur + dir + items.length) % items.length);
}

document.getElementById('pgLbClose')?.addEventListener('click', closePgLb);
document.getElementById('pgLbPrev')?.addEventListener('click', () => pgLbNav(-1));
document.getElementById('pgLbNext')?.addEventListener('click', () => pgLbNav(1));
document.getElementById('pgLightbox')?.addEventListener('click', e => {
  if (e.target.id === 'pgLightbox') closePgLb();
});


/* ─── RESORT GALLERY LIGHTBOX ─── */
const _rgItems = [
  'images/res1.jpg',
  'images/res2.jpg',
  'images/res5.jpg',
  'images/res6.jpg',
  'images/res7.jpg'
];
let _rgCur = 0;

function openRgLb(idx) {
  _rgCur = idx;
  const lb = document.getElementById('rgLightbox');
  const img = document.getElementById('rgLbImg');
  if (!lb || !img) return;
  img.src = _rgItems[idx];
  const info = document.getElementById('rgLbInfo');
  if (info) info.textContent = (idx + 1) + ' / ' + _rgItems.length;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeRgLb() {
  const lb = document.getElementById('rgLightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}
function rgLbNav(dir) {
  _rgCur = (_rgCur + dir + _rgItems.length) % _rgItems.length;
  const img = document.getElementById('rgLbImg');
  if (img) img.src = _rgItems[_rgCur];
  const info = document.getElementById('rgLbInfo');
  if (info) info.textContent = (_rgCur + 1) + ' / ' + _rgItems.length;
}

document.querySelectorAll('.rg-item').forEach(item => {
  item.addEventListener('click', () => openRgLb(parseInt(item.dataset.rg, 10)));
});
document.getElementById('rgLbClose')?.addEventListener('click', closeRgLb);
document.getElementById('rgLbPrev')?.addEventListener('click', () => rgLbNav(-1));
document.getElementById('rgLbNext')?.addEventListener('click', () => rgLbNav(1));
document.getElementById('rgLightbox')?.addEventListener('click', e => {
  if (e.target.id === 'rgLightbox') closeRgLb();
});


/* ─── KEYBOARD LIGHTBOX NAV ─── */
document.addEventListener('keydown', e => {
  const rg = document.getElementById('rgLightbox');
  const pg = document.getElementById('pgLightbox');
  if (rg?.classList.contains('open')) {
    if (e.key === 'Escape') closeRgLb();
    if (e.key === 'ArrowLeft') rgLbNav(-1);
    if (e.key === 'ArrowRight') rgLbNav(1);
  } else if (pg?.classList.contains('open')) {
    if (e.key === 'Escape') closePgLb();
    if (e.key === 'ArrowLeft') pgLbNav(-1);
    if (e.key === 'ArrowRight') pgLbNav(1);
  }
});
