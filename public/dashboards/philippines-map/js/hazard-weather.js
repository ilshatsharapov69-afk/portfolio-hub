window.MAP = window.MAP || {};

// Temperature color: cool blue → green → warm orange → hot red
MAP.tempToColor = function(temp) {
    if (temp <= 20) return '#2196f3';
    if (temp <= 22) return '#4caf50';
    if (temp <= 24) return '#8bc34a';
    if (temp <= 26) return '#cddc39';
    if (temp <= 27) return '#ffeb3b';
    if (temp <= 28) return '#ff9800';
    return '#f44336';
};

// Precipitation color: dry yellow → wet blue → heavy purple
MAP.rainToColor = function(rain) {
    if (rain <= 1400) return '#fff176';
    if (rain <= 1800) return '#aed581';
    if (rain <= 2200) return '#4fc3f7';
    if (rain <= 2800) return '#2196f3';
    if (rain <= 3500) return '#7b1fa2';
    return '#4a148c';
};

MAP.renderTemperatureLayer = function() {
    if (MAP.hazardLayers.temperature) {
        MAP.map.removeLayer(MAP.hazardLayers.temperature);
        delete MAP.hazardLayers.temperature;
    }

    var group = L.layerGroup();
    var heatPoints = [];

    for (var i = 0; i < MAP.LOCATIONS.length; i++) {
        var loc = MAP.LOCATIONS[i];
        var w = MAP.WEATHER_DATA[loc.id];
        if (!w) continue;

        var color = MAP.tempToColor(w.temp);
        var radius = 8 + Math.max(0, (w.temp - 18) * 0.8);

        var marker = L.circleMarker([loc.lat, loc.lng], {
            radius: radius,
            fillColor: color,
            color: '#fff',
            weight: 1.5,
            fillOpacity: 0.85,
            opacity: 0.9,
        });

        marker.bindTooltip(
            '<b>' + loc.name + '</b><br>🌡️ ' + w.temp.toFixed(1) + '°C',
            { direction: 'top', offset: [0, -8] }
        );

        marker.bindPopup(
            '<div style="font-family:-apple-system,sans-serif;min-width:160px;">' +
            '<div style="font-size:14px;font-weight:bold;color:' + color + ';">🌡️ ' + w.temp.toFixed(1) + '°C</div>' +
            '<div style="font-size:12px;margin:4px 0;">' + loc.name + '</div>' +
            '<div style="font-size:10px;color:#888;">' + (loc.region || '') + '</div>' +
            '<div style="font-size:10px;color:#888;margin-top:4px;">🌧️ ' + MAP.t('precipitation_label') + ': ' + w.rain + ' ' + MAP.t('precipitation_mm') + '</div>' +
            '<div style="font-size:9px;color:#666;margin-top:4px;">' + MAP.t('avg_annual') + '</div>' +
            '</div>'
        );

        group.addLayer(marker);

        // Heatmap intensity based on temperature
        var intensity = Math.max(0.1, (w.temp - 18) / 12);
        heatPoints.push([loc.lat, loc.lng, intensity]);
    }

    // Temperature heatmap
    var heat = L.heatLayer(heatPoints, {
        radius: 40, blur: 35, maxZoom: 12, max: 1.0,
        gradient: { 0.0: '#2196f3', 0.3: '#4caf50', 0.5: '#ffeb3b', 0.7: '#ff9800', 1.0: '#f44336' },
    });
    group.addLayer(heat);

    MAP.hazardLayers.temperature = group;
    MAP.map.addLayer(group);
    MAP.updateHazardCount('temperature', MAP.LOCATIONS.length);
};

MAP.renderPrecipitationLayer = function() {
    if (MAP.hazardLayers.precipitation) {
        MAP.map.removeLayer(MAP.hazardLayers.precipitation);
        delete MAP.hazardLayers.precipitation;
    }

    var group = L.layerGroup();
    var heatPoints = [];

    for (var i = 0; i < MAP.LOCATIONS.length; i++) {
        var loc = MAP.LOCATIONS[i];
        var w = MAP.WEATHER_DATA[loc.id];
        if (!w) continue;

        var color = MAP.rainToColor(w.rain);
        var radius = 6 + (w.rain / 500);

        var marker = L.circleMarker([loc.lat, loc.lng], {
            radius: Math.min(radius, 16),
            fillColor: color,
            color: '#fff',
            weight: 1.5,
            fillOpacity: 0.85,
            opacity: 0.9,
        });

        var rainLabel;
        if (w.rain <= 1500) rainLabel = MAP.t('rain_dry');
        else if (w.rain <= 2000) rainLabel = MAP.t('rain_moderate');
        else if (w.rain <= 2800) rainLabel = MAP.t('rain_wet');
        else rainLabel = MAP.t('rain_very_wet');

        marker.bindTooltip(
            '<b>' + loc.name + '</b><br>🌧️ ' + w.rain + ' мм/год',
            { direction: 'top', offset: [0, -8] }
        );

        marker.bindPopup(
            '<div style="font-family:-apple-system,sans-serif;min-width:160px;">' +
            '<div style="font-size:14px;font-weight:bold;color:' + color + ';">🌧️ ' + w.rain + ' мм/год</div>' +
            '<div style="font-size:12px;margin:4px 0;">' + loc.name + '</div>' +
            '<div style="font-size:10px;color:#888;">' + (loc.region || '') + '</div>' +
            '<div style="font-size:10px;margin-top:4px;color:' + color + ';">' + rainLabel + '</div>' +
            '<div style="font-size:10px;color:#888;margin-top:2px;">🌡️ ' + MAP.t('temperature_label') + ': ' + w.temp.toFixed(1) + '°C</div>' +
            '<div style="font-size:9px;color:#666;margin-top:4px;">' + MAP.t('avg_annual') + '</div>' +
            '</div>'
        );

        group.addLayer(marker);

        // Heatmap intensity based on precipitation
        var intensity = Math.max(0.1, (w.rain - 1000) / 3500);
        heatPoints.push([loc.lat, loc.lng, intensity]);
    }

    // Precipitation heatmap
    var heat = L.heatLayer(heatPoints, {
        radius: 40, blur: 35, maxZoom: 12, max: 1.0,
        gradient: { 0.0: '#fff176', 0.25: '#aed581', 0.5: '#4fc3f7', 0.75: '#2196f3', 1.0: '#4a148c' },
    });
    group.addLayer(heat);

    MAP.hazardLayers.precipitation = group;
    MAP.map.addLayer(group);
    MAP.updateHazardCount('precipitation', MAP.LOCATIONS.length);
};
