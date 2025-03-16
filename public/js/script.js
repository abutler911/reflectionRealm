document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlRoot = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      htmlRoot.classList.add('dark-theme');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
      htmlRoot.classList.toggle('dark-theme');
      
      if (htmlRoot.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      } else {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    });
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
      menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
      });
    }
    
    document.addEventListener('click', function(event) {
      if (navLinks && navLinks.classList.contains('active') && !event.target.closest('nav')) {
        navLinks.classList.remove('active');
      }
    });
    
    const postCards = document.querySelectorAll('.post-card');
    
    if (postCards.length > 0) {
      postCards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 100 + index * 120);
      });
    }
    
    if (typeof Prism !== 'undefined') {
      Prism.highlightAll();
    }
  });