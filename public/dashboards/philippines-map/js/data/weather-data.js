window.MAP = window.MAP || {};

// Average annual temperature (°C) and precipitation (mm/year) for each location
// Based on PAGASA climate data, Philippine climate zones (Type I-IV)
MAP.WEATHER_DATA = {
    // Metro Manila — tropical monsoon, 26-28°C, ~2000mm
    'makati':        { temp: 27.5, rain: 2020 },
    'bgc':           { temp: 27.5, rain: 2020 },
    'quezon-city':   { temp: 27.3, rain: 2100 },
    'pasig':         { temp: 27.4, rain: 2050 },
    'mandaluyong':   { temp: 27.4, rain: 2040 },
    'las-pinas':     { temp: 27.6, rain: 1980 },
    'paranaque':     { temp: 27.6, rain: 1990 },
    'caloocan':      { temp: 27.5, rain: 2080 },
    'san-juan':      { temp: 27.4, rain: 2030 },
    'pasay':         { temp: 27.6, rain: 1990 },
    'valenzuela':    { temp: 27.5, rain: 2060 },
    'navotas':       { temp: 27.6, rain: 2000 },
    'ermita':        { temp: 27.7, rain: 2010 },
    'tondo':         { temp: 27.7, rain: 2010 },
    'alabang':       { temp: 27.3, rain: 2050 },
    'marikina':      { temp: 27.2, rain: 2150 },

    // Cebu City — tropical, 27-28°C, ~1550mm (drier)
    'it-park':       { temp: 27.8, rain: 1550 },
    'lahug':         { temp: 27.6, rain: 1560 },
    'banilad':       { temp: 27.5, rain: 1540 },
    'talamban':      { temp: 27.3, rain: 1570 },
    'guadalupe':     { temp: 27.7, rain: 1530 },

    // Cebu Province
    'mactan':        { temp: 28.0, rain: 1480 },
    'mandaue':       { temp: 27.8, rain: 1530 },
    'liloan':        { temp: 27.5, rain: 1580 },
    'consolacion':   { temp: 27.4, rain: 1560 },
    'talisay-cebu':  { temp: 27.6, rain: 1510 },
    'minglanilla':   { temp: 27.5, rain: 1520 },
    'carcar':        { temp: 27.3, rain: 1490 },
    'moalboal':      { temp: 27.8, rain: 1350 },
    'oslob':         { temp: 27.9, rain: 1300 },
    'toledo':        { temp: 27.4, rain: 1600 },
    'danao':         { temp: 27.3, rain: 1620 },
    'compostela-cebu': { temp: 27.2, rain: 1650 },
    'dalaguete':     { temp: 27.0, rain: 1400 },

    // Cebu Islands
    'bantayan':      { temp: 28.0, rain: 1300 },
    'malapascua':    { temp: 28.1, rain: 1350 },
    'camotes':       { temp: 27.8, rain: 1450 },

    // Bohol — 27°C, ~1600mm
    'tagbilaran':    { temp: 27.5, rain: 1600 },
    'panglao':       { temp: 27.8, rain: 1500 },
    'anda-bohol':    { temp: 27.6, rain: 1550 },
    'loboc':         { temp: 27.0, rain: 1700 },
    'carmen-bohol':  { temp: 27.2, rain: 1650 },

    // Negros Oriental
    'dumaguete':     { temp: 27.8, rain: 1500 },
    'bayawan':       { temp: 27.5, rain: 1550 },
    'bais':          { temp: 27.6, rain: 1480 },

    // Siquijor — warm, moderate rain
    'siquijor':      { temp: 27.8, rain: 1400 },
    'siquijor-town': { temp: 27.8, rain: 1400 },
    'san-juan-siquijor': { temp: 27.9, rain: 1380 },

    // Western Visayas
    'iloilo-city':   { temp: 27.5, rain: 2000 },
    'bacolod':       { temp: 27.8, rain: 1900 },
    'boracay':       { temp: 27.5, rain: 2200 },
    'roxas-city':    { temp: 27.3, rain: 2300 },
    'silay':         { temp: 27.6, rain: 1950 },
    'guimaras':      { temp: 27.5, rain: 2000 },
    'kalibo':        { temp: 27.4, rain: 2400 },
    'kabankalan':    { temp: 27.3, rain: 1800 },

    // Cordillera — cooler at altitude
    'baguio':        { temp: 19.6, rain: 4500 },
    'sagada':        { temp: 18.5, rain: 3200 },
    'banaue':        { temp: 20.5, rain: 3000 },
    'bontoc':        { temp: 19.8, rain: 2800 },
    'la-trinidad':   { temp: 20.0, rain: 4200 },
    'tabuk':         { temp: 25.5, rain: 2000 },

    // Ilocos — hot, dry season
    'vigan':         { temp: 27.0, rain: 2100 },
    'laoag':         { temp: 27.2, rain: 2000 },
    'san-juan-lu':   { temp: 26.8, rain: 2400 },
    'dagupan':       { temp: 27.5, rain: 2200 },
    'san-fernando-lu': { temp: 26.9, rain: 2350 },
    'pagudpud':      { temp: 26.8, rain: 2300 },

    // Cagayan Valley — hot lowlands
    'tuguegarao':    { temp: 28.2, rain: 1700 },
    'santiago-isabela': { temp: 27.8, rain: 1800 },

    // Central Luzon
    'angeles':       { temp: 27.5, rain: 2100 },
    'subic':         { temp: 27.2, rain: 3200 },
    'san-fernando-pampanga': { temp: 27.5, rain: 2100 },
    'tarlac':        { temp: 27.8, rain: 1900 },

    // Eastern Visayas — wettest, typhoon corridor
    'tacloban':      { temp: 27.2, rain: 2700 },
    'ormoc':         { temp: 27.0, rain: 2200 },
    'catbalogan':    { temp: 27.0, rain: 3100 },
    'baybay':        { temp: 27.0, rain: 2500 },
    'sogod':         { temp: 27.1, rain: 2600 },

    // Bicol — wet, typhoon belt
    'naga-camarines': { temp: 27.0, rain: 2800 },
    'legazpi':       { temp: 27.2, rain: 3000 },
    'sorsogon':      { temp: 27.0, rain: 3200 },
    'catanduanes':   { temp: 26.8, rain: 3500 },

    // Calabarzon
    'antipolo':      { temp: 26.5, rain: 2400 },
    'tagaytay':      { temp: 23.5, rain: 2600 },
    'santa-rosa':    { temp: 27.0, rain: 2200 },
    'los-banos':     { temp: 26.8, rain: 2500 },
    'batangas-city': { temp: 27.3, rain: 1900 },
    'lipa':          { temp: 26.0, rain: 2300 },
    'calamba':       { temp: 27.0, rain: 2200 },
    'san-pablo-laguna': { temp: 26.5, rain: 2400 },
    'lucena':        { temp: 27.0, rain: 2200 },
    'nasugbu':       { temp: 27.2, rain: 1800 },
    'calatagan':     { temp: 27.5, rain: 1600 },
    'anilao':        { temp: 27.5, rain: 1700 },
    'san-pablo':     { temp: 26.5, rain: 2400 },
    'laiya':         { temp: 27.5, rain: 1800 },
    'cavite-city':   { temp: 27.5, rain: 2000 },
    'dasmarinas':    { temp: 27.2, rain: 2100 },

    // Mindoro
    'calapan':       { temp: 27.0, rain: 2200 },
    'puerto-galera': { temp: 27.5, rain: 2000 },
    'san-jose-mindoro': { temp: 27.5, rain: 1800 },
    'roxas-mindoro': { temp: 27.2, rain: 2300 },

    // Palawan — tropical, moderate rain
    'puerto-princesa': { temp: 27.5, rain: 1600 },
    'el-nido':       { temp: 27.8, rain: 1800 },
    'coron':         { temp: 27.8, rain: 1700 },
    'san-vicente-palawan': { temp: 27.6, rain: 1750 },
    'port-barton':   { temp: 27.6, rain: 1800 },
    'sabang-palawan': { temp: 27.4, rain: 1650 },

    // Davao — equatorial, consistent
    'davao':         { temp: 27.5, rain: 1850 },
    'tagum':         { temp: 27.2, rain: 1900 },
    'panabo':        { temp: 27.3, rain: 1880 },
    'digos':         { temp: 27.0, rain: 1800 },
    'samal':         { temp: 27.5, rain: 1700 },

    // Northern Mindanao
    'cdo':           { temp: 27.0, rain: 2200 },
    'iligan':        { temp: 27.0, rain: 2400 },
    'camiguin':      { temp: 27.2, rain: 2000 },
    'bukidnon':      { temp: 24.0, rain: 2500 },

    // Southern Mindanao
    'gensan':        { temp: 27.8, rain: 1500 },
    'siargao':       { temp: 27.5, rain: 2800 },
    'zamboanga':     { temp: 27.5, rain: 1200 },
    'dipolog':       { temp: 27.0, rain: 2100 },
    'dapitan':       { temp: 27.0, rain: 2050 },
    'surigao':       { temp: 27.0, rain: 3200 },
    'butuan':        { temp: 27.2, rain: 2600 },
    'ozamiz':        { temp: 27.0, rain: 2200 },
    'koronadal':     { temp: 27.0, rain: 1800 },
    'kidapawan':     { temp: 26.5, rain: 2200 },
    'cotabato':      { temp: 27.5, rain: 1900 },
    'marawi':        { temp: 25.5, rain: 2500 },
    'tandag':        { temp: 27.0, rain: 2900 },
    'bislig':        { temp: 27.0, rain: 3300 },
};
