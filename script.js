// Toggle between Short and Long Portfolio
function toggleForm(type) {
    const shortForm = document.getElementById('short-form');
    const longForm = document.getElementById('long-form');
    const shortFormButton = document.getElementById('shortFormButton');
    const longFormButton = document.getElementById('longFormButton');

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
  }

  // Toggle mobile menu
  function toggleMenu() {
    const menu = document.getElementById('menu');
    const hamburger = document.querySelector('.hamburger');
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
  }

  // Header scroll effect
  window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

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
      
      // Animate the percentage number
      let current = 0;
      const target = parseInt(percent);
      const increment = target / 20; // Adjust speed here
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
    
    skillLevels.forEach(level => {
      level.style.width = '0';
    });
    
    skillPercents.forEach(percent => {
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
    
    // Check scroll direction
    const scrollingDown = currentScrollPosition > lastScrollPosition;
    lastScrollPosition = currentScrollPosition;
    
    // Handle skill bar animation
    if (skillsPosition < windowHeight - 100 && skillsPosition > -skillsSection.offsetHeight) {
      if (scrollingDown && !skillAnimated) {
        animateSkillBars();
      } else if (!scrollingDown && skillAnimated) {
        resetSkillBars();
      }
    }
    
    // Handle other reveal animations
    for (let i = 0; i < reveals.length; i++) {
      const revealTop = reveals[i].getBoundingClientRect().top;
      const revealPoint = 100;
      
      if (revealTop < windowHeight - revealPoint) {
        reveals[i].classList.add('active');
      }
    }
  }
  
  // Event listeners
  window.addEventListener('scroll', scrollReveal);
  window.addEventListener('load', scrollReveal);
