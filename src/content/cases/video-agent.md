---
title: VideoAgent
order: 6
tagline: Unified YouTube pipeline — one recording in, one long-form video + multiple shorts out. EDL-driven cuts, Whisper transcripts, MediaPipe face tracking, Remotion composition, FFmpeg render.
stack: ["Python", "Whisper", "MediaPipe", "Remotion", "FFmpeg"]
result: End-to-end EDL → long + shorts pipeline. 6/6 E2E passing, 94/94 unit tests green as of Day 6 build.
status: in-progress
---

## Problem

Producing one YouTube long video + 3–5 shorts from the same recording takes hours of manual editing. Existing "AI shorts" tools either require a SaaS subscription or produce uncreative cuts that don't match the long video's framing.

## Solution

An EDL-driven pipeline (Edit Decision List as the contract between stages):

- **Ingest** — Whisper transcribes the raw recording to timestamped text
- **EDL builder** — applies cut rules (fillers, long pauses, tangents) plus shorts-candidate detection (high-energy segments, self-contained hooks)
- **Face tracking** — MediaPipe locks framing on speaker for vertical shorts
- **Compose** — Remotion builds long and shorts compositions from the same EDL
- **Render** — FFmpeg produces final MP4s per target platform

Each stage has a typed contract and isolated tests, so a failure is localized to a specific step — not "the whole pipeline broke."

## Stack

Python orchestration, Whisper for transcription, MediaPipe for tracking, Remotion (React-based video compositions) for layout, FFmpeg for final render.

## Why this matters

Real systems design problem, not a toy. Contracts between stages matter more than any single stage being clever. Tests gate the pipeline — 94/94 green means refactors are safe.
