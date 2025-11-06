document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navList   = document.getElementById('nav-list');
  const scrollTop = document.getElementById('scrolltop');
  const live      = document.getElementById('sr-live');

  // Existing Nav Toggle Logic
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
      if (live) live.textContent = expanded ? 'Menu zavřeno' : 'Menu otevřeno';
    });
  }

  // Scroll to top button
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) scrollTop.classList.add('show');
      else scrollTop.classList.remove('show');
    });
    scrollTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        if (navList) navList.classList.remove('show');
        if (navToggle) navToggle.setAttribute('aria-expanded','false');
      }
    });
  });

  // --- NEW LANGUAGE SWITCHER LOGIC ---
  const langToggle = document.querySelector('.lang-toggle');
  const langList = document.querySelector('.lang-list');
  const langSwitcher = document.querySelector('.language-switcher');
  
  if (langToggle && langList) {
    // 1. Dropdown Toggle Functionality
    function toggleLangMenu() {
        // Проверяем, открыто ли меню навигации, и если да, закрываем его для UX
        if (navList && navList.classList.contains('show')) {
             navList.classList.remove('show');
             if (navToggle) navToggle.setAttribute('aria-expanded','false');
        }

        const isExpanded = langToggle.getAttribute('aria-expanded') === 'true';
        langToggle.setAttribute('aria-expanded', String(!isExpanded));
        langList.classList.toggle('is-open');
    }

    langToggle.addEventListener('click', toggleLangMenu);

    // 2. Close dropdown on outside click
    document.addEventListener('click', function(event) {
        const isClickInside = langSwitcher.contains(event.target);

        if (!isClickInside && langList.classList.contains('is-open')) {
            toggleLangMenu(); 
        }
    });
  }

  // 3. Language switcher (static pages) - ADAPTED TO NEW A TAGS
  document.querySelectorAll('.lang-item').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault(); 
      
      const lang = a.dataset.lang;
      
      if (lang === 'cs') window.location.href = 'index.html';
      if (lang === 'ua') window.location.href = 'index-ua.html';
      if (lang === 'ru') window.location.href = 'index-ru.html';
    });
  });
  // --- END NEW LANGUAGE SWITCHER LOGIC ---
});
