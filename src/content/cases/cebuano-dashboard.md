---
title: Cebuano Learning Dashboard
order: 2
tagline: Personal language-learning dashboard built around a combinatorial method — 5 new words per day, auto-generated sentence permutations, spaced review. Live embedded below.
stack: ["HTML", "CSS", "Vanilla JS", "LocalStorage"]
result: Self-contained single-file app. Learning Cebuano (Bisaya) with a repeatable daily ritual instead of ad-hoc flashcards.
embedPath: "/dashboards/cebuano/"
status: live
---

## Problem

Learning Cebuano living in the Philippines — no decent apps, Duolingo doesn't cover it, dictionaries are static. Needed a lightweight daily driver I actually open every morning.

## Solution

A single HTML file that holds the entire learning system:

- **5 new words/day** — picked manually, stored in LocalStorage
- **Combinatorial sentences** — small word pool × grammar patterns produces many practice sentences from few inputs
- **Daily review board** — today's words, yesterday's words, streak counter

No login, no sync, no backend. Open the file, use it, close it.

## Stack

HTML + CSS + vanilla JavaScript. Data in LocalStorage. Runs offline.

## Why this matters

A working product for an audience of one — me. Shows discipline in picking the smallest thing that solves the problem. No React, no framework, no build step. Ships because it's simple.
