---
name: ddcs-v41
description: Rules for writing G-code and macros for the DDCS V4.1 CNC controller (not the DDCS Expert / M350, not Fanuc Macro B): syntax, jumps, operator dialogs, the #variables (look one up before writing it), hazards, the vendor macros and dialogs; from bench-measured findings.
---

# DDCS V4.1 — Rulebook

> For the DDCS Expert / M350, use the `ddcs-expert` skill; for the DDCS V3 / DM500, use the `ddcs-v3-dm500` skill instead: this one is for the DDCS V4.1 only.

> Every measured statement names the bench test that measured it (see evidence.md).


## The rules

0. This controller is NOT Fanuc Macro B and NOT the DDCS Expert M350: do not carry habits from either (differences.md).
1. Any jump or loop needs Macro Mode (#122 "Macro programming mode" = Enable, set by the operator on the Param page). Never write #122 from a program.
2. Jump with `IF #190<#191GOTO5` and a label line `N5`.
3. Never write an inline `IF .. THEN` assignment: write a negated jump, the assignment, then the label (syntax.md).
4. Start every line at column 0.
5. A comment is `( text )` with no `(` or `)` inside it: it ends at its first `)`, the text after that is read as code, and a bad leftover stops the run mid-way.
6. G04 P is in milliseconds: 1.5 s is `G04 P1500`.
7. Never keep data in #100, #101, #102, #103, #104: #100 is the DDCS V4.1's dialog control variable: any dialog resets it to 0; #101-#148 are the DDCS V4.1's own dialog memory (the operator's remembered tool-change and probe defaults); #101-#148 are the DDCS V4.1's own dialog memory (M6.rc binds #102-#105).
8. Operator prompts, number entry and choices are `.rc` dialogs opened with `MarcoDialog "<full path>"`; the operator holds Ok to continue (dialogs.md).
9. No unparseable line measured refused the file at load: the program started, and stopped (RESET) when the parser, which reads ahead, reached the bad line, up to 49 lines before the run got there; some variable writes before it had run, the moves near it had not (S6e, ALIAS_SPACE_MOVES, ALIAS_SPACE_MOVES_SYNC, ALIAS_SPACE_MOVES_FAR, ALIAS_NUM_COORD (alias matrix)). Treat a stopped program as possibly half-run, and check every line before sending.
10. `vendor/` holds the vendor's own macro and dialog files ONLY when the person has put them there (a fresh copy of this repository has none; `vendor/README.md` says which files and where from). If `vendor/macros/<file>` or `vendor/dialogs/<file>` exists, read it FIRST and say which firmware version it came from (`vendor/VERSION.txt` if they wrote one, else ask: it may be newer than the firmware this pack was measured on); if it does not exist, use the lines this pack quotes from it (`vendor/README.md`, `evidence.md`). Neither is a bench test, and other people's community notes are not re-published here: where either disagrees with this pack's measured files, the measured files win (`community/conflicts.md` lists each known disagreement).

## Read next

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
