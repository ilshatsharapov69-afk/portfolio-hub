---
title: DeepResearch System
order: 7
tagline: A personal research system — 3 skills, 48 stored reports, 285+ sources. Structured pipeline for turning vague questions into citable, reusable knowledge. Live command-center embedded below.
stack: ["Markdown", "YAML frontmatter", "Claude Code skills", "WebSearch + MCP"]
result: 48 indexed research reports spanning AI tooling, content strategy, and technical deep-dives. Every claim is source-backed — every report is reusable context for future work.
embedPath: "/dashboards/command-center/"
status: live
---

## Problem

Every AI/research task produces throwaway context — you search, you synthesize, you use the answer, you lose it. Next month the same question comes back and you start from zero. Classic knowledge-work problem.

## Solution

A three-skill research pipeline that enforces structure:

- **`/deep-research`** — 8-phase pipeline (scope → parallel search → cross-source verification → contradictions → synthesis → store → index). Takes 10–20 minutes, produces a full report with ≥5 sources.
- **`/quick-search`** — 2–3 queries, fast answer, still source-cited
- **`/research-store`** — semantic search over everything already produced

Every report follows the same template (`templates/research-report.md`): executive summary → key findings → detailed analysis → contradictions → conclusions → sources. All stored under `research/YYYY-MM-DD_topic-slug/` with frontmatter (tags, status, source count) so the index is machine-readable.

## Stack

Claude Code custom skills, Markdown + YAML frontmatter for storage, WebSearch + MCP servers (Brave, Tavily, Exa) for multi-engine coverage, a dashboard HTML that reads the index.

## Why this matters

This IS the meta-project — the thing that makes every other project faster. Knowledge compounds instead of evaporating. Every new task starts with an existing base of verified context. The command center embedded below shows the running state.
