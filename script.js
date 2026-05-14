// Google Drive: show high-res thumbnail first; load Drive preview iframe on click (avoids fuzzy default poster)
function initDrivePosters() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.drive-poster');
    if (!btn) return;
    const id = btn.getAttribute('data-drive-id');
    const wrap = btn.closest('.video-embed--drive');
    if (!id || !wrap || wrap.dataset.loaded === '1') return;
    wrap.dataset.loaded = '1';
    const iframe = document.createElement('iframe');
    iframe.src = `https://drive.google.com/file/d/${id}/preview`;
    iframe.title = 'Google Drive video preview';
    iframe.loading = 'lazy';
    iframe.className = 'drive-preview-iframe';
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
    iframe.setAttribute('allowfullscreen', '');
    Object.assign(iframe.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      border: '0',
      maxWidth: '100%',
      maxHeight: '100%',
    });
    wrap.replaceChildren(iframe);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDrivePosters);
} else {
  initDrivePosters();
}

// Toggle between Short and Long Portfolio (light fade while switching)
function toggleForm(type) {
  const shortForm = document.getElementById('short-form');
  const longForm = document.getElementById('long-form');
  const shortFormButton = document.getElementById('shortFormButton');
  const longFormButton = document.getElementById('longFormButton');

  shortForm.classList.add('is-switching');
  longForm.classList.add('is-switching');

  window.requestAnimationFrame(() => {
    if (type === 'short') {
      shortForm.style.display = 'flex';
      longForm.style.display = 'none';
      shortFormButton.classList.add('active');
      longFormButton.classList.remove('active');
    } else {
      shortForm.style.display = 'none';
      longForm.style.display = 'flex';
      shortFormButton.classList.remove('active');
      longFormButton.classList.add('active');
    }

    window.requestAnimationFrame(() => {
      shortForm.classList.remove('is-switching');
      longForm.classList.remove('is-switching');
    });
  });
}

// Toggle mobile menu
function toggleMenu() {
  const menu = document.getElementById('menu');
  const hamburger = document.querySelector('.hamburger');
  menu.classList.toggle('active');
  hamburger.classList.toggle('active');
}

// Skill bars: fill once when section is seen, then irregular ±1–2% “live meter” flicker (no reset to 0)
let skillsFilled = false;
let skillFlickerTimeoutId = null;

function getSkillElements() {
  return {
    levels: document.querySelectorAll('.skill-level'),
    percents: document.querySelectorAll('.skill-percent'),
  };
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function skillFlickerTick() {
  const { levels, percents } = getSkillElements();
  levels.forEach((level, index) => {
    const base = parseInt(level.getAttribute('data-percent'), 10);
    const delta = Math.floor(Math.random() * 5) - 2; // -2 .. +2
    const v = Math.max(0, Math.min(100, base + delta));
    level.style.width = `${v}%`;
    percents[index].textContent = `${v}%`;
  });
  const delay = randomBetween(500, 1000);
  skillFlickerTimeoutId = window.setTimeout(skillFlickerTick, delay);
}

function startSkillFlicker() {
  if (skillFlickerTimeoutId !== null) return;
  const exp = document.getElementById('experience');
  if (exp) exp.classList.add('skills-live');
  skillFlickerTick();
}

function fillSkillBarsOnce() {
  if (skillsFilled) return;
  const { levels, percents } = getSkillElements();
  if (!levels.length) return;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      levels.forEach((level, index) => {
        const percent = level.getAttribute('data-percent');
        level.style.width = `${percent}%`;
        percents[index].textContent = `${percent}%`;
      });
      skillsFilled = true;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      window.setTimeout(startSkillFlicker, 1050);
    });
  });
}

// Scroll reveal animation with skill bar handling
function scrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const skillsSection = document.getElementById('experience');
  const skillsPosition = skillsSection.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  if (skillsPosition < windowHeight - 100 && skillsPosition > -skillsSection.offsetHeight) {
    fillSkillBarsOnce();
  }

  for (let i = 0; i < reveals.length; i++) {
    const revealTop = reveals[i].getBoundingClientRect().top;
    const revealPoint = 100;

    if (revealTop < windowHeight - revealPoint) {
      reveals[i].classList.add('active');
    }
  }
}

let scrollScheduled = false;
function onScrollFrame() {
  scrollScheduled = false;
  const header = document.getElementById('main-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  scrollReveal();
}

function onScroll() {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(onScrollFrame);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', onScrollFrame);
