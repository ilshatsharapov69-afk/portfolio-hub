window.MAP = window.MAP || {};

MAP.LANG = localStorage.getItem('map-lang') || 'en';

MAP.T = {
    // Page / Sidebar
    subtitle:           { ru: 'Топ-200 мест для жизни на Филиппинах', en: 'Top 200 places to live in Philippines' },
    section_poi:        { ru: 'Инфраструктура и сервисы', en: 'Infrastructure & Services' },
    section_hazards:    { ru: 'Безопасность (слои)', en: 'Safety (layers)' },
    show_locations:     { ru: 'Показать локации', en: 'Show locations' },
    section_factors:    { ru: 'Критерии оценки', en: 'Evaluation Criteria' },
    reset_btn:          { ru: 'Сбросить', en: 'Reset' },
    preset_family:      { ru: '👨‍👩‍👧 Семья', en: '👨‍👩‍👧 Family' },
    preset_nomad:       { ru: '💻 Фрилансер', en: '💻 Digital Nomad' },
    preset_retreat:     { ru: '🏖️ Ретрит', en: '🏖️ Retreat' },
    legend_bad:         { ru: 'Плохо', en: 'Poor' },
    legend_mid:         { ru: 'Средне', en: 'Average' },
    legend_good:        { ru: 'Отлично', en: 'Excellent' },
    section_rankings:   { ru: 'Рейтинг локаций', en: 'Location Rankings' },
    no_locations:       { ru: 'Нет подходящих локаций.<br>Уменьшите пороги фильтров.', en: 'No matching locations.<br>Lower filter thresholds.' },
    hazard_hint:        { ru: 'Точки = реальные инциденты | Heatmap = плотность', en: 'Points = real incidents | Heatmap = density' },
    yr_title:           { ru: 'Период времени', en: 'Time range' },
    yr_from:            { ru: 'С',  en: 'From' },
    yr_to:              { ru: 'По', en: 'To' },
    coming_soon:        { ru: '(скоро)', en: '(coming soon)' },
    theme_dark:         { ru: 'Тёмная', en: 'Dark' },

    // Factor labels
    f_costOfLiving:     { ru: 'Стоимость жизни',       en: 'Cost of Living' },
    f_internet:         { ru: 'Интернет',              en: 'Internet' },
    f_food:             { ru: 'Свежая еда',            en: 'Fresh Food' },
    f_walkability:      { ru: 'Прогулки/природа',      en: 'Walkability' },
    f_quiet:            { ru: 'Тишина',                en: 'Quietness' },
    f_shopsWalkable:    { ru: 'Магазины рядом',        en: 'Shops Nearby' },
    f_beach:            { ru: 'Пляж',                  en: 'Beach' },
    f_crime:            { ru: 'Безопасность (крим)',    en: 'Safety (crime)' },
    f_weatherSafety:    { ru: 'Погода (стихия)',       en: 'Weather Safety' },
    f_airQuality:       { ru: 'Воздух',                en: 'Air Quality' },
    f_medicalAccess:    { ru: 'Медицина',              en: 'Medical Access' },
    f_immigration:      { ru: 'Иммиграционка (BI)',    en: 'Immigration (BI)' },
    f_expatCommunity:   { ru: 'Экспаты',               en: 'Expat Community' },
    f_attractions:      { ru: 'Достопримечательности', en: 'Attractions' },

    // POI categories
    poi_food:           { ru: 'Рынки / Еда',                 en: 'Markets / Food' },
    poi_shops:          { ru: 'Моллы / Магазины',             en: 'Malls / Shops' },
    poi_convenience:    { ru: 'Минимаркеты',                  en: 'Convenience Stores' },
    poi_beach:          { ru: 'Пляжи',                        en: 'Beaches' },
    poi_immigration:    { ru: 'Офисы миграционной службы',     en: 'Immigration Offices' },
    poi_internet:       { ru: 'Качество интернета',           en: 'Internet Quality' },
    poi_attractions:    { ru: 'Достопримечательности',        en: 'Attractions' },
    poi_hiking:         { ru: 'Хайкинг тропы',               en: 'Hiking Trails' },

    // Hazard categories
    hz_earthquake:      { ru: 'Землетрясения', en: 'Earthquakes' },
    hz_volcano:         { ru: 'Вулканы',       en: 'Volcanoes' },
    hz_typhoon:         { ru: 'Тайфуны',       en: 'Typhoons' },
    hz_flood:           { ru: 'Наводнения',    en: 'Floods' },
    hz_landslide:       { ru: 'Оползни',       en: 'Landslides' },
    hz_crime:           { ru: 'Криминал',       en: 'Crime' },
    hz_health:          { ru: 'Здоровье',      en: 'Health' },
    hz_temperature:     { ru: 'Температура',   en: 'Temperature' },
    hz_precipitation:   { ru: 'Осадки',        en: 'Precipitation' },

    // Popup labels
    depth:              { ru: 'Глубина',            en: 'Depth' },
    date:               { ru: 'Дата',               en: 'Date' },
    felt_by:            { ru: 'Ощутили',            en: 'Felt by' },
    people:             { ru: 'чел.',               en: 'people' },
    tsunami_warning:    { ru: 'Угроза цунами',     en: 'Tsunami warning' },
    intensity_mmi:      { ru: 'Интенсивность (MMI)',en: 'Intensity (MMI)' },
    deaths:             { ru: 'Погибших',           en: 'Deaths' },
    click_for_wave:     { ru: 'Кликните маркер для симуляции волны', en: 'Click marker for wave simulation' },
    km:                 { ru: 'км',                  en: 'km' },
    km_s:               { ru: 'км/с',               en: 'km/s' },
    km_h:               { ru: 'км/ч',               en: 'km/h' },
    from_epicenter:     { ru: 'от эпицентра',        en: 'from epicenter' },
    open_google_maps:   { ru: 'Открыть в Google Maps', en: 'Open in Google Maps' },
    type_label:         { ru: 'Тип',                 en: 'Type' },
    precipitation_mm:   { ru: 'мм/год',              en: 'mm/yr' },
    precipitation_label:{ ru: 'Осадки',              en: 'Precipitation' },
    temperature_label:  { ru: 'Температура',         en: 'Temperature' },
    avg_annual:         { ru: 'Среднегодовые данные PAGASA', en: 'Annual average (PAGASA)' },

    // MMI labels
    mmi_devastating:    { ru: 'Разрушительное',      en: 'Devastating' },
    mmi_heavy:          { ru: 'Сильное разрушение',  en: 'Heavy destruction' },
    mmi_strong:         { ru: 'Сильное',             en: 'Strong' },
    mmi_moderate:       { ru: 'Умеренное',           en: 'Moderate' },
    mmi_felt:           { ru: 'Ощутимое',            en: 'Felt' },
    mmi_weak:           { ru: 'Слабое',              en: 'Weak' },
    mmi_none:           { ru: 'Не ощутимо',          en: 'Not felt' },

    // PAGER
    pager_green:        { ru: '🟢 Зелёный',   en: '🟢 Green' },
    pager_yellow:       { ru: '🟡 Жёлтый',    en: '🟡 Yellow' },
    pager_orange:       { ru: '🟠 Оранжевый',  en: '🟠 Orange' },
    pager_red:          { ru: '🔴 Красный',     en: '🔴 Red' },

    // Seismic waves
    wave_p:             { ru: 'P-волна',             en: 'P-wave' },
    wave_s:             { ru: 'S-волна',             en: 'S-wave' },
    wave_surface:       { ru: 'Поверхностная',       en: 'Surface wave' },

    // Internet types
    inet_fiber100:      { ru: 'Fiber 100+ Mbps',     en: 'Fiber 100+ Mbps' },
    inet_fiber50:       { ru: 'Fiber 50-100 Mbps',   en: 'Fiber 50-100 Mbps' },
    inet_4g_stable:     { ru: '4G/LTE стабильный',   en: '4G/LTE stable' },
    inet_4g_basic:      { ru: '4G базовый',          en: '4G basic' },
    inet_3g:            { ru: '3G / слабый сигнал',  en: '3G / weak signal' },
    inet_starlink:      { ru: 'Starlink / нет покрытия', en: 'Starlink / no coverage' },

    // Precipitation labels
    rain_dry:           { ru: 'Сухой',               en: 'Dry' },
    rain_moderate:      { ru: 'Умеренный',           en: 'Moderate' },
    rain_wet:           { ru: 'Влажный',             en: 'Wet' },
    rain_very_wet:      { ru: 'Очень влажный',       en: 'Very wet' },

    // Severity / Crime / Health
    severity_level:     { ru: 'Уровень опасности',  en: 'Severity level' },
    affected:           { ru: 'Пострадавших',       en: 'Affected' },
    cause:              { ru: 'Причина',             en: 'Cause' },
    period:             { ru: 'Период',              en: 'Period' },
    foreigner_target:   { ru: 'Нацелено на иностранцев', en: 'Targets foreigners' },
    population:         { ru: 'Население',           en: 'Population' },
    murders:            { ru: 'Убийства',            en: 'Murders' },
    thefts:             { ru: 'Кражи',               en: 'Thefts' },
    cases:              { ru: 'Случаев',             en: 'Cases' },
    main_diseases:      { ru: 'Основные болезни',    en: 'Main diseases' },
    crime_extreme:      { ru: 'Крайне опасно',       en: 'Extremely dangerous' },
    crime_dangerous:    { ru: 'Опасно',              en: 'Dangerous' },
    crime_moderate:     { ru: 'Умеренно',            en: 'Moderate' },
    crime_safe:         { ru: 'Безопасно',           en: 'Safe' },
    crime_very_safe:    { ru: 'Очень безопасно',     en: 'Very safe' },
    health_high:        { ru: 'Высокий риск',        en: 'High risk' },
    health_elevated:    { ru: 'Повышенный',          en: 'Elevated' },
    health_moderate:    { ru: 'Умеренный',           en: 'Moderate' },
    health_low:         { ru: 'Низкий риск',         en: 'Low risk' },

    // Volcano
    v_status:           { ru: 'Статус',              en: 'Status' },
    v_elevation:        { ru: 'Высота',              en: 'Elevation' },
    v_eruption_history: { ru: 'История извержений',  en: 'Eruption history' },
    v_casualties:       { ru: 'Жертвы',              en: 'Casualties' },
    v_ash:              { ru: 'Пепел',               en: 'Ash' },
    v_cities:           { ru: 'городов',             en: 'cities' },
    v_threatened:       { ru: 'Под угрозой',         en: 'Threatened' },
    v_days:             { ru: 'дней',                en: 'days' },
    v_affected_cities:  { ru: 'Пострадавшие города', en: 'Affected cities' },
    v_waiting:          { ru: 'Ожидание...',         en: 'Waiting...' },
    v_click_to_close:   { ru: 'Кликните карту для закрытия', en: 'Click map to close' },
    v_covered:          { ru: 'Накрыто',             en: 'Covered' },
    v_from_volcano:     { ru: 'от вулкана',          en: 'from volcano' },
    v_sev_critical:     { ru: 'Критический',         en: 'Critical' },
    v_sev_heavy:        { ru: 'Тяжёлый',             en: 'Heavy' },
    v_sev_light:        { ru: 'Лёгкий',              en: 'Light' },

    // Typhoon
    ty_category:        { ru: 'Категория',           en: 'Category' },
    ty_max_wind:        { ru: 'Макс. ветер',         en: 'Max. wind' },
    ty_animate:         { ru: 'Анимировать путь',    en: 'Animate path' },
    ty_damage_by_city:  { ru: 'Ущерб по городам',    en: 'Damage by city' },
    ty_city:            { ru: 'Город',               en: 'City' },
    ty_damage:          { ru: 'Ущерб',               en: 'Damage' },

    // Beach
    beach_poor:         { ru: 'Плохо (1-3)',         en: 'Poor (1-3)' },
    beach_avg:          { ru: 'Средне (4-6)',        en: 'Average (4-6)' },
    beach_great:        { ru: 'Отлично (7-10)',      en: 'Excellent (7-10)' },
    access_free:        { ru: 'Бесплатный',          en: 'Free' },
    access_paid:        { ru: 'Платный',             en: 'Paid' },
    access_resort:      { ru: 'Резорт',              en: 'Resort' },

    // Hiking
    hk_hiking:          { ru: 'Хайкинг тропы',       en: 'Hiking Trails' },
    hk_easy:            { ru: 'Лёгкий',              en: 'Easy' },
    hk_moderate:        { ru: 'Средний',             en: 'Moderate' },
    hk_hard:            { ru: 'Сложный',             en: 'Hard' },

    // Loading / Status
    loading_earthquakes:{ ru: 'Загрузка землетрясений (USGS)...', en: 'Loading earthquakes (USGS)...' },
    loaded_eq:          { ru: 'Загружено {n} землетрясений (M3+, с 2014)', en: 'Loaded {n} earthquakes (M3+, since 2014)' },
    no_usgs:            { ru: 'Нет данных USGS',     en: 'No USGS data' },
    loading_poi:        { ru: 'Загрузка POI из OpenStreetMap...', en: 'Loading POI from OpenStreetMap...' },
    loading:            { ru: 'Загрузка: ',           en: 'Loading: ' },
    loaded_points:      { ru: ' точек',              en: ' points' },
    loading_hiking:     { ru: 'Загрузка хайкинг-маршрутов...', en: 'Loading hiking routes...' },
    routes_count:       { ru: 'Маршрутов: ',          en: 'Routes: ' },
    routes_error:       { ru: 'Ошибка загрузки маршрутов', en: 'Failed to load routes' },

    // Disease labels
    dis_dengue:         { ru: 'Денге',                en: 'Dengue' },
    dis_covid:          { ru: 'COVID-19',             en: 'COVID-19' },
    dis_leptospirosis:  { ru: 'Лептоспироз',         en: 'Leptospirosis' },
    dis_rabies:         { ru: 'Бешенство',           en: 'Rabies' },
    dis_cholera:        { ru: 'Холера',              en: 'Cholera' },
    dis_measles:        { ru: 'Корь',                en: 'Measles' },
    dis_food:           { ru: 'Пищ. отравление',     en: 'Food poisoning' },
    dis_respiratory:    { ru: 'Респираторные',       en: 'Respiratory' },
    dis_dengvaxia:      { ru: 'Dengvaxia',           en: 'Dengvaxia' },
    dis_tb:             { ru: 'Туберкулёз',          en: 'Tuberculosis' },
    dis_malaria:        { ru: 'Малярия',             en: 'Malaria' },

    // Crime legend
    crime_legend_safe:  { ru: 'Безопасно',           en: 'Safe' },
    crime_legend_calm:  { ru: 'Спокойно',            en: 'Calm' },
    crime_legend_mod:   { ru: 'Умеренно',            en: 'Moderate' },
    crime_legend_danger:{ ru: 'Опасно',              en: 'Dangerous' },
    crime_legend_high:  { ru: 'Высокая опасность',   en: 'High danger' },
    crime_legend_foreign:{ ru: 'Против иностранцев',  en: 'Against foreigners' },

    // Health legend
    health_legend_low:  { ru: 'Низкий',              en: 'Low' },
    health_legend_mod:  { ru: 'Умеренный',           en: 'Moderate' },
    health_legend_elev: { ru: 'Повышенный',          en: 'Elevated' },
    health_legend_high: { ru: 'Высокий',             en: 'High' },
    health_diseases:    { ru: 'Болезни',             en: 'Diseases' },

    // Hiking SAC
    sac_hiking:         { ru: 'Пешая тропа',          en: 'Hiking trail' },
    sac_mountain:       { ru: 'Горная тропа',         en: 'Mountain trail' },
    sac_demanding:      { ru: 'Сложная горная',       en: 'Demanding mountain' },
    sac_alpine:         { ru: 'Альпинизм',            en: 'Alpine hiking' },
    sac_difficult:      { ru: 'Сложный альпинизм',    en: 'Difficult alpine' },
};

MAP.t = function(key, params) {
    var entry = MAP.T[key];
    if (!entry) return key;
    var text = entry[MAP.LANG] || entry.en || key;
    if (params) {
        for (var p in params) {
            text = text.replace('{' + p + '}', params[p]);
        }
    }
    return text;
};
