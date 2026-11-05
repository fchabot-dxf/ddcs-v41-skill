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
9. Never put `M0` inside an `M47` or `IF / GOTO` loop: `Start` after `M0` replays from Line 1 in dry-run mode (motors OFF) until it reaches the paused `M0` line, so physical motion in the loop skips passes. To pause or update variables inside a loop, open a blocking `.rc` dialog with `MarcoDialog "<full path>"` followed by `G04 P1500`, or end each pass with `M30` (syntax.md, dialogs.md; AUDIT_M0_REPLAY (situations 1-4, top-vs-bottom, straight-line Case A, falsification Exps 1-7, Edge Case 3 Pause+Start), a bench script, a bench script, a bench script, a bench script, a bench script, a bench script; AUDIT_M47_DIALOG (3-pass MarcoDialog + G04 P1500 + .nc swap, 2 back-to-back runs; live EDIT #150 wheel in M47 loop; WHILE DO1/END1 loop; external .rc swap 0-loop lag), a bench script, a bench script).
10. No unparseable line measured refused the file at load: the program started, and stopped (RESET) when the parser, which reads ahead, reached the bad line, up to 49 lines before the run got there; some variable writes before it had run, the moves near it had not (S6e, ALIAS_SPACE_MOVES, ALIAS_SPACE_MOVES_SYNC, ALIAS_SPACE_MOVES_FAR, ALIAS_NUM_COORD (alias matrix)). Treat a stopped program as possibly half-run, and check every line before sending.
11. ⛔ M98 P<n> runs the VENDOR subprogram when the vendor library has that number, not the O<n> in your own file. With its own O9103 in the file (it sets a marker), M98 P9103 left the marker at 0 and ran the vendor's G103 ellipse (slib-g.nc), which with no step never ended (1 run with the marker, 5 more hangs on P9102 and P9103). slib-g.nc holds O9100, O9102 and O9103: look a number up in the controller's slib files before you use it.
12. ⛔ A program that never ends shows READY. In every hang measured (the vendor ellipse above), the status box read READY while the mode box to its left read AUTO and the run timer counted, once for over an hour, and every Start was ignored; two Resets ended it (CONT, RESET, then READY). CONT in the mode box means no program is running, with one exception: a Sequence machining part paused at an M0 or by the Pause key reads CONT and READY too (v41-seq-stop-actions).
13. ⛔ M98 P9001 X5 to an O9001 placed AFTER M30 did not run the subprogram: no error, the program just went on. And reaching an O line in the main flow ENDS the program there, silently. Put a subprogram BEFORE M30 and jump over it (syntax.md, the measured recipe).
14. ⛔ Writing #3000 = 1 (text) FROZE the controller (Reset lit, no message, power-cycle needed), with Macro Mode on. Never write any variable from #2000 up on this controller: not the Expert's #2042 beep, #2070 number entry or #3000.
15. ⛔ Never write uservar from a PC, an ESP or any other device, not even between runs. No run-time event reads the file back (a program start, M0, Pause, a dialog, Reset, M47, Simulation: the program keeps its RAM value); only a reboot does (v41-var-inbound-sealed). The controller overwrites the file at its next save. To give a running program a value, put it in the PROGRAM FILE (replace the file by rename: v41-recipe-feed-running-program); read uservar only after a save point (an M0, a dialog, the end of the run).
16. ⛔ A subprogram must never read a letter its caller did not pass: the V4.1 does not clear the local slots of a sub between calls, and they hold GARBAGE, not 0. On an M98 call the words land X #1, Y #2, Z #3, A #4, B #5, C #6 and I #7 (#0 is unused); a call with no words left #0-#33 summing 30307, and an I5-only call left #0 = 2.4e-306, #8 = 5.3e-315 and #33 = 14.96. A sub that reads a local the caller left out reads a random number.
17. ⛔ Keep an M98 call to a few words: a call with fourteen words (I J K Q R U V W F S T H D E) stopped the run and the V4.1 then ignored every key until a power cycle; any two of U, V, W on one call stop the run mid-way, after some writes before it may have run.
18. `vendor/` holds the vendor's own macro and dialog files ONLY when the person has put them there (a fresh copy of this repository has none; `vendor/README.md` says which files and where from). If `vendor/macros/<file>` or `vendor/dialogs/<file>` exists, read it FIRST and say which firmware version it came from (`vendor/VERSION.txt` if they wrote one, else ask: it may be newer than the firmware this pack was measured on); if it does not exist, use the lines this pack quotes from it (`vendor/README.md`, `evidence.md`). Neither is a bench test, and other people's community notes are not re-published here: where either disagrees with this pack's measured files, the measured files win (`community/conflicts.md` lists each known disagreement).

## Read next

- `differences.md`: habits from Fanuc Macro B or the other DDCS that are wrong here
- `syntax.md`: the code forms that run, are refused or silently misbehave; the aliases
- `variables.md`: every #variable and parameter: its type, who reads and writes it, what survives a reboot
- `dialogs.md`: operator prompts and number entry
- `hazards.md`: what silently goes wrong or does damage, measured and not measured
- `operation.md`: using the controller day to day: homing, jogging, zeroing, loading and running a file
- `ui.md`: keys, menus and screens
- `integration.md`: reaching the controller from a PC: which doors are open, shares, hook files
- `evidence.md`: every measured fact with the bench test behind it
- `examples/`: archived test programs, word for word, with their results
- `community/`: other people's notes, ranked below the measured files
- `vendor/`: the vendor's own files, when the person has put them there
