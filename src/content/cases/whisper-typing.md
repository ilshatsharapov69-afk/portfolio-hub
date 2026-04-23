---
title: Whisper Typing
order: 5
tagline: Windows speech-to-text fork with enhancements — local faster-whisper, natural typing simulation, global hotkey, media pause, system tray. No cloud, no account.
stack: ["Python", "faster-whisper", "PyAutoGUI", "Windows APIs"]
result: Daily driver dictation tool. Forked upstream + added audio overlay, media pause, hold-to-record mode. Public fork on GitHub.
repoUrl: "https://github.com/ilshatsharapov69-afk/whisper-typing"
status: live
---

## Problem

Commercial dictation tools either ship audio to the cloud (privacy concern) or feel robotic (instant paste-dump feels unnatural in chat apps). Existing OSS whisper tools are minimal — no global hotkey behavior, no auto-pause on playing media, no typing simulation.

## Solution

Fork and extend an existing whisper-based tool with everyday-use polish:

- **Local faster-whisper** — everything runs on the machine, no API calls
- **Natural typing simulation** — paces characters with realistic jitter so it reads as typed, not pasted
- **Hold-to-record hotkey** — push-to-talk vs toggle mode
- **Media pause** — auto-pauses playing audio/video while you dictate so the mic stays clean
- **Audio overlay + system tray** — always-visible recording state without a full window

## Stack

Python core (faster-whisper), PyAutoGUI for typing output, Windows native APIs for media control and system tray, global keyboard hooks for hotkeys.

## Why this matters

Fork-and-extend is underrated. Didn't rebuild from scratch — took a working foundation, identified real friction in daily use, added only what mattered. Code reads small because the scope was disciplined.
