window.MAP = window.MAP || {};

/* ── Hiking trails layer: Waymarked Trails tiles + Overpass route polylines ── */

MAP.hikingTileLayer = null;
MAP.hikingRouteLayer = null;
MAP.hikingVisible = false;
MAP._hikingRouteCache = {};

MAP.HIKING_SAC_COLORS = {
    hiking:                      '#27ae60',
    mountain_hiking:             '#f39c12',
    demanding_mountain_hiking:   '#e74c3c',
    alpine_hiking:               '#c0392b',
    difficult_alpine_hiking:     '#8e44ad',
};

MAP.HIKING_SAC_LABELS = {
    hiking:                      'Пешая тропа',
    mountain_hiking:             'Горная тропа',
    demanding_mountain_hiking:   'Сложная горная',
    alpine_hiking:               'Альпинизм',
    difficult_alpine_hiking:     'Сложный альпинизм',
};

MAP.HIKING_DIFFICULTY_COLORS = {
    easy:     '#27ae60',
    moderate: '#f39c12',
    hard:     '#e74c3c',
};

/* ── Toggle hiking layer on/off ── */
MAP.toggleHikingLayer = function(visible) {
    MAP.hikingVisible = visible;

    if (visible) {
        // Show curated static trails only (Overpass returns garbage — bridges, sidewalks)
        MAP.renderStaticHikingTrails();
    } else {
        if (MAP.hikingRouteLayer) {
            MAP.map.removeLayer(MAP.hikingRouteLayer);
            MAP.hikingRouteLayer = null;
        }
    }
};

/* ── Fetch route=hiking relations with geometry from Overpass ── */
MAP.fetchHikingRoutes = async function() {
    if (!MAP.hikingVisible) return;
    if (MAP.map.getZoom() < 10) {
        // At low zoom, only show tile overlay, remove polylines
        if (MAP.hikingRouteLayer) {
            MAP.map.removeLayer(MAP.hikingRouteLayer);
            MAP.hikingRouteLayer = null;
        }
        return;
    }

    var bbox = MAP.getViewportBBox();
    var quantized = MAP.quantizeBBox();
    var cacheKey = 'hiking_routes_' + quantized;

    // Check cache
    try {
        var cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            var parsed = JSON.parse(cached);
            if (Date.now() - parsed.ts < MAP.CACHE_TTL) {
                MAP.renderHikingRoutes(parsed.data);
                return;
            }
        }
    } catch(e) {}

    // Fetch from Overpass
    var status = document.getElementById('poi-status');
    if (status) {
        status.textContent = 'Загрузка хайкинг-маршрутов...';
        status.className = 'poi-status loading';
    }

    try {
        var query = '[out:json][timeout:60];(relation["route"="hiking"](' + bbox + ');relation["route"="foot"](' + bbox + ');way["highway"="path"]["sac_scale"](' + bbox + ');way["highway"="footway"]["name"](' + bbox + '););out body geom;';
        var resp = await fetch(MAP.OVERPASS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'data=' + encodeURIComponent(query),
        });
        var json = await resp.json();
        var elements = json.elements || [];

        // Cache
        try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: elements }));
        } catch(e) {}

        MAP.renderHikingRoutes(elements);

        if (status) {
            status.textContent = 'Маршрутов: ' + elements.length;
            status.className = 'poi-status';
        }
    } catch(e) {
        console.warn('Hiking routes fetch failed:', e);
        if (status) {
            status.textContent = 'Ошибка загрузки маршрутов';
            status.className = 'poi-status';
        }
    }
};

/* ── Render route relations as Leaflet polylines ── */
MAP.renderHikingRoutes = function(elements) {
    // Keep static trails, add Overpass results
    if (!MAP.hikingRouteLayer) MAP.hikingRouteLayer = L.layerGroup();

    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var tags = el.tags || {};
        var color = MAP.HIKING_SAC_COLORS[tags.sac_scale] || '#f39c12';
        var popupHtml = MAP.buildHikingRoutePopup(tags);
        var tooltipName = tags.name || 'Hiking Trail';

        if (el.type === 'relation') {
            var members = el.members || [];
            for (var j = 0; j < members.length; j++) {
                var member = members[j];
                if (member.type === 'way' && member.geometry && member.geometry.length > 1) {
                    var latlngs = [];
                    for (var k = 0; k < member.geometry.length; k++) {
                        var p = member.geometry[k];
                        if (p.lat && p.lon) latlngs.push([p.lat, p.lon]);
                    }
                    if (latlngs.length < 2) continue;
                    MAP.hikingRouteLayer.addLayer(MAP._createHikingPolyline(latlngs, color, tooltipName, popupHtml));
                }
            }
        } else if (el.type === 'way' && el.geometry && el.geometry.length > 1) {
            var latlngs2 = [];
            for (var m = 0; m < el.geometry.length; m++) {
                var p2 = el.geometry[m];
                if (p2.lat && p2.lon) latlngs2.push([p2.lat, p2.lon]);
            }
            if (latlngs2.length >= 2) {
                MAP.hikingRouteLayer.addLayer(MAP._createHikingPolyline(latlngs2, color, tooltipName, popupHtml));
            }
        }
    }

    MAP.map.addLayer(MAP.hikingRouteLayer);
};

MAP._createHikingPolyline = function(latlngs, color, tooltipName, popupHtml) {
    var polyline = L.polyline(latlngs, {
        color: color, weight: 4, opacity: 0.85, lineCap: 'round', lineJoin: 'round',
    });
    polyline.bindTooltip(tooltipName, { sticky: true, direction: 'top', offset: [0, -8] });
    polyline.bindPopup(popupHtml, { maxWidth: 300 });
    (function(pl, origColor) {
        pl.on('mouseover', function() { pl.setStyle({ weight: 6, opacity: 1 }); });
        pl.on('mouseout', function() { pl.setStyle({ weight: 4, opacity: 0.85, color: origColor }); });
    })(polyline, color);
    return polyline;
};

/* ── Build popup HTML for a hiking route ── */
MAP.buildHikingRoutePopup = function(tags) {
    var sacLabel = MAP.HIKING_SAC_LABELS[tags.sac_scale] || '';
    var sacColor = MAP.HIKING_SAC_COLORS[tags.sac_scale] || '#f39c12';
    var name = tags.name || 'Hiking Trail';

    var html = '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;min-width:200px;max-width:280px;">';

    // Name
    html += '<div style="font-size:14px;font-weight:bold;margin-bottom:4px;color:#1a1a2e;">🥾 ' + name + '</div>';

    // Difficulty badge
    if (sacLabel) {
        html += '<div style="margin-bottom:6px;">' +
            '<span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;' +
            'font-weight:bold;color:#fff;background:' + sacColor + ';">' + sacLabel + '</span></div>';
    }

    // Route info
    var metaItems = [];
    if (tags.distance) metaItems.push('📏 ' + tags.distance + ' км');
    if (tags.ascent) metaItems.push('⬆ ' + tags.ascent + ' м');
    if (tags.descent) metaItems.push('⬇ ' + tags.descent + ' м');
    if (tags['ele:max']) metaItems.push('🏔 макс. ' + tags['ele:max'] + ' м');
    if (metaItems.length) {
        html += '<div style="font-size:11px;color:#666;margin-bottom:6px;">' +
            metaItems.join(' &nbsp;│&nbsp; ') + '</div>';
    }

    // Network
    var networkLabels = { lwn: 'Локальный', rwn: 'Региональный', nwn: 'Национальный', iwn: 'Международный' };
    if (tags.network && networkLabels[tags.network]) {
        html += '<div style="font-size:10px;color:#888;margin-bottom:4px;">Сеть: ' + networkLabels[tags.network] + '</div>';
    }

    // Description
    if (tags.description) {
        html += '<div style="font-size:11px;color:#333;margin-bottom:5px;line-height:1.4;">' + tags.description + '</div>';
    }

    // Access info
    if (tags.access === 'permit') {
        html += '<div style="font-size:10px;color:#e74c3c;margin-bottom:4px;">⚠ Требуется пермит</div>';
    }
    if (tags.fee === 'yes') {
        html += '<div style="font-size:10px;color:#e67e22;margin-bottom:4px;">💰 Платный вход</div>';
    }

    // Source
    if (tags.source) {
        html += '<div style="font-size:9px;color:#aaa;margin-bottom:4px;">Источник: ' + tags.source + '</div>';
    }

    // Roundtrip
    if (tags.roundtrip === 'yes') {
        html += '<div style="font-size:10px;color:#888;margin-bottom:4px;">🔄 Круговой маршрут</div>';
    } else if (tags.roundtrip === 'no') {
        html += '<div style="font-size:10px;color:#888;margin-bottom:4px;">➡ Линейный маршрут</div>';
    }

    html += '</div>';
    return html;
};

/* ── Static fallback trails (always shown when hiking enabled) ── */
MAP.STATIC_HIKING_TRAILS = [
    // === LUZON ===
    { name: 'Mt. Pulag (Ambangeg Trail)', sac: 'demanding_mountain_hiking', distance: '9', ascent: '1200', eleMax: '2922',
      desc: 'Highest peak in Luzon. Sea of clouds at sunrise. Grassland summit.',
      coords: [[16.5930,120.8730],[16.5910,120.8770],[16.5890,120.8810],[16.5867,120.8863],[16.5850,120.8900],[16.5830,120.8930],[16.5810,120.8960],[16.5790,120.8990],[16.5780,120.9020],[16.5770,120.9050]] },
    { name: 'Mt. Ulap (Benguet)', sac: 'mountain_hiking', distance: '7', ascent: '600', eleMax: '1846',
      desc: 'Popular day hike. Grassland ridges, pine forests, sea of clouds.',
      coords: [[16.4750,120.5750],[16.4770,120.5720],[16.4800,120.5700],[16.4830,120.5670],[16.4860,120.5640],[16.4890,120.5610],[16.4920,120.5580],[16.4950,120.5550],[16.4980,120.5530],[16.5010,120.5500]] },
    { name: 'Mt. Batulao', sac: 'hiking', distance: '5', ascent: '400', eleMax: '811',
      desc: 'Beginner-friendly near Tagaytay. Rolling green hills, 2-3 hours.',
      coords: [[14.0730,120.8000],[14.0720,120.7980],[14.0710,120.7950],[14.0690,120.7920],[14.0670,120.7890],[14.0660,120.7860],[14.0650,120.7830],[14.0640,120.7800],[14.0620,120.7770],[14.0610,120.7750]] },
    { name: 'Mt. Pinatubo Crater', sac: 'hiking', distance: '5.5', ascent: '300', eleMax: '1486',
      desc: 'Trek through lahar fields to turquoise crater lake. 4x4 + 2hr hike.',
      coords: [[15.1200,120.3400],[15.1230,120.3420],[15.1260,120.3450],[15.1290,120.3470],[15.1310,120.3490],[15.1340,120.3510],[15.1370,120.3520],[15.1400,120.3540],[15.1420,120.3545],[15.1427,120.3543]] },
    { name: 'Taal Volcano Trail', sac: 'hiking', distance: '2', ascent: '200', eleMax: '311',
      desc: 'Volcano within a lake within a volcano. Short but steep.',
      coords: [[14.0150,121.0020],[14.0140,121.0010],[14.0130,121.0000],[14.0113,120.9980],[14.0100,120.9965],[14.0090,120.9950],[14.0075,120.9940],[14.0060,120.9930],[14.0045,120.9920],[14.0030,120.9910]] },
    { name: 'Mt. Mayon (Legazpi)', sac: 'alpine_hiking', distance: '12', ascent: '2200', eleMax: '2462',
      desc: 'Perfect cone volcano. Technical climb, permit from DENR required.',
      coords: [[13.2600,123.6950],[13.2580,123.6930],[13.2560,123.6910],[13.2540,123.6890],[13.2520,123.6870],[13.2500,123.6855],[13.2480,123.6840],[13.2465,123.6825],[13.2450,123.6812],[13.2440,123.6800]] },
    { name: 'Sagada — Echo Valley + Caves', sac: 'hiking', distance: '4', ascent: '250', eleMax: '1500',
      desc: 'Hanging coffins, Sumaguing Cave, underground river. Cultural trail.',
      coords: [[17.0880,121.0090],[17.0865,121.0075],[17.0844,121.0056],[17.0830,121.0035],[17.0815,121.0015],[17.0800,120.9995],[17.0785,120.9975],[17.0770,120.9960]] },
    { name: 'Banaue — Batad Rice Terraces', sac: 'hiking', distance: '10', ascent: '500', eleMax: '1500',
      desc: '2000-year-old terraces. Batad amphitheater, Tappiya Falls. Full day.',
      coords: [[16.9280,121.0450],[16.9260,121.0470],[16.9240,121.0490],[16.9220,121.0510],[16.9200,121.0530],[16.9180,121.0545],[16.9160,121.0560],[16.9141,121.0578]] },
    { name: 'Mt. Maculot (Batangas)', sac: 'mountain_hiking', distance: '4', ascent: '450', eleMax: '930',
      desc: 'Rockies ridge with Taal Lake view. Day hike from Manila.',
      coords: [[13.8650,121.0300],[13.8635,121.0280],[13.8620,121.0260],[13.8600,121.0240],[13.8585,121.0225],[13.8570,121.0210],[13.8555,121.0195],[13.8540,121.0180]] },
    { name: 'Mt. Daraitan + Tinipak River', sac: 'mountain_hiking', distance: '6', ascent: '550', eleMax: '739',
      desc: 'Limestone cliffs, turquoise river, marble canyon. Near Tanay, Rizal.',
      coords: [[14.7500,121.2900],[14.7480,121.2920],[14.7460,121.2940],[14.7440,121.2960],[14.7420,121.2975],[14.7400,121.2990],[14.7380,121.3010],[14.7365,121.3030]] },
    { name: 'Anawangin Cove Trail', sac: 'hiking', distance: '3', ascent: '200', eleMax: '250',
      desc: 'Coastal trail to beach with pine trees. Camp overnight.',
      coords: [[14.8950,120.0750],[14.8935,120.0735],[14.8920,120.0720],[14.8905,120.0710],[14.8890,120.0700],[14.8880,120.0695]] },
    { name: 'Hundred Islands Kayak Trail', sac: 'hiking', distance: '8', ascent: '50', eleMax: '50',
      desc: 'Island-hop by kayak through 124 islands. Snorkeling, cliff jumping.',
      coords: [[16.2100,119.9500],[16.2080,119.9530],[16.2060,119.9560],[16.2050,119.9590],[16.2030,119.9620],[16.2020,119.9650]] },

    // === VISAYAS ===
    { name: 'Osmeña Peak (Cebu)', sac: 'hiking', distance: '1.5', ascent: '150', eleMax: '1013',
      desc: 'Highest point in Cebu. Jagged limestone peaks. 20-30 min up.',
      coords: [[9.7750,123.4990],[9.7760,123.5010],[9.7775,123.5030],[9.7790,123.5050],[9.7810,123.5065],[9.7830,123.5075],[9.7850,123.5085],[9.7870,123.5090],[9.7880,123.5095]] },
    { name: 'Mt. Kanlaon (Negros)', sac: 'demanding_mountain_hiking', distance: '18', ascent: '1500', eleMax: '2435',
      desc: 'Active volcano. Wasay trail through jungle. 2-3 day trek.',
      coords: [[10.4200,123.1100],[10.4180,123.1130],[10.4160,123.1160],[10.4140,123.1190],[10.4124,123.1220],[10.4110,123.1250],[10.4100,123.1280],[10.4095,123.1310],[10.4100,123.1330],[10.4124,123.1320]] },
    { name: 'Mt. Guiting-Guiting (Romblon)', sac: 'difficult_alpine_hiking', distance: '14', ascent: '1800', eleMax: '2058',
      desc: 'Knife-edge ridge. One of PH hardest climbs. 3-4 days.',
      coords: [[12.3920,122.2900],[12.3940,122.2880],[12.3960,122.2860],[12.3980,122.2840],[12.3990,122.2820],[12.4010,122.2800],[12.4030,122.2780],[12.4050,122.2760],[12.4070,122.2740],[12.4080,122.2730]] },
    { name: 'Kalanggaman Island Trail', sac: 'hiking', distance: '2', ascent: '10', eleMax: '10',
      desc: 'Walk the famous sandbar. Crystal clear water, pristine beach.',
      coords: [[11.1820,124.4860],[11.1815,124.4875],[11.1810,124.4890],[11.1800,124.4905],[11.1795,124.4920],[11.1790,124.4935]] },

    // === MINDANAO ===
    { name: 'Mt. Apo (Kidapawan Trail)', sac: 'demanding_mountain_hiking', distance: '28', ascent: '2100', eleMax: '2954',
      desc: 'Highest peak in Philippines. Lake Venado at 2600m. 2-3 day trek.',
      coords: [[7.0100,125.0900],[7.0060,125.0830],[7.0020,125.0760],[6.9980,125.0700],[6.9950,125.0640],[6.9920,125.0580],[6.9900,125.0520],[6.9880,125.0460],[6.9870,125.0400],[6.9870,125.0390]] },
    { name: 'Mt. Hamiguitan (Davao)', sac: 'mountain_hiking', distance: '8', ascent: '700', eleMax: '1637',
      desc: 'UNESCO World Heritage. Bonsai forest, pygmy forest at summit.',
      coords: [[6.7280,126.1770],[6.7260,126.1750],[6.7240,126.1730],[6.7220,126.1710],[6.7200,126.1690],[6.7180,126.1670],[6.7160,126.1650],[6.7140,126.1630],[6.7125,126.1615]] },
    { name: 'Mt. Hibok-Hibok (Camiguin)', sac: 'mountain_hiking', distance: '6', ascent: '800', eleMax: '1332',
      desc: 'Active volcano on Camiguin. Crater lake at summit. Day hike.',
      coords: [[9.2080,124.6820],[9.2060,124.6800],[9.2040,124.6785],[9.2020,124.6770],[9.2000,124.6750],[9.1985,124.6730],[9.1970,124.6715],[9.1960,124.6700]] },
    { name: 'Lake Holon (South Cotabato)', sac: 'mountain_hiking', distance: '7', ascent: '600', eleMax: '2117',
      desc: 'Crater lake. T\'boli indigenous area. Camp by the lake overnight.',
      coords: [[6.7920,124.9200],[6.7900,124.9180],[6.7880,124.9160],[6.7860,124.9140],[6.7840,124.9120],[6.7820,124.9100],[6.7800,124.9080],[6.7780,124.9065]] },
    { name: 'Enchanted River Trail (Hinatuan)', sac: 'hiking', distance: '1', ascent: '20', eleMax: '30',
      desc: 'Short walk to impossibly blue lagoon. Underground cave system.',
      coords: [[8.3520,126.2140],[8.3510,126.2135],[8.3500,126.2130],[8.3490,126.2128]] },
    { name: 'Mt. Dulang-Dulang (Bukidnon)', sac: 'demanding_mountain_hiking', distance: '15', ascent: '1400', eleMax: '2938',
      desc: '2nd highest peak in PH. Mossy forest, pitcher plants. 2-day trek.',
      coords: [[8.1200,124.9300],[8.1180,124.9280],[8.1160,124.9260],[8.1140,124.9240],[8.1120,124.9220],[8.1100,124.9200],[8.1080,124.9185],[8.1060,124.9170],[8.1045,124.9155]] },

    // === PALAWAN ===
    { name: 'El Nido — Taraw Cliff', sac: 'demanding_mountain_hiking', distance: '1', ascent: '200', eleMax: '230',
      desc: 'Razor-sharp limestone ascent. 360° view of Bacuit Bay. Guide required.',
      coords: [[11.1800,119.3920],[11.1810,119.3930],[11.1820,119.3935],[11.1830,119.3940],[11.1840,119.3945],[11.1850,119.3950]] },
    { name: 'Underground River Trail (Sabang)', sac: 'hiking', distance: '4', ascent: '150', eleMax: '120',
      desc: 'Monkey Trail through jungle to UNESCO Underground River entrance.',
      coords: [[10.1970,118.8900],[10.1955,118.8890],[10.1940,118.8878],[10.1930,118.8870],[10.1920,118.8860],[10.1927,118.8868]] },
];

MAP.renderStaticHikingTrails = function() {
    if (!MAP.hikingRouteLayer) MAP.hikingRouteLayer = L.layerGroup();

    for (var i = 0; i < MAP.STATIC_HIKING_TRAILS.length; i++) {
        var trail = MAP.STATIC_HIKING_TRAILS[i];
        var color = MAP.HIKING_SAC_COLORS[trail.sac] || '#f39c12';
        var sacLabel = MAP.HIKING_SAC_LABELS[trail.sac] || '';

        var polyline = L.polyline(trail.coords, {
            color: color, weight: 4, opacity: 0.85, lineCap: 'round', lineJoin: 'round', dashArray: '8 6',
        });

        var popupHtml = '<div style="font-family:-apple-system,sans-serif;min-width:200px;max-width:280px;">' +
            '<div style="font-size:14px;font-weight:bold;margin-bottom:4px;color:#1a1a2e;">\ud83e\udde5 ' + trail.name + '</div>';
        if (sacLabel) {
            popupHtml += '<div style="margin-bottom:6px;"><span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:bold;color:#fff;background:' + color + ';">' + sacLabel + '</span></div>';
        }
        var meta = [];
        if (trail.distance) meta.push('\ud83d\udccf ' + trail.distance + ' km');
        if (trail.ascent) meta.push('\u2b06 ' + trail.ascent + ' m');
        if (trail.eleMax) meta.push('\ud83c\udfd4 max ' + trail.eleMax + ' m');
        if (meta.length) popupHtml += '<div style="font-size:11px;color:#666;margin-bottom:6px;">' + meta.join(' | ') + '</div>';
        if (trail.desc) popupHtml += '<div style="font-size:11px;color:#333;line-height:1.4;">' + trail.desc + '</div>';
        popupHtml += '</div>';

        polyline.bindTooltip('\ud83e\udde5 ' + trail.name, { sticky: true, direction: 'top', offset: [0, -8] });
        polyline.bindPopup(popupHtml, { maxWidth: 300 });

        (function(pl, origColor) {
            pl.on('mouseover', function() { pl.setStyle({ weight: 6, opacity: 1 }); });
            pl.on('mouseout', function() { pl.setStyle({ weight: 4, opacity: 0.85, color: origColor }); });
        })(polyline, color);

        MAP.hikingRouteLayer.addLayer(polyline);
    }

    MAP.map.addLayer(MAP.hikingRouteLayer);
};

/* ── Debounced refresh for hiking routes on map move ── */
MAP._hikingRefreshTimer = null;
MAP.debouncedRefreshHiking = function() {
    if (!MAP.hikingVisible) return;
    clearTimeout(MAP._hikingRefreshTimer);
    MAP._hikingRefreshTimer = setTimeout(function() {
        MAP.fetchHikingRoutes();
    }, 1000);
};
