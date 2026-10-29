# DDCS V4.1 — AI pack

> Every measured statement names the bench test that measured it (see evidence.md).

A context pack for an AI assistant that writes G-code and macros for the **DDCS V4.1**: the rules in plain words, the
syntax that runs on it, the hazards, and the bench evidence behind each measured rule.

Measured on: a motorless bench DDCS V4.1, firmware 2025-04-04 (2025-04-04-012-NOR).

## How to load it

- **From git**: clone this repository into `~/.claude/skills/` (it carries a `SKILL.md`) and `git pull` to update it; then fill `vendor/` from your own controller (`vendor/README.md`).
- **Claude Code**: copy this folder into `~/.claude/skills/` (it carries a `SKILL.md`), or attach the files to a conversation.
- **Any other assistant**: attach `SKILL.md` first, then the files it points to.

## Files

- `README.md`
- `SKILL.md`
- `differences.md`
- `syntax.md`
- `variables.md`
- `dialogs.md`
- `hazards.md`
- `integration.md`
- `evidence.md`
- `examples/`
- `community/`
- `vendor/`

## Is my copy current?

`git pull` brings it up to date; the repository's history is its changelog.

## What it is not

Not bench evidence: `vendor/`, which this repository leaves EMPTY (git ignores it): it is for your own controller's files, and `vendor/README.md` says which and where from. Other people's community notes are not re-published here; `community/conflicts.md` quotes only the claims a measurement contradicts. Everything else is our own material. No controller IDs or serials.
