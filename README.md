# DDCS V4.1 — Rulebook

> Every measured statement names the bench test that measured it (see evidence.md).

The Rulebook for writing G-code and macros for the **DDCS V4.1**: the rules in plain words, the
syntax that runs on it, the hazards, and the bench evidence behind each measured rule.

Measured on: a motorless bench DDCS V4.1, firmware 2025-04-04 (2025-04-04-012-NOR).

## How to load it

- **From git**: clone this repository anywhere and `git pull` to update it; then fill `vendor/` from your own controller (`vendor/README.md`).
- **An AI assistant**: give it `SKILL.md` first, then the files it points to. If your assistant supports skill folders, add this folder as one (it carries a `SKILL.md`).

## Files

- `LICENSE`
- `README.md`
- `SKILL.md`
- `differences.md`
- `syntax.md`
- `variables.md`
- `dialogs.md`
- `hazards.md`
- `operation.md`
- `ui.md`
- `integration.md`
- `evidence.md`
- `examples/`
- `community/`
- `vendor/`

## Is my copy current?

`git pull` brings it up to date; the repository's history is its changelog.

## What it is not

Not bench evidence: `vendor/`, which this repository leaves EMPTY (git ignores it): it is for your own controller's files, and `vendor/README.md` says which and where from. Other people's community notes are not re-published here; `community/conflicts.md` quotes only the claims a measurement contradicts. Everything else is our own material. No controller IDs or serials.

## Licence

CC BY 4.0: you may share and adapt this Rulebook, with credit to the DDCS Rulebook project (this repository). Quoted vendor lines and parameter names belong to their owners and are quoted for reference. The licence's full text is `LICENSE`.
