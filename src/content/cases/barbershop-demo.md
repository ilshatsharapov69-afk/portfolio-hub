---
title: Blade & Crown — Barbershop Demo Site
order: 5
tagline: Demo marketing site for a premium barbershop — full-page editorial design with 18 AI-generated photos in a unified style. Shipped end-to-end including the content pipeline.
stack: ["HTML", "CSS", "JavaScript", "Gemini API (image gen)"]
result: Full marketing site (hero, services, gallery, before/after, CTA) with 18 consistent-style images generated via Gemini API. Live embedded below.
embedPath: "/dashboards/barbershop/"
status: live
---

## Problem

Small-business websites usually fall apart on visuals — either stock photos that every competitor also uses, or $500+ for a custom photoshoot the owner can't justify before they even have a site. Most "AI photo" tools produce mismatched cartoon output.

## Solution

Built a demo site end-to-end for a fictional premium barbershop, **Blade & Crown**, to prove the workflow works at the price point small businesses can actually pay:

- **Editorial design** — moody dark palette, real barbershop vibe (not stock-cheerful), full-width imagery
- **Unified AI photoshoot** — 18 images (service cards, gallery, before/after, hero/CTA backgrounds) generated via Gemini API with a shared style prompt so the whole site reads as one shoot, not a mix
- **Repeatable pipeline** — a single `generate.py` script regenerates any image if the owner changes services; the style prompt lives in one place

## Stack

Plain HTML/CSS/JS for the site (no framework bloat — small-business sites don't need React). Gemini API + a shared style prompt + batch generation for the imagery. Static hosting on Cloudflare Pages.

## Why this matters

Real freelance scenario, not a template. The hard part of small-business sites isn't the HTML — it's making the visuals look like one intentional design. A repeatable AI-photoshoot pipeline is the differentiator: the same system works for a restaurant, a salon, a clinic, any local business.
