const CONFIG = {
    translations: {
        en: {
            bio: "WIP",
            detail_youtube: "My YouTube channel with videos about gaming and tech.",
            detail_pinterest: "My art and inspiration boards.",
            detail_telegram: "My Telegram channel – news and updates.",
            detail_bluesky: "My Bluesky social feed.",
            detail_ibis: "My artwork on Ibis Paint.",
            detail_github: "My code and projects on GitHub.",
            detail_discord: "My Discord profile – feel free to say hi!",
            detail_steam: "My Steam profile – games and achievements.",
            detail_tiktok: "My TikTok – short videos and fun.",
            detail_btn: "More",
            gif_text: "maybe something else",
            gif_text2: ". ^ ."
        },
        ru: {
            bio: "В процессе разработки",
            detail_youtube: "Мой YouTube-канал с видео про игры и технологии.",
            detail_pinterest: "Мои доски с артом и вдохновением.",
            detail_telegram: "Мой Telegram-канал – новости и обновления.",
            detail_bluesky: "Моя лента в Bluesky.",
            detail_ibis: "Мои рисунки в Ibis Paint.",
            detail_github: "Мой код и проекты на GitHub.",
            detail_discord: "Мой Discord – заходи, поболтаем!",
            detail_steam: "Мой Steam – игры и достижения.",
            detail_tiktok: "Мой TikTok – короткие видео и приколы.",
            detail_btn: "Подробнее",
            gif_text: "может чёт ещё будет",
            gif_text2: ". ^ ."
        }
    },

    gradients: {
        youtube: 'linear-gradient(145deg, #3a0000 0%, #5c0000 30%, #2a0a0a 60%, #1a0505 100%)',
        pinterest: 'linear-gradient(145deg, #2e0000 0%, #5c001f 30%, #2a0a0a 60%, #1a0510 100%)',
        telegram: 'linear-gradient(145deg, #001f33 0%, #003d66 30%, #0a1a2a 60%, #05101a 100%)',
        bluesky: 'linear-gradient(145deg, #000c33 0%, #001f66 30%, #0a1a2a 60%, #05101a 100%)',
        ibis: 'linear-gradient(145deg, #001f3f 0%, #004080 30%, #0a1a2a 60%, #05101a 100%)',
        github: 'linear-gradient(145deg, #1a1a1a 0%, #333333 30%, #1a1a1a 60%, #0d0d0d 100%)',
        discord: 'linear-gradient(145deg, #1a1a3a 0%, #2a2a5c 30%, #1a1a2a 60%, #0d0d1a 100%)',
        steam: 'linear-gradient(145deg, #0a0a14 0%, #16202a 30%, #0f1a1a 60%, #0a1414 100%)',
        tiktok: 'linear-gradient(145deg, #1a1a1a 0%, #333333 30%, #1a1a1a 60%, #0d0d0d 100%)'
    },

    links: [
        {
            className: 'youtube',
            href: 'https://www.youtube.com/@voidslugcat',
            icon: 'fa-brands fa-youtube',
            titleKey: 'YouTube',
            hover: 'youtube',
            detailKey: 'detail_youtube'
        },
        {
            className: 'pinterest',
            href: 'https://ru.pinterest.com/voidslugcat/',
            icon: 'fa-brands fa-pinterest-p',
            titleKey: 'Pinterest',
            hover: 'pinterest',
            detailKey: 'detail_pinterest'
        },
        {
            className: 'telegram',
            href: 'https://t.me/domain_voidslugcat',
            icon: 'fa-brands fa-telegram-plane',
            titleKey: 'Telegram',
            hover: 'telegram',
            detailKey: 'detail_telegram'
        },
        {
            className: 'bluesky',
            href: 'https://bsky.app/profile/voidslugcat.bsky.social',
            icon: 'fa-brands fa-bluesky',
            titleKey: 'Bluesky',
            hover: 'bluesky',
            detailKey: 'detail_bluesky'
        },
        {
            className: 'ibis',
            href: 'https://ibispaint.com/artist4/3707554424236129/?type=illust&sort=new',
            icon: 'fas fa-paint-brush',
            titleKey: 'Ibis Paint',
            hover: 'ibis',
            detailKey: 'detail_ibis'
        },
        {
            className: 'github',
            href: 'https://github.com/voidslugcatik',
            icon: 'fa-brands fa-github',
            titleKey: 'GitHub',
            hover: 'github',
            detailKey: 'detail_github'
        },
        {
            className: 'discord',
            href: 'https://discord.com/users/979652228237369354',
            icon: 'fa-brands fa-discord',
            titleKey: 'Discord',
            hover: 'discord',
            detailKey: 'detail_discord'
        },
        {
            className: 'steam',
            href: 'https://steamcommunity.com/id/voidslugcat/',
            icon: 'fa-brands fa-steam',
            titleKey: 'Steam',
            hover: 'steam',
            detailKey: 'detail_steam'
        },
        {
            className: 'tiktok',
            href: 'https://www.tiktok.com/@voidslucat',
            icon: 'fa-brands fa-tiktok',
            titleKey: 'TikTok',
            hover: 'tiktok',
            detailKey: 'detail_tiktok'
        }
    ],

    defaultLang: 'en',
    gifKeys: ['gif_text', 'gif_text2']
};

// -------- Генерация плиток --------
const linksGrid = document.getElementById('linksGrid');

CONFIG.links.forEach(link => {
    const tile = document.createElement('div');
    tile.className = `link-tile ${link.className}`;
    tile.dataset.hover = link.hover;
    tile.dataset.href = link.href;

    const iconSpan = document.createElement('span');
    iconSpan.className = 'icon';
    const icon = document.createElement('i');
    icon.className = link.icon;
    iconSpan.appendChild(icon);

    const titleSpan = document.createElement('span');
    titleSpan.className = 'title';
    titleSpan.textContent = link.titleKey;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = `<i class="fas fa-paperclip"></i>`;
    copyBtn.title = 'Copy link';
    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyToClipboard(link.href, copyBtn);
    });

    const detailBtn = document.createElement('button');
    detailBtn.className = 'detail-btn';
    detailBtn.innerHTML = `<span class="i18n-text" data-i18n="detail_btn">More</span>`;
    detailBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDetailModal(link);
    });

    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(detailBtn);

    tile.appendChild(iconSpan);
    tile.appendChild(titleSpan);
    tile.appendChild(actionsDiv);

    tile.addEventListener('click', function() {
        window.open(this.dataset.href, '_blank');
    });

    linksGrid.appendChild(tile);
});

// GIF-заглушки
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

// -------- Копирование ссылки --------
function copyToClipboard(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(btn, true);
        }).catch(() => {
            fallbackCopy(text, btn);
        });
    } else {
        fallbackCopy(text, btn);
    }
}

function fallbackCopy(text, btn) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback(btn, true);
    } catch (err) {
        showCopyFeedback(btn, false);
    }
    document.body.removeChild(textarea);
}

function showCopyFeedback(btn, success) {
    const originalHTML = btn.innerHTML;
    if (success) {
        btn.innerHTML = `<i class="fas fa-check"></i>`;
        btn.style.borderColor = '#4CAF50';
        btn.style.color = '#4CAF50';
    } else {
        btn.innerHTML = `<i class="fas fa-times"></i>`;
        btn.style.borderColor = '#f44336';
        btn.style.color = '#f44336';
    }
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.borderColor = '';
        btn.style.color = '';
    }, 2000);
}

// -------- Модальное окно (исправленная логика) --------
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');

function openDetailModal(link) {
    // Если модалка уже видна — скрываем её быстро и открываем заново
    if (modal.classList.contains('active')) {
        closeModalImmediately();
    }

    const lang = localStorage.getItem('preferredLanguage') || CONFIG.defaultLang;
    const title = link.titleKey;
    const iconClass = link.icon;
    const href = link.href;
    const desc = CONFIG.translations[lang]?.[link.detailKey] || 'No description available.';

    modalBody.innerHTML = `
        <div class="modal-icon"><i class="${iconClass}"></i></div>
        <div class="modal-title">${title}</div>
        <div class="modal-desc">${desc}</div>
        <a href="${href}" target="_blank" class="modal-link"><i class="fas fa-external-link-alt"></i> Open ${title}</a>
    `;

    // Сброс классов перед показом
    modal.classList.remove('closing');
    modal.style.display = 'flex';
    // Принудительный reflow для перезапуска анимации
    void modal.offsetWidth;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModalWithAnimation() {
    if (!modal.classList.contains('active')) return;

    modal.classList.remove('active');
    modal.classList.add('closing');

    // Ждём окончания анимации (250ms) и скрываем
    setTimeout(() => {
        modal.classList.remove('closing');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function closeModalImmediately() {
    modal.classList.remove('active', 'closing');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Обработчики закрытия
modalClose.addEventListener('click', closeModalWithAnimation);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalWithAnimation();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModalWithAnimation();
});

// -------- Переключение языка --------
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

const userLang = navigator.language || navigator.userLanguage;
const defaultLang = userLang.startsWith('ru') ? 'ru' : CONFIG.defaultLang;
const savedLang = localStorage.getItem('preferredLanguage') || defaultLang;

applyLanguage(savedLang, false);

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

window.addEventListener('load', () => {
    const activeBtn = document.querySelector('.lang-btn.active');
    if (activeBtn) updateSlider(activeBtn);
});
window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.lang-btn.active');
    if (activeBtn) updateSlider(activeBtn);
});

// -------- Фоновый оверлей при наведении --------
const overlay1 = document.getElementById('hover-bg-overlay-1');
const overlay2 = document.getElementById('hover-bg-overlay-2');
let currentOverlay = overlay1, nextOverlay = overlay2, currentBgType = null;

const layer1 = document.getElementById('bg-icon-1');
const layer2 = document.getElementById('bg-icon-2');
let currentLayer = layer1, nextLayer = layer2, currentIconType = null;

function setBodyHover(type) {
    if (type) {
        if (type !== currentBgType) {
            nextOverlay.style.background = CONFIG.gradients[type] || 'transparent';
            nextOverlay.style.opacity = '1';
            if (currentBgType !== null) {
                currentOverlay.style.opacity = '0';
            }
            [currentOverlay, nextOverlay] = [nextOverlay, currentOverlay];
            currentBgType = type;
        }
        if (type !== currentIconType) {
            const icon = nextLayer.querySelector('i');
            let iconClass = 'fa-brands fa-' + type;
            if (type === 'ibis') {
                iconClass = 'fas fa-paint-brush';
            }
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

document.querySelectorAll('.link-tile').forEach(tile => {
    tile.addEventListener('mouseenter', function() {
        const type = this.dataset.hover;
        if (type) setBodyHover(type);
    });
    tile.addEventListener('mouseleave', function() {
        setBodyHover(null);
    });
});

console.log('✅ Модалка исправлена: открывается всегда, анимация выхода работает.');
