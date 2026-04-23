window.MAP = window.MAP || {};

MAP.setSectionCount = function(id, active, total) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = (total == null) ? String(active) : (active + '/' + total);
};
MAP.updateSectionCountFromDOM = function(countId, inputSelector) {
    var boxes = document.querySelectorAll(inputSelector);
    var active = 0;
    for (var i = 0; i < boxes.length; i++) if (boxes[i].checked) active++;
    MAP.setSectionCount(countId, active, boxes.length);
};

MAP.renderPOIToggles = function() {
    var container = document.getElementById('poi-toggles');
    container.innerHTML = '';
    var keys = Object.keys(MAP.POI_CATEGORIES);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var config = MAP.POI_CATEGORIES[key];
        var wasVisible = MAP.poiVisible[key] || false;
        MAP.poiVisible[key] = wasVisible;
        var isPlaceholder = config.placeholder && (!config.points || config.points.length === 0);
        var label = config.labelKey ? MAP.t(config.labelKey) : (config.label || key);
        var div = document.createElement('div');
        div.className = 'poi-toggle';
        if (isPlaceholder) div.style.opacity = '0.5';
        div.innerHTML = '<input type="checkbox" id="poi-' + key + '" data-key="' + key + '"' +
            (isPlaceholder ? ' disabled' : '') + (wasVisible ? ' checked' : '') + '>' +
            '<span class="poi-color" style="background:' + config.color + '"></span>' +
            '<span>' + config.icon + ' ' + label + (isPlaceholder ? ' ' + MAP.t('coming_soon') : '') + '</span>' +
            '<span class="poi-count" id="poi-count-' + key + '">' + (isPlaceholder ? '' : '...') + '</span>';
        div.querySelector('input').addEventListener('change', (function(k) {
            return function(e) {
                MAP.poiVisible[k] = e.target.checked;
                if (e.target.checked) {
                    if (MAP.poiData[k] && MAP.poiData[k].length > 0) {
                        MAP.renderPOICluster(k);
                    } else {
                        MAP.fetchSinglePOI(k);
                    }
                } else {
                    MAP.removePOICluster(k);
                }
                MAP.updateSectionCountFromDOM('count-poi', '#poi-toggles input[type=checkbox]');
            };
        })(key));
        container.appendChild(div);

    }

    if (MAP.toggleHikingLayer) {
        var hikingDiv = document.createElement('div');
        hikingDiv.className = 'poi-toggle';
        hikingDiv.innerHTML = '<input type="checkbox" id="poi-hiking">' +
            '<span class="poi-color" style="background:#f39c12"></span>' +
            '<span>\ud83e\udde5 ' + MAP.t('poi_hiking') + '</span>';
        hikingDiv.querySelector('input').addEventListener('change', function(e) {
            MAP.toggleHikingLayer(e.target.checked);
            MAP.updateSectionCountFromDOM('count-poi', '#poi-toggles input[type=checkbox]');
        });
        container.appendChild(hikingDiv);

        var hLegend = document.createElement('div');
        hLegend.className = 'poi-sub-legend';
        hLegend.innerHTML =
            '<span style="color:#27ae60;">\u2501 ' + MAP.t('hk_easy') + '</span> ' +
            '<span style="color:#f39c12;">\u2501 ' + MAP.t('hk_moderate') + '</span> ' +
            '<span style="color:#e74c3c;">\u2501 ' + MAP.t('hk_hard') + '</span>';
        container.appendChild(hLegend);
    }
    MAP.updateSectionCountFromDOM('count-poi', '#poi-toggles input[type=checkbox]');
};

MAP.updateToggleCount = function(key, count) {
    var el = document.getElementById('poi-count-' + key);
    if (el) el.textContent = count;
};

MAP.renderHazardToggles = function() {
    var container = document.getElementById('hazard-toggles');
    container.innerHTML = '';
    var entries = Object.entries(MAP.HAZARD_CATEGORIES);
    for (var i = 0; i < entries.length; i++) {
        var key = entries[i][0];
        var config = entries[i][1];
        var wasVisible = MAP.hazardVisible[key] || false;
        MAP.hazardVisible[key] = wasVisible;
        var label = config.labelKey ? MAP.t(config.labelKey) : (config.label || key);
        var div = document.createElement('div');
        div.className = 'hazard-toggle';
        div.innerHTML = '<input type="checkbox" id="hazard-' + key + '" data-key="' + key + '"' +
            (wasVisible ? ' checked' : '') + '>' +
            '<span class="hazard-color" style="background:' + config.color + '"></span>' +
            '<span>' + config.icon + ' ' + label + '</span>' +
            '<span class="hazard-count" id="hazard-count-' + key + '"></span>';
        div.querySelector('input').addEventListener('change', (function(k) {
            return function(e) {
                MAP.toggleHazardLayer(k, e.target.checked);
                MAP.updateSectionCountFromDOM('count-hazards', '#hazard-toggles input[type=checkbox]');
            };
        })(key));
        container.appendChild(div);
    }
    MAP.updateSectionCountFromDOM('count-hazards', '#hazard-toggles input[type=checkbox]');
};

MAP.renderSliders = function() {
    var container = document.getElementById('sliders');
    container.innerHTML = '';
    for (var i = 0; i < MAP.FACTORS.length; i++) {
        var f = MAP.FACTORS[i];
        var label = f.labelKey ? MAP.t(f.labelKey) : f.label;
        var div = document.createElement('div');
        div.className = 'slider-item';
        var thr = MAP.filterThresholds[f.key];
        div.innerHTML =
            '<input type="checkbox" class="factor-check" data-key="' + f.key + '" ' +
                (MAP.checkedFactors[f.key] ? 'checked' : '') + '>' +
            '<span class="icon">' + f.icon + '</span>' +
            '<label>' + label + '</label>' +
            '<input type="range" min="0" max="10" value="' + thr + '">' +
            '<span class="wv' + (thr === 0 ? ' zero' : '') + '" id="wv-' + f.key + '">' + thr + '</span>';

        div.querySelector('.factor-check').addEventListener('change', (function(fKey) {
            return function(e) {
                MAP.checkedFactors[fKey] = e.target.checked;
                MAP.renderMarkers();
                MAP.renderRankings();
                MAP.updateSectionCountFromDOM('count-factors', '#sliders .factor-check');
            };
        })(f.key));

        div.querySelector('input[type=range]').addEventListener('input', (function(fKey) {
            return function(e) {
                var v = parseInt(e.target.value);
                MAP.filterThresholds[fKey] = v;
                var wv = document.getElementById('wv-' + fKey);
                wv.textContent = v;
                wv.classList.toggle('zero', v === 0);
                MAP.renderMarkers();
                MAP.renderRankings();
            };
        })(f.key));

        container.appendChild(div);
    }
    MAP.updateSectionCountFromDOM('count-factors', '#sliders .factor-check');
};

MAP.renderRankings = function() {
    var container = document.getElementById('rankings');
    var scored = MAP.LOCATIONS
        .filter(function(loc) { return MAP.passesFilter(loc); })
        .map(function(loc) { return { loc: loc, score: MAP.getScore(loc) }; });
    scored.sort(function(a, b) { return b.score - a.score; });
    container.innerHTML = '';
    MAP.setSectionCount('count-rankings', scored.length, MAP.LOCATIONS.length);

    if (scored.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:11px;">' + MAP.t('no_locations') + '</div>';
        return;
    }

    scored.forEach(function(item, i) {
        var c = MAP.scoreToColor(item.score);
        var div = document.createElement('div');
        div.className = 'rank-item';
        div.innerHTML = '<span class="rank-num">' + (i+1) + '.</span><span class="rank-dot" style="background:' + c + '"></span>' +
            '<span class="rank-name">' + item.loc.name + '</span><span class="rank-score" style="color:' + c + '">' + Math.round(item.score) + '</span>';
        div.addEventListener('click', (function(loc) {
            return function() {
                MAP.map.flyTo([loc.lat, loc.lng], 14, { duration: 1 });
                setTimeout(function() { if (loc._marker) loc._marker.openPopup(); }, 1100);
            };
        })(item.loc));
        container.appendChild(div);
    });
};

MAP.resetWeights = function() {
    MAP.FACTORS.forEach(function(f) {
        MAP.checkedFactors[f.key] = false;
        MAP.filterThresholds[f.key] = 0;
    });
    MAP.renderSliders();
    MAP.renderMarkers();
    MAP.renderRankings();
};

MAP.PRESETS = {
    family:  { medicalAccess: 7, crime: 7, airQuality: 6, internet: 5, quiet: 5, food: 5 },
    nomad:   { internet: 8, costOfLiving: 5, expatCommunity: 5, food: 5, walkability: 5 },
    retreat: { quiet: 7, beach: 6, airQuality: 6, walkability: 6, attractions: 5 },
};

MAP.applyPreset = function(name) {
    var p = MAP.PRESETS[name];
    if (!p) return;
    MAP.FACTORS.forEach(function(f) {
        MAP.checkedFactors[f.key] = false;
        MAP.filterThresholds[f.key] = 0;
    });
    Object.keys(p).forEach(function(k) {
        MAP.checkedFactors[k] = true;
        MAP.filterThresholds[k] = p[k];
    });
    MAP.renderSliders();
    MAP.renderMarkers();
    MAP.renderRankings();
};
