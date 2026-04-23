window.MAP = window.MAP || {};

MAP.DARK_MODE = localStorage.getItem('map-theme') === 'dark';

MAP.TILE_URLS = {
    dark:  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
};

MAP.applyTheme = function(dark) {
    MAP.DARK_MODE = dark;
    document.body.classList.toggle('light-mode', !dark);
    localStorage.setItem('map-theme', dark ? 'dark' : 'light');

    if (MAP._tileLayer && MAP.map) {
        MAP.map.removeLayer(MAP._tileLayer);
    }
    if (MAP.map) {
        var url = dark ? MAP.TILE_URLS.dark : MAP.TILE_URLS.light;
        MAP._tileLayer = L.tileLayer(url, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
            maxZoom: 20,
            subdomains: 'abcd',
        }).addTo(MAP.map);
    }

    var toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.checked = dark;
};

MAP.applyLanguage = function(lang) {
    MAP.LANG = lang;
    localStorage.setItem('map-lang', lang);
    document.documentElement.lang = lang;

    // Update static HTML via data-i18n
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute('data-i18n');
        els[i].innerHTML = MAP.t(key);
    }

    // Re-render dynamic UI
    if (MAP.renderPOIToggles) MAP.renderPOIToggles();
    if (MAP.renderHazardToggles) MAP.renderHazardToggles();
    if (MAP.renderSliders) MAP.renderSliders();
    if (MAP.renderRankings) MAP.renderRankings();

    var langToggle = document.getElementById('lang-toggle');
    if (langToggle) langToggle.checked = (lang === 'ru');
};
