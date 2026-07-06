// ================================================================
//  КОНФИГУРАЦИЯ
// ================================================================

const COLORS_SHADER = [
    [227, 0, 220],
    [200, 0, 117],
    [46, 0, 0],
    [66, 0, 84],
    [151, 0, 117],
    [117, 0, 99],
    [0, 0, 126],
    [19, 0, 214],
    [24, 0, 70],
    [43, 0, 194],
    [16, 0, 60],
    [39, 0, 96],
    [193, 0, 100]
];

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
        youtube: 'linear-gradient(145deg, #FF1A1A 0%, #E60000 30%, #B30000 60%, #800000 100%)',
        pinterest: 'linear-gradient(145deg, #FF0066 0%, #E6005C 30%, #B30047 60%, #800033 100%)',
        telegram: 'linear-gradient(145deg, #00A3E0 0%, #0088CC 30%, #006699 60%, #004466 100%)',
        bluesky: 'linear-gradient(145deg, #1A73E8 0%, #0560FF 30%, #0044CC 60%, #003399 100%)',
        ibis: 'linear-gradient(145deg, #1A73E8 0%, #0560FF 30%, #0044CC 60%, #003399 100%)',
        github: 'linear-gradient(145deg, #333333 0%, #1A1A1A 30%, #0D0D0D 60%, #000000 100%)',
        discord: 'linear-gradient(145deg, #7289DA 0%, #5865F2 30%, #4752C4 60%, #363F8A 100%)',
        steam: 'linear-gradient(145deg, #4B6B8F 0%, #2A4A6E 30%, #1A3050 60%, #0D1A30 100%)',
        tiktok: 'linear-gradient(145deg, #FFFFFF 0%, #CCCCCC 30%, #999999 60%, #666666 100%)'
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

// ================================================================
//  Фоновый оверлей при наведении – с классами вместо style.opacity
// ================================================================

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
            currentOverlay.classList.remove('active');
            nextOverlay.classList.add('active');
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
            currentLayer.classList.remove('active');
            nextLayer.classList.add('active');
            [currentLayer, nextLayer] = [nextLayer, currentLayer];
            currentIconType = type;
        }
    } else {
        currentOverlay.classList.remove('active');
        nextOverlay.classList.remove('active');
        currentLayer.classList.remove('active');
        nextLayer.classList.remove('active');
        currentBgType = null;
        currentIconType = null;
    }
}

// ================================================================
//  ШЕЙДЕРНЫЙ ФОН – МУЛЬТИПЛИКАТИВНЫЙ ШУМ (БАЗА + МАСКА + ПЫЛЬ)
// ================================================================

class ShaderBackground {
    constructor(canvas, colors) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.colors = colors;
        this.scale = 0.15;
        this.width = 0;
        this.height = 0;
        this.time = 0;
        this.imageData = null;

        this.params = this.generateParams();
        this.params2 = this.generateParams();
        this.paramsVein = this.generateParams();
        this.paramsDust = this.generateParams();

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
        console.log('🌌 Облачная пыль + переливы');
    }

    generateParams() {
        return {
            f1: 0.002 + Math.random() * 0.01,
            f2: 0.004 + Math.random() * 0.015,
            f3: 0.008 + Math.random() * 0.02,
            f4: 0.015 + Math.random() * 0.03,
            s1: 0.01 + Math.random() * 0.04,
            s2: 0.02 + Math.random() * 0.05,
            s3: 0.03 + Math.random() * 0.06,
            s4: 0.04 + Math.random() * 0.08,
            shiftX: (Math.random() - 0.5) * 200,
            shiftY: (Math.random() - 0.5) * 200,
            w1: 0.2 + Math.random() * 0.4,
            w2: 0.1 + Math.random() * 0.3,
            w3: 0.1 + Math.random() * 0.2,
            w4: 0.05 + Math.random() * 0.15,
        };
    }

    resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.width = Math.floor(w * this.scale);
        this.height = Math.floor(h * this.scale);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.imageData = this.ctx.createImageData(this.width, this.height);
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    noise(x, y, t, p) {
        const x2 = x + p.shiftX;
        const y2 = y + p.shiftY;

        const v1 = Math.sin(x2 * p.f1 + y2 * p.f1 * 0.6 + t * p.s1) *
                   Math.cos(y2 * p.f1 * 0.7 - x2 * p.f1 * 0.4 + t * p.s1 * 0.8);
        const v2 = Math.sin(x2 * p.f2 + y2 * p.f2 * 1.1 + t * p.s2) *
                   Math.cos(y2 * p.f2 * 0.5 - x2 * p.f2 * 0.8 + t * p.s2 * 0.7);
        const v3 = Math.sin(x2 * p.f3 + y2 * p.f3 * 0.9 + t * p.s3) *
                   Math.cos(y2 * p.f3 * 1.2 - x2 * p.f3 * 0.3 + t * p.s3 * 0.9);
        const v4 = Math.sin(x2 * p.f4 + y2 * p.f4 * 0.4 + t * p.s4) *
                   Math.cos(y2 * p.f4 * 1.3 - x2 * p.f4 * 0.6 + t * p.s4 * 0.6);

        let val = v1 * p.w1 + v2 * p.w2 + v3 * p.w3 + v4 * p.w4;
        val = (val + 1) * 0.5;
        return Math.max(0, Math.min(1, val));
    }

    animate() {
        this.time += 0.4;
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    draw() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        const data = this.imageData.data;
        const colors = this.colors;
        const numColors = colors.length;
        const t = this.time;

        const pulse = 0.85 + 0.15 * Math.sin(t * 0.025);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const idx = (y * w + x) * 4;

                let baseNoise = this.noise(x, y, t, this.params);
                let baseSmooth = baseNoise * baseNoise * (3 - 2 * baseNoise);
                let baseVal = baseNoise * 0.4 + baseSmooth * 0.6;

                let maskNoise = this.noise(x * 1.8 + 100, y * 1.8 + 50, t * 0.7, this.params2);
                let maskVal = Math.pow(maskNoise, 1.5);
                let multiplier = 0.05 + 1.8 * maskVal;

                let dustFine = this.noise(x * 12.0, y * 12.0, t * 2.5, this.paramsDust);
                let dustCoarse = this.noise(x * 4.0, y * 4.0, t * 1.2, this.paramsDust);
                let dustFineVal = dustFine * dustFine * (3 - 2 * dustFine);
                let dustCoarseVal = dustCoarse * dustCoarse * (3 - 2 * dustCoarse);
                let dustCombined = Math.max(dustFineVal, dustCoarseVal * 0.7);
                if (dustCombined > 0.40) {
                    let intensity = (dustCombined - 0.60) / 0.2;
                    intensity = intensity * intensity * 1.2;
                    multiplier += 0.8 * intensity;
                }

                let veinNoise = this.noise(x * 0.3, y * 0.3, t * 0.4, this.paramsVein);
                let veinVal = Math.sin(x * 0.06 + y * 0.02 + veinNoise * 2.0 + t * 0.1);
                veinVal = (veinVal + 1) * 0.5;
                let veinMultiplier = 0.75 + 0.20 * veinVal;

                const pos = baseVal * (numColors - 1);
                const idx0 = Math.floor(pos);
                const idx1 = Math.min(idx0 + 1, numColors - 1);
                const frac = pos - idx0;
                const ease = 0.5 - 0.5 * Math.cos(frac * Math.PI);

                const c0 = colors[idx0];
                const c1 = colors[idx1];

                let r = Math.round(c0[0] + (c1[0] - c0[0]) * ease);
                let g = Math.round(c0[1] + (c1[1] - c0[1]) * ease);
                let b = Math.round(c0[2] + (c1[2] - c0[2]) * ease);

                const brightness = pulse * multiplier * veinMultiplier * 0.85;
                data[idx] = Math.round(r * brightness);
                data[idx+1] = Math.round(g * brightness);
                data[idx+2] = Math.round(b * brightness);
                data[idx+3] = 255;
            }
        }

        ctx.putImageData(this.imageData, 0, 0);
    }
}

// ================================================================
//  ИНИЦИАЛИЗАЦИЯ ФОНА
// ================================================================

const canvas = document.getElementById('bgShader');
const bg = new ShaderBackground(canvas, COLORS_SHADER);

// ================================================================
//  СЛЕД ОТ МЫШКИ (исправленная логика)
// ================================================================

const trailCanvas = document.getElementById('trailCanvas');
const trailCtx = trailCanvas.getContext('2d');
let trailWidth = window.innerWidth;
let trailHeight = window.innerHeight;
trailCanvas.width = trailWidth;
trailCanvas.height = trailHeight;

let particles = [];
const MAX_PARTICLES = 9999;
const FADE_IN_SPEED = 0.1;

window.addEventListener('resize', () => {
    trailWidth = window.innerWidth;
    trailHeight = window.innerHeight;
    trailCanvas.width = trailWidth;
    trailCanvas.height = trailHeight;
});

function addParticle(x, y) {
    const color = COLORS_SHADER[Math.floor(Math.random() * COLORS_SHADER.length)];
    particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 0.0,
        phase: 'rising',
        decay: 0.03 + Math.random() * 0.01,
        fadeIn: FADE_IN_SPEED + Math.random() * 0.02,
        size: 5 + Math.random() * 15,
        color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`,
        offsetX: (Math.random() - 0.5) * 20,
        offsetY: (Math.random() - 0.5) * 20,
    });
    if (particles.length > MAX_PARTICLES) {
        particles.shift();
    }
}

let mouseX = 0, mouseY = 0, lastAddTime = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const now = Date.now();
    if (now - lastAddTime > 15) {
        addParticle(mouseX, mouseY);
        addParticle(mouseX + (Math.random() - 0.5) * 100, mouseY + (Math.random() - 0.5) * 100);
        lastAddTime = now;
    }
});

function animateTrail() {
    trailCtx.clearRect(0, 0, trailWidth, trailHeight);

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * 0.5;
        p.y += p.vy * 0.5;
        p.size *= 0.998;

        if (p.phase === 'rising') {
            p.life += p.fadeIn;
            if (p.life >= 1.0) {
                p.life = 1.0;
                p.phase = 'falling';
            }
        } else {
            p.life -= p.decay;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
        }

        const alpha = p.life * 0.8;
        const radius = p.size * 0.8 + 2;
        const grad = trailCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2);
        const rgb = p.color.match(/\d+/g);
        if (rgb) {
            const r = parseInt(rgb[0]), g = parseInt(rgb[1]), b = parseInt(rgb[2]);
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.9})`);
            grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        } else {
            grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
            grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
        }
        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, radius * 2, 0, Math.PI * 2);
        trailCtx.fillStyle = grad;
        trailCtx.fill();

        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, radius * 0.3, 0, Math.PI * 2);
        trailCtx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.1})`;
        trailCtx.fill();
    }

    requestAnimationFrame(animateTrail);
}

animateTrail();

// ================================================================
//  ОСТАЛЬНОЙ КОД (плитки, модалка, переключение языка и т.д.)
// ================================================================

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

// -------- Модальное окно --------
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');

function openDetailModal(link) {
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

    modal.classList.remove('closing');
    modal.style.display = 'flex';
    void modal.offsetWidth;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModalWithAnimation() {
    if (!modal.classList.contains('active')) return;

    modal.classList.remove('active');
    modal.classList.add('closing');

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

// -------- Плавное изменение ширины кнопок при смене языка --------
function updateDetailButtonsWidth() {
    const detailBtns = document.querySelectorAll('.detail-btn');
    detailBtns.forEach(btn => {
        // Создаём временный измеритель
        const measurer = document.createElement('span');
        measurer.style.cssText = `
            position: absolute;
            visibility: hidden;
            white-space: nowrap;
            font-size: ${getComputedStyle(btn).fontSize};
            font-family: ${getComputedStyle(btn).fontFamily};
            font-weight: ${getComputedStyle(btn).fontWeight};
            padding: 0;
            margin: 0;
            letter-spacing: ${getComputedStyle(btn).letterSpacing};
        `;
        const textSpan = btn.querySelector('.i18n-text');
        if (!textSpan) return;
        measurer.textContent = textSpan.textContent;
        document.body.appendChild(measurer);
        const newWidth = measurer.offsetWidth + 24; // + padding
        document.body.removeChild(measurer);
        // Устанавливаем новую ширину с анимацией (через transition)
        btn.style.width = newWidth + 'px';
    });
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

// -------- Навешивание обработчиков на плитки --------
document.querySelectorAll('.link-tile').forEach(tile => {
    tile.addEventListener('mouseenter', function() {
        const type = this.dataset.hover;
        if (type) setBodyHover(type);
    });
    tile.addEventListener('mouseleave', function() {
        setBodyHover(null);
    });
});

// -------- Установка ширины кнопки "подробнее" в зависимости от языка --------
function setDetailButtonWidth(lang) {
    const detailBtns = document.querySelectorAll('.detail-btn');
    let width = '55px'; // для английского "More"
    if (lang === 'ru') {
        width = '95px'; // для русского "Подробнее"
    }
    detailBtns.forEach(btn => {
        btn.style.width = width;
    });
}

// Переопределяем applyLanguage, чтобы при смене языка обновлять ширину кнопок
const originalApplyLang = applyLanguage;
applyLanguage = function(lang, animated = true) {
    // Вызываем оригинальную функцию для обновления текста
    originalApplyLang(lang, animated);
    // Устанавливаем ширину кнопок под текущий язык
    // Делаем это с небольшой задержкой, чтобы текст уже обновился
    setTimeout(() => {
        setDetailButtonWidth(lang);
    }, animated ? 125 : 0);
};

// При загрузке страницы тоже устанавливаем ширину под текущий язык
window.addEventListener('load', function() {
    const currentLang = localStorage.getItem('preferredLanguage') || CONFIG.defaultLang;
    setTimeout(() => {
        setDetailButtonWidth(currentLang);
    }, 300);
});