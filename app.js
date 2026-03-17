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
    function toggleLangMenu() {
        if (navList && navList.classList.contains('show')) {
             navList.classList.remove('show');
             if (navToggle) navToggle.setAttribute('aria-expanded','false');
        }
        const isExpanded = langToggle.getAttribute('aria-expanded') === 'true';
        langToggle.setAttribute('aria-expanded', String(!isExpanded));
        langList.classList.toggle('is-open');
    }

    langToggle.addEventListener('click', toggleLangMenu);

    document.addEventListener('click', function(event) {
        if (langSwitcher) {
            const isClickInside = langSwitcher.contains(event.target);
            if (!isClickInside && langList.classList.contains('is-open')) {
                toggleLangMenu(); 
            }
        }
    });
  }

  document.querySelectorAll('.lang-item').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault(); 
      const lang = a.dataset.lang;
      if (lang === 'cs') window.location.href = 'index.html';
      if (lang === 'ua') window.location.href = 'index-ua.html';
      if (lang === 'ru') window.location.href = 'index-ru.html';
    });
  });
});

// --- ДАННЫЕ TELEGRAM ---
const TOKEN = "8670035107:AAFqfKPaHcYkPJbc6riW5e0pwaICzBlbP34";
const CHAT_ID = "923191360";
const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

// Универсальный обработчик отправки форм
document.addEventListener('submit', function(e) {
    const form = e.target;
    
    if (form.id === 'tg-form' || form.id === 'calc-form') {
        e.preventDefault();

        let message = "";

        if (form.id === 'tg-form') {
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const userMsg = document.getElementById('message').value || "Без сообщения";

            message = `<b>🚀 Новая заявка (Контакты)!</b>\n`;
            message += `<b>Имя:</b> ${name}\n`;
            message += `<b>Телефон:</b> ${phone}\n`;
            message += `<b>Сообщение:</b> ${userMsg}`;
        }

        if (form.id === 'calc-form') {
            const type = document.getElementById('calc-type').value;
            const width = document.getElementById('calc-width').value;
            const height = document.getElementById('calc-height').value;
            const phone = document.getElementById('calc-phone').value;

            message = `<b>🧮 Новый расчёт (Калькулятор)!</b>\n`;
            message += `<b>Тип:</b> ${type}\n`;
            message += `<b>Размеры:</b> ${width} x ${height} мм\n`;
            message += `<b>Телефон:</b> ${phone}`;
        }

        fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                parse_mode: 'html',
                text: message
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Спасибо! Заявка отправлена в Telegram.');
                form.reset(); 
            } else {
                alert('Ошибка сервера. Проверьте настройки бота.');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка сети. Проверьте интернет.');
        });
    }
});
