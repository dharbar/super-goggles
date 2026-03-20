document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navList   = document.getElementById('nav-list');
  const scrollTop = document.getElementById('scrolltop');
  const live      = document.getElementById('sr-live');

  // --- НАВИГАЦИЯ (Мобильное меню) ---
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
      if (live) live.textContent = expanded ? 'Menu zavřeno' : 'Menu otevřeno';
    });
  }

  // --- КНОПКА ВВЕРХ ---
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) scrollTop.classList.add('show');
      else scrollTop.classList.remove('show');
    });
    scrollTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }

  // --- ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ ---
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

  // --- ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКОВ (Dropdown) ---
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

    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLangMenu();
    });

    document.addEventListener('click', (event) => {
        if (langSwitcher && !langSwitcher.contains(event.target) && langList.classList.contains('is-open')) {
            toggleLangMenu(); 
        }
    });
  }

  // Логика перехода по языкам
  document.querySelectorAll('.lang-item').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault(); 
      const lang = a.dataset.lang;
      if (lang === 'cs') window.location.href = 'index.html';
      if (lang === 'ua') window.location.href = 'index-ua.html';
      if (lang === 'ru') window.location.href = 'index-ru.html';
    });
  });

  // --- ОБОРАЧИВАЕМ КАРТИНКИ УСЛУГ ДЛЯ ZOOM-АНИМАЦИИ ---
  // Без этого overflow:hidden на .service не даёт нужного эффекта при scale
  document.querySelectorAll('.service img').forEach(img => {
    if (!img.parentElement.classList.contains('service__img-wrap')) {
      const wrap = document.createElement('div');
      wrap.className = 'service__img-wrap';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
    }
  });

  // --- SCROLL-REVEAL — плавное появление элементов ---
  const revealTargets = [
    '.card',
    '.service',
    '.slide',
    '.steps li',
    '.masonry img',
    '.hero__content',
    '.hero__media',
    '.section__title',
    '.calc',
    '.contact__form',
    '.contact__info',
  ];

  const allReveal = document.querySelectorAll(revealTargets.join(', '));
  allReveal.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // срабатывает только один раз
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  allReveal.forEach(el => observer.observe(el));

}); // Конец блока DOMContentLoaded

// --- ДАННЫЕ TELEGRAM ---
const TOKEN = "8670035107:AAFqfKPaHcYkPJbc6riW5e0pwaICzBlbP34"; 
const CHAT_ID = "923191360";
const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

// --- УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ОТПРАВКИ ФОРМ ---
document.addEventListener('submit', function(e) {
    const form = e.target;
    
    if (form.id === 'tg-form' || form.id === 'calc-form') {
        e.preventDefault();

        const pageLang = document.documentElement.lang || 'cs';
        const i18n = {
            cs: {
                errorPhone: 'Prosím, zadejte platné telefonní číslo (alespoň 9 číslic).',
                sending: 'Odesílání...',
                success: 'Děkujeme! Žádost byla odeslána.',
                serverError: 'Chyba serveru. Zkuste то později.',
                netError: 'Chyba sítě. Zkontrolujte připojení.'
            },
            ru: {
                errorPhone: 'Пожалуйста, введите корректный номер телефона (минимум 9 цифр).',
                sending: 'Отправка...',
                success: 'Спасибо! Заявка отправлена.',
                serverError: 'Ошибка сервера. Попробуйте позже.',
                netError: 'Ошибка сети. Проверьте интернет.'
            },
            uk: {
                errorPhone: 'Будь ласка, введіть коректний номер телефону (мінімум 9 цифр).',
                sending: 'Надсилання...',
                success: 'Дякуємо! Заявка відправлена.',
                serverError: 'Помилка сервера. Спробуйте пізніше.',
                netError: 'Помилка мережі. Перевірте інтернет.'
            }
        };

        const t = i18n[pageLang] || i18n.cs;

        const phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput) {
            const phoneValue = phoneInput.value.replace(/\D/g, ''); 
            if (phoneValue.length < 9) {
                alert(t.errorPhone);
                return;
            }
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = t.sending;

        let message = "";

        if (form.id === 'tg-form') {
            const name = form.querySelector('#name').value;
            const phone = form.querySelector('#phone').value;
            const userMsg = form.querySelector('#message').value || "—";

            message = `<b>🚀 Новая заявка (Контакты)</b>\n`;
            message += `<b>Имя:</b> ${name}\n`;
            message += `<b>Телефон:</b> ${phone}\n`;
            message += `<b>Сообщение:</b> ${userMsg}`;
        }

        if (form.id === 'calc-form') {
            const type = form.querySelector('#calc-type').value;
            const width = form.querySelector('#calc-width').value;
            const height = form.querySelector('#calc-height').value;
            const phone = form.querySelector('#calc-phone').value;

            message = `<b>🧮 Новый расчёт (Калькулятор)</b>\n`;
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
                alert(t.success);
                form.reset(); 
            } else {
                alert(t.serverError);
            }
        })
        .catch(error => {
            console.error('API Error:', error);
            alert(t.netError);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    }
});
