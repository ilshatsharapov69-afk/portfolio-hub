---
title: Philippines Living Map
order: 1
tagline: Interactive Leaflet map with 78 curated locations in Cebu — ratings, safety layers, volcano & earthquake overlays. Built to help expats and locals make informed housing decisions.
stack: ["Leaflet.js", "Vanilla JS", "GeoJSON", "GitHub Pages"]
result: 78 locations mapped across 5 data layers (infrastructure, safety, natural hazards, amenities, ratings). Fully offline-capable static site.
repoUrl: "https://github.com/ilshatsharapov69-afk/cebu-living-map"
status: live
---

## Problem

Expats moving to Cebu face a messy information landscape — dozens of Facebook groups, outdated blog posts, conflicting advice on "safe" vs "risky" areas. No single resource combines location-level ratings with real geographic context like earthquake fault lines or flood zones.

## Solution

A static interactive map that pulls everything into one layered view:

- **Locations layer** — 78 manually curated points (districts, neighborhoods, landmarks) with rating and commentary
- **Safety layer** — risk zones based on public crime and disaster data
- **Natural hazards** — volcano proximity and earthquake fault overlays from USGS data
- **Infrastructure** — hospitals, malls, internet-quality clusters

The entire thing is a single-page Leaflet.js app, no backend, hosted on GitHub Pages for zero cost.

## Stack

Leaflet.js for the map engine, vanilla JavaScript for layer toggling, GeoJSON for data. Deployed as a static site.

## Why this matters

Shows the ability to take a messy domain (personal research notes + public datasets) and turn it into a sharable, useful product. No framework bloat — just the minimum needed to ship.
