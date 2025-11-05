document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navList   = document.getElementById('nav-list');
  const scrollTop = document.getElementById('scrolltop');
  const live      = document.getElementById('sr-live');

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

  // Language switcher (static pages)
  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === 'cs') window.location.href = 'index.html';
      if (lang === 'ua') window.location.href = 'index-ua.html';
      if (lang === 'ru') window.location.href = 'index-ru.html';
    });
  });
});

/* Mobile language dropdown injected */

  // Mobile language dropdown
  (function(){
    const wrap = document.querySelector('.lang-switch');
    if(!wrap) return;
    const btns = Array.from(wrap.querySelectorAll('button[data-lang]'));
    if(btns.length === 0) return;
    // Detect current language from .active
    const current = (btns.find(b => b.classList.contains('active'))?.textContent || 'LANG').trim();
    // Create toggle + dropdown container
    const toggle = document.createElement('button');
    toggle.className = 'lang-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML = '🌐 ' + current;
    const menu = document.createElement('div');
    menu.className = 'lang-menu';
    // Move clones of existing buttons into menu (preserve data-lang)
    btns.forEach(b => {
      const item = document.createElement('button');
      item.type = 'button';
      item.dataset.lang = b.dataset.lang;
      item.textContent = b.textContent;
      if (b.classList.contains('active')) item.classList.add('active');
      item.addEventListener('click', () => {
        const lang = item.dataset.lang;
        if (lang === 'cs') window.location.href = 'index.html';
        if (lang === 'ua' || lang === 'uk') window.location.href = 'index-ua.html';
        if (lang === 'ru') window.location.href = 'index-ru.html';
      });
      menu.appendChild(item);
    });
    // Insert into DOM
    wrap.appendChild(toggle);
    wrap.appendChild(menu);
    // Toggle open/close on mobile
    const open = () => { wrap.classList.add('open'); toggle.setAttribute('aria-expanded','true'); };
    const close = () => { wrap.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); };
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (wrap.classList.contains('open')) close(); else open();
    });
    document.addEventListener('click', () => close());
    // Accessibility: close on Escape
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });

    // Desktop: keep original inline buttons visible; the CSS hides them only on mobile
  })();

