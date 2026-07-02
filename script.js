// ================================================================
//  КОНФИГУРАЦИЯ – здесь вы меняете всё, что нужно
// ================================================================

const CONFIG = {
    // ---------- ПЕРЕВОДЫ ----------
    // Добавляйте новые языки или меняйте текст для каждого ключа
    translations: {
        en: {
            bio: "WIP",
            yt_desc: "-",
            pin_desc: "-",
            tg_desc: "-",
            bsky_desc: "-",
            ibis_desc: "-",
            gh_desc: "-",
            dc_desc: "-",
            st_desc: "-",
            tt_desc: "TikTok",
            gif_text: "maybe something else",
            gif_text2: ". ^ ."
        },
        ru: {
            bio: "В процессе разработки",
            yt_desc: "-",
            pin_desc: "-",
            tg_desc: "-",
            bsky_desc: "-",
            ibis_desc: "-",
            gh_desc: "-",
            dc_desc: "-",
            st_desc: "-",
            tt_desc: "ТикТок",
            gif_text: "может чёт ещё будет",
            gif_text2: ". ^ ."
        }
        // При добавлении нового языка скопируйте блок выше и замените ключи
    },

    // ---------- ЦВЕТА ФОНА ПРИ НАВЕДЕНИИ НА ПЛИТКИ ----------
    // Ключи должны совпадать с атрибутом data-hover у плиток
    gradients: {
        youtube: 'linear-gradient(145deg, #3a0000 0%, #5c0000 30%, #2a0a0a 60%, #1a0505 100%)',
        pinterest: 'linear-gradient(145deg, #2e0000 0%, #5c001f 30%, #2a0a0a 60%, #1a0510 100%)',
        telegram: 'linear-gradient(145deg, #001f33 0%, #003d66 30%, #0a1a2a 60%, #05101a 100%)',
        bluesky: 'linear-gradient(145deg, #000c33 0%, #001f66 30%, #0a1a2a 60%, #05101a 100%)',
        ibis: 'linear-gradient(145deg, #001f3f 0%, #004080 30%, #0a1a2a 60%, #05101a 100%)', // изменён цвет для ibis
        github: 'linear-gradient(145deg, #1a1a1a 0%, #333333 30%, #1a1a1a 60%, #0d0d0d 100%)',
        discord: 'linear-gradient(145deg, #1a1a3a 0%, #2a2a5c 30%, #1a1a2a 60%, #0d0d1a 100%)',
        steam: 'linear-gradient(145deg, #0a0a14 0%, #16202a 30%, #0f1a1a 60%, #0a1414 100%)',
        tiktok: 'linear-gradient(145deg, #1a1a1a 0%, #333333 30%, #1a1a1a 60%, #0d0d0d 100%)' // добавлен TikTok
        // Добавляйте новые ключи для новых плиток
    },

    // ---------- СПИСОК ССЫЛОК (плиток) ----------
    // Каждый объект: класс (для стилей), href, иконка (класс Font Awesome),
    // заголовок (ключ перевода для title), описание (ключ перевода для desc),
    // data-hover (соответствует ключу в gradients)
    links: [
        {
            className: 'youtube',
            href: 'https://www.youtube.com/@voidslugcat',
            icon: 'fa-brands fa-youtube',
            titleKey: 'YouTube',       // можно прямо текст, но для перевода лучше ключ
            descKey: 'yt_desc',
            hover: 'youtube'
        },
        {
            className: 'pinterest',
            href: 'https://ru.pinterest.com/voidslugcat/',
            icon: 'fa-brands fa-pinterest',
            titleKey: 'Pinterest',
            descKey: 'pin_desc',
            hover: 'pinterest'
        },
        {
            className: 'telegram',
            href: 'https://t.me/domain_voidslugcat',
            icon: 'fa-brands fa-telegram',
            titleKey: 'Telegram',
            descKey: 'tg_desc',
            hover: 'telegram'
        },
        {
            className: 'bluesky',
            href: 'https://bsky.app/profile/voidslugcat.bsky.social',
            icon: 'fa-brands fa-bluesky',
            titleKey: 'Bluesky',
            descKey: 'bsky_desc',
            hover: 'bluesky'
        },
        {
            className: 'ibis',
            href: 'https://ibispaint.com/artist4/3707554424236129/?type=illust&sort=new',
            icon: 'fas fa-paint-brush',   // для ibis используем кисть
            titleKey: 'Ibis Paint',
            descKey: 'ibis_desc',
            hover: 'ibis'
        },
        {
            className: 'github',
            href: 'https://github.com/voidslugcatik',
            icon: 'fa-brands fa-github',
            titleKey: 'GitHub',
            descKey: 'gh_desc',
            hover: 'github'
        },
        {
            className: 'discord',
            href: 'https://discord.com/users/979652228237369354',
            icon: 'fa-brands fa-discord',
            titleKey: 'Discord',
            descKey: 'dc_desc',
            hover: 'discord'
        },
        {
            className: 'steam',
            href: 'https://steamcommunity.com/id/voidslugcat/',
            icon: 'fa-brands fa-steam',
            titleKey: 'Steam',
            descKey: 'st_desc',
            hover: 'steam'
        },
        {
            className: 'tiktok',
            href: 'https://www.tiktok.com/@voidslucat',
            icon: 'fa-brands fa-tiktok',
            titleKey: 'TikTok',
            descKey: 'tt_desc',
            hover: 'tiktok'
        }
        // Добавляйте новые плитки сюда, не забывая добавить переводы и градиент
    ],

    // ---------- ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ ----------
    defaultLang: 'en',   // язык по умолчанию (если не сохранён в localStorage)
    // Ключи для GIF-заглушек (их текст будет браться из переводов)
    gifKeys: ['gif_text', 'gif_text2']
};

// ================================================================
//  КОД, КОТОРЫЙ ВСЁ РЕНДЕРИТ И УПРАВЛЯЕТ ПОВЕДЕНИЕМ
//  (обычно не трогаем, если только не нужно менять логику)
// ================================================================

// -------- 1. Генерация плиток из CONFIG.links --------
const linksGrid = document.getElementById('linksGrid');
CONFIG.links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.target = '_blank';
    a.className = `link-tile ${link.className}`;
    a.dataset.hover = link.hover;

    const iconSpan = document.createElement('span');
    iconSpan.className = 'icon';
    const icon = document.createElement('i');
    icon.className = link.icon;
    iconSpan.appendChild(icon);

    const titleSpan = document.createElement('span');
    titleSpan.className = 'title';
    // Заголовок не переводится (можно было бы, но для простоты оставим как есть)
    titleSpan.textContent = link.titleKey;

    const descSpan = document.createElement('span');
    descSpan.className = 'desc i18n-text';
    descSpan.dataset.i18n = link.descKey;

    a.appendChild(iconSpan);
    a.appendChild(titleSpan);
    a.appendChild(descSpan);
    linksGrid.appendChild(a);
});

// Добавляем GIF-заглушки (их текст будет из переводов)
const gifPlaceholders = [
    { img: 'pou.gif', key: 'gif_text' },
    { img: 'sings.gif', key: 'gif_text2' }
];
gifPlaceholders.forEach(gif => {
    const div = document.createElement('div');
    div.className = 'gif-placeholder';
    const img = document.createElement('img');
    img.src = gif.img;
    img.alt = 'gif placeholder';
    const span = document.createElement('span');
    span.className = 'desc i18n-text';
    span.dataset.i18n = gif.key;
    div.appendChild(img);
    div.appendChild(span);
    linksGrid.appendChild(div);
});

// -------- 2. Логика переключения языка --------
const langSwitch = document.getElementById('langSwitch');
const langSlider = document.getElementById('langSlider');

function updateSlider(activeButton) {
    const btnRect = activeButton.getBoundingClientRect();
    const switchRect = langSwitch.getBoundingClientRect();
    langSlider.style.left = (btnRect.left - switchRect.left) + 'px';
    langSlider.style.width = btnRect.width + 'px';
}

function applyLanguage(lang, animated = true) {
    const elements = document.querySelectorAll('.i18n-text');
    if (!animated) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (CONFIG.translations[lang] && CONFIG.translations[lang][key]) {
                el.textContent = CONFIG.translations[lang][key];
            }
        });
        const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
        if (activeBtn) {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            activeBtn.classList.add('active');
            updateSlider(activeBtn);
        }
        return;
    }

    // Анимированная смена
    elements.forEach(el => el.classList.add('fading-out'));
    const firstElement = elements[0];
    if (!firstElement) return;
    function onTransitionEnd(e) {
        if (e.propertyName === 'opacity') {
            firstElement.removeEventListener('transitionend', onTransitionEnd);
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (CONFIG.translations[lang] && CONFIG.translations[lang][key]) {
                    el.textContent = CONFIG.translations[lang][key];
                }
            });
            elements.forEach(el => el.classList.remove('fading-out'));
        }
    }
    firstElement.addEventListener('transitionend', onTransitionEnd);
}

// Определяем язык по умолчанию
const userLang = navigator.language || navigator.userLanguage;
const defaultLang = userLang.startsWith('ru') ? 'ru' : CONFIG.defaultLang;
const savedLang = localStorage.getItem('preferredLanguage') || defaultLang;

applyLanguage(savedLang, false);

// Обработчики кнопок
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang === localStorage.getItem('preferredLanguage')) return;
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateSlider(btn);
        applyLanguage(lang, true);
        localStorage.setItem('preferredLanguage', lang);
    });
});

// Обновляем ползунок при загрузке и ресайзе
window.addEventListener('load', () => {
    const activeBtn = document.querySelector('.lang-btn.active');
    if (activeBtn) updateSlider(activeBtn);
});
window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.lang-btn.active');
    if (activeBtn) updateSlider(activeBtn);
});

// -------- 3. Фоновый оверлей при наведении на плитки --------
const overlay1 = document.getElementById('hover-bg-overlay-1');
const overlay2 = document.getElementById('hover-bg-overlay-2');
let currentOverlay = overlay1, nextOverlay = overlay2, currentBgType = null;

const layer1 = document.getElementById('bg-icon-1');
const layer2 = document.getElementById('bg-icon-2');
let currentLayer = layer1, nextLayer = layer2, currentIconType = null;

function setBodyHover(type) {
    if (type) {
        // Фон
        if (type !== currentBgType) {
            nextOverlay.style.background = CONFIG.gradients[type] || 'transparent';
            nextOverlay.style.opacity = '1';
            if (currentBgType !== null) {
                currentOverlay.style.opacity = '0';
            }
            [currentOverlay, nextOverlay] = [nextOverlay, currentOverlay];
            currentBgType = type;
        }
        // Иконка
        if (type !== currentIconType) {
            const icon = nextLayer.querySelector('i');
            // Для ibis используем кисть, для остальных – fa-brands fa-*
            let iconClass = 'fa-brands fa-' + type;
            if (type === 'ibis') {
                iconClass = 'fas fa-paint-brush';
            }
            // Если для типа нет иконки в Font Awesome, можно задать запасную
            icon.className = iconClass;
            nextLayer.classList.add('active');
            nextLayer.classList.remove('inactive');
            if (currentIconType !== null) {
                currentLayer.classList.add('inactive');
                currentLayer.classList.remove('active');
            }
            [currentLayer, nextLayer] = [nextLayer, currentLayer];
            currentIconType = type;
        }
    } else {
        // Сброс
        if (currentBgType !== null) {
            currentOverlay.style.opacity = '0';
            nextOverlay.style.opacity = '0';
            currentBgType = null;
        }
        if (currentIconType !== null) {
            currentLayer.classList.add('inactive');
            currentLayer.classList.remove('active');
            nextLayer.classList.add('inactive');
            nextLayer.classList.remove('active');
            currentIconType = null;
        }
    }
}

// Навешиваем события на все плитки
document.querySelectorAll('.link-tile').forEach(tile => {
    tile.addEventListener('mouseenter', function() {
        const type = this.dataset.hover;
        if (type) setBodyHover(type);
    });
    tile.addEventListener('mouseleave', function() {
        setBodyHover(null);
    });
});

// ================================================================
//  КОНЕЦ СКРИПТА – всё готово!
// ================================================================
