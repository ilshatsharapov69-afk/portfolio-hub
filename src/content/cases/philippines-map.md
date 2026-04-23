---
title: Philippines Living Map
order: 1
tagline: Interactive Philippines map — 200 curated locations, 9 hazard layers (earthquakes, typhoons, eruptions, floods, and more), year-based filters, lifestyle presets, dark/light theme, RU/EN. Live embedded below.
stack: ["Leaflet.js", "Vanilla JS", "GeoJSON", "OpenStreetMap Overpass"]
result: 200 locations × 9 hazard layers × lifestyle preset scoring. Fully static SPA — no backend, no build step, instant load.
embedPath: "/dashboards/philippines-map/"
status: live
---

## Problem

Picking where to live or travel in the Philippines is a mess of outdated blog posts, Facebook groups, and single-axis "best beach" lists. None of it shows hazard history in context with real locations — an area looks great until you realize it's under a typhoon corridor with three eruptions in the last decade.

## Solution

A single-page Leaflet app that folds everything into one layered view:

- **200 curated locations** — cities, towns, beaches, hikes, attractions, with ratings and commentary
- **9 hazard layers** — earthquakes, volcanic eruptions, typhoons, floods, landslides, and more, with year-based filtering so you can scope "last 5 years" or "since 2000"
- **Lifestyle presets** — one-click scoring profiles (digital nomad, family, beach-first, hiker) that re-rank locations against the layers that matter to each persona
- **Dark / light theme + RU / EN** — switchable without reload
- **POI data on demand** — pulls OpenStreetMap points of interest via Overpass API on zoom

## Stack

Leaflet.js + vanilla JavaScript (no framework, no build step). GeoJSON data bundled in-repo. OpenStreetMap Overpass API for on-demand POIs. Purely static — deploys anywhere, including inside this portfolio.

## Why this matters

Feature density without framework bloat. 200 locations, 9 data layers, multi-theme, i18n, lifestyle presets — all in a no-build vanilla-JS SPA that loads in under a second. Shows the willingness to pick the minimum tool that matches the problem rather than defaulting to React for everything.
