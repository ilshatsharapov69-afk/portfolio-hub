window.MAP = window.MAP || {};

// State
MAP.checkedFactors = {};
MAP.filterThresholds = {};
MAP.poiClusterGroups = {};
MAP.poiData = {};
MAP.poiVisible = {};
MAP.hazardLayers = {};
MAP.hazardVisible = {};
MAP.earthquakeData = null;
MAP.locationsVisible = false;

// Initialize all factors as unchecked, all thresholds at 0
MAP.FACTORS.forEach(function(f) {
    MAP.checkedFactors[f.key] = false;
    MAP.filterThresholds[f.key] = 0;
});

// Boot
document.addEventListener('DOMContentLoaded', function() {
    MAP.initMap();

    // Apply theme and language from localStorage (or defaults)
    MAP.applyTheme(MAP.DARK_MODE);
    document.getElementById('theme-toggle').checked = MAP.DARK_MODE;
    document.getElementById('lang-toggle').checked = (MAP.LANG === 'ru');
    // Update static data-i18n elements
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute('data-i18n');
        els[i].innerHTML = MAP.t(key);
    }

    function syncLangSeg(lang) {
        var opts = document.querySelectorAll('.lang-seg .seg-opt');
        for (var i = 0; i < opts.length; i++) {
            opts[i].classList.toggle('active', opts[i].dataset.lang === lang);
        }
    }
    syncLangSeg(MAP.LANG);

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('change', function(e) {
        MAP.applyTheme(e.target.checked);
    });
    // Language toggle (checkbox state still drives logic)
    document.getElementById('lang-toggle').addEventListener('change', function(e) {
        var lang = e.target.checked ? 'ru' : 'en';
        MAP.applyLanguage(lang);
        syncLangSeg(lang);
    });
    // Segmented buttons drive the checkbox
    var segOpts = document.querySelectorAll('.lang-seg .seg-opt');
    for (var s = 0; s < segOpts.length; s++) {
        segOpts[s].addEventListener('click', function(ev) {
            var wantRu = ev.currentTarget.dataset.lang === 'ru';
            var cb = document.getElementById('lang-toggle');
            if (cb.checked !== wantRu) {
                cb.checked = wantRu;
                cb.dispatchEvent(new Event('change'));
            }
        });
    }

    // Generate internet quality points from LOCATIONS before rendering toggles
    MAP.POI_CATEGORIES.internet.points = MAP.LOCATIONS.map(function(loc) {
        return {
            name: loc.name,
            lat: loc.lat,
            lng: loc.lng,
            importance: loc.ratings.internet >= 8 ? 'large' : loc.ratings.internet >= 5 ? 'medium' : 'small',
            internetRating: loc.ratings.internet,
            details: loc.details ? loc.details.internet : ''
        };
    });

    // Wire attractions data
    if (MAP.ATTRACTIONS) {
        MAP.POI_CATEGORIES.attractions.points = MAP.ATTRACTIONS;
    }

    // Wire beach data and render functions
    if (MAP.BEACHES) {
        MAP.POI_CATEGORIES.beach.staticFallback = MAP.BEACHES;
    }
    if (MAP.beachPopupFn) {
        MAP.POI_CATEGORIES.beach.popupFn = MAP.beachPopupFn;
    }
    if (MAP.beachColorFn) {
        MAP.POI_CATEGORIES.beach.colorFn = MAP.beachColorFn;
    }

    MAP.renderPOIToggles();
    MAP.renderHazardToggles();
    MAP.renderSliders();
    MAP.renderMarkers();
    MAP.renderRankings();
    MAP.toggleLocations(document.getElementById('show-locations').checked);

    // Event listeners
    document.getElementById('reset-btn').addEventListener('click', function() {
        MAP.resetWeights();
    });
    var presetsContainer = document.querySelector('.presets');
    if (presetsContainer) {
        presetsContainer.addEventListener('click', function(e) {
            var btn = e.target.closest('[data-preset]');
            if (!btn) return;
            MAP.applyPreset(btn.dataset.preset);
        });
    }

    // Year-range sliders for Safety section
    var yrFrom = document.getElementById('year-from');
    var yrTo   = document.getElementById('year-to');
    var yrFromVal = document.getElementById('yr-from-val');
    var yrToVal   = document.getElementById('yr-to-val');
    var yrRerenderTimer = null;
    function onYearChange() {
        var from = parseInt(yrFrom.value, 10);
        var to   = parseInt(yrTo.value, 10);
        if (from > to) {
            // prevent handles from crossing
            if (this === yrFrom) { to = from; yrTo.value = to; }
            else                 { from = to; yrFrom.value = from; }
        }
        MAP.hazardYearFrom = from;
        MAP.hazardYearTo   = to;
        yrFromVal.textContent = from;
        yrToVal.textContent   = to;
        // Debounce re-render while sliding
        if (yrRerenderTimer) clearTimeout(yrRerenderTimer);
        yrRerenderTimer = setTimeout(function() {
            if (MAP.rerenderVisibleHazards) MAP.rerenderVisibleHazards();
        }, 120);
    }
    if (yrFrom && yrTo) {
        yrFrom.addEventListener('input', onYearChange);
        yrTo.addEventListener('input', onYearChange);
        // Initial sync of displayed values + state
        MAP.hazardYearFrom = parseInt(yrFrom.value, 10);
        MAP.hazardYearTo   = parseInt(yrTo.value, 10);
        yrFromVal.textContent = yrFrom.value;
        yrToVal.textContent   = yrTo.value;
    }
    document.getElementById('show-locations').addEventListener('change', function(e) {
        MAP.toggleLocations(e.target.checked);
    });
    document.getElementById('toggle-sidebar').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // Re-fetch POI layers when user pans/zooms to new area
    MAP.map.on('moveend', MAP.debouncedRefreshPOIs);

    // Re-render attractions when zoom crosses tier boundaries
    MAP._lastAttractionTier = null;
    MAP.map.on('zoomend', function() {
        if (!MAP.poiVisible.attractions) return;
        var z = MAP.map.getZoom();
        var newTier = z >= 12 ? 3 : z >= 9 ? 2 : 1;
        if (newTier !== MAP._lastAttractionTier) {
            MAP._lastAttractionTier = newTier;
            MAP.renderPOICluster('attractions');
        }
    });

    // Dismiss seismic wave visualization on map click (works during and after animation)
    MAP.map.on('click', function() {
        if (MAP._waveCleanup) {
            MAP._waveCleanup();
        }
    });
});
