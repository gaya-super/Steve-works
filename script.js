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

// Skill bar animation variables
let skillAnimated = false;
let lastScrollPosition = 0;

// Animate skill bars to their full width
function animateSkillBars() {
  const skillLevels = document.querySelectorAll('.skill-level');
  const skillPercents = document.querySelectorAll('.skill-percent');

  skillLevels.forEach((level, index) => {
    const percent = level.getAttribute('data-percent');
    level.style.width = percent + '%';

    let current = 0;
    const target = parseInt(percent, 10);
    const increment = target / 20;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(timer);
        current = target;
      }
      skillPercents[index].textContent = Math.floor(current) + '%';
    }, 20);
  });

  skillAnimated = true;
}

// Reset skill bars to 0
function resetSkillBars() {
  const skillLevels = document.querySelectorAll('.skill-level');
  const skillPercents = document.querySelectorAll('.skill-percent');

  skillLevels.forEach((level) => {
    level.style.width = '0';
  });

  skillPercents.forEach((percent) => {
    percent.textContent = '0%';
  });

  skillAnimated = false;
}

// Scroll reveal animation with skill bar handling
function scrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const currentScrollPosition = window.scrollY;
  const skillsSection = document.getElementById('experience');
  const skillsPosition = skillsSection.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  const scrollingDown = currentScrollPosition > lastScrollPosition;
  lastScrollPosition = currentScrollPosition;

  if (skillsPosition < windowHeight - 100 && skillsPosition > -skillsSection.offsetHeight) {
    if (scrollingDown && !skillAnimated) {
      animateSkillBars();
    } else if (!scrollingDown && skillAnimated) {
      resetSkillBars();
    }
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
