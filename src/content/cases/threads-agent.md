---
title: ThreadsAgent
order: 3
tagline: AI agent for Meta Threads that scans viral competitor content, generates original posts in a trained voice, and publishes via real-browser automation. Two live accounts (AI-tech + Dating niches).
stack: ["Python", "Patchright (browser automation)", "SQLite", "Claude API", "LLM voice tuning"]
result: Autonomous posting pipeline with 5 content layers (hot takes, observations, honest struggles, outcomes, questions). Real posts, real engagement, no Meta API.
status: live
---

## Problem

Threads has no official posting API for non-enterprise accounts. Manual posting burns hours daily, and most "AI content tools" produce monotone slop — all posts end up sounding the same ("$X saved, here's how...").

## Solution

A multi-agent system that mimics a human content workflow:

- **Scanner** — crawls competitor accounts, extracts viral patterns and hooks
- **Analyst** — clusters what works by content type, time of day, format
- **Generator** — produces 5 distinct layers of posts (not just "value bombs") so the feed reads human
- **Poster** — Patchright browser automation drives a real Threads session, types like a person, handles multi-factor flows
- **Content diversity layer** — hard rule against the "$X saved" monotone pattern

All orchestrated via agent loops with memory persisted in SQLite.

## Stack

Python agents, Patchright for stealth browser automation, SQLite for state and competitor analytics, Claude API for generation. No Meta API dependency.

## Why this matters

Real-world automation problem — scraping + generation + posting + avoiding detection + content quality control. Ships on platforms that don't want you to automate them, which is most of them.
