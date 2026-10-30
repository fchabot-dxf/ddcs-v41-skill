# DDCS V4.1 — vendor/: your controller's own files

> Every measured statement names the bench test that measured it (see evidence.md).

This folder is yours, and git ignores everything in it but this file: this repository never ships the vendor's files (they are the vendor's, referenced here, not re-hosted). Fill it with your own DDCS V4.1's files and they are read FIRST; with it empty, the lines quoted below are used. Either way they are **not bench tests**: they show what the vendor's code does, not that a user program behaves the same, and where they disagree with this pack's measured files, **the measured files win**.

This pack's bench ran firmware 2025-04-04 (2025-04-04-012-NOR); the lines quoted below are from firmware 2025-04-04-012. Yours may be newer: your own copy is what your controller runs.

## How to fill it

1. Copy them off your own controller over the network: its system share (SMB, guest login) is `sysdisk`, and every file below sits at its root. (A USB stick works only if your controller's file manager can copy system files: not tested.)
2. Or take them from the vendor's firmware update package `ddcsv4(2025-04-04)`, folder `ddcsv4/`; the vendor's own site (ddcnc.com); no download link is given here, so prefer your own controller's copy.
3. Put each `.nc` file in `vendor/macros/` and each `.rc` file in `vendor/dialogs/`, names unchanged, then write your controller's firmware version on one line in `vendor/VERSION.txt`, so whoever reads these files can say which version they came from.

How to read them: a menu or a key runs a macro file; a macro calls a library subprogram with `M98 P<n>` (the O-number below); `MarcoDialog "<file>.rc"` opens a dialog. M<n> runs O<10000 + n> in `slib-m.nc`.

## Macros

- `macros/M3.nc`: M3: spindle forward at the speed in #1813 (M3S#1813). In the release: `ddcsv4/M3.nc`.
- `macros/M4.nc`: M4: spindle reverse at the speed in #1813. In the release: `ddcsv4/M4.nc`.
- `macros/M5.nc`: M5: spindle stop. In the release: `ddcsv4/M5.nc`.
- `macros/adjush.nc`: Tool length adjust: opens adjush.rc. In the release: `ddcsv4/adjush.nc`.
- `macros/advstart.nc`: Advanced Startup: M98 P8001 (slib.nc O8001, the dialog advstart.rc). In the release: `ddcsv4/advstart.nc`.
- `macros/array.nc`: Array machining: M98 P8002 (slib.nc O8002, the dialog array.rc). In the release: `ddcsv4/array.nc`.
- `macros/centerx.nc`: Center finding on X (the center.rc dialog). In the release: `ddcsv4/centerx.nc`.
- `macros/centery.nc`: Center finding on Y (the center.rc dialog). In the release: `ddcsv4/centery.nc`.
- `macros/end.nc`: Run at a program end: clears G52 (G52X0Y0Z0A0B0C0). In the release: `ddcsv4/end.nc`.
- `macros/error.nc`: The error hook: empty here. In the release: `ddcsv4/error.nc`.
- `macros/gotoz.nc`: Go to Z zero: a safe-height move first when #1406 is set, then X0 Y0. In the release: `ddcsv4/gotoz.nc`.
- `macros/gotozxy.nc`: Go to X0 Y0 (G90 G0). In the release: `ddcsv4/gotozxy.nc`.
- `macros/home_0.nc`: Homing order 0: marks every axis to home (#1806-#1809 = 1), then G28 Z, X, Y, A one at a time. In the release: `ddcsv4/home_0.nc`.
- `macros/home_1.nc`: Homing order 1: G28 on X, Y, Z and A together. In the release: `ddcsv4/home_1.nc`.
- `macros/home_2.nc`: Homing order 2: G28 Z, Y, X, A one at a time. In the release: `ddcsv4/home_2.nc`.
- `macros/home_3.nc`: Homing order 3: G28 Y, X, Z, A one at a time. In the release: `ddcsv4/home_3.nc`.
- `macros/home_4.nc`: Homing order 4: G28 X, Y, Z, A one at a time. In the release: `ddcsv4/home_4.nc`.
- `macros/home_ref1.nc`: Return to reference point 1 (G28): Z first, then X Y. In the release: `ddcsv4/home_ref1.nc`.
- `macros/home_ref2.nc`: Return to reference point 2 (G30 P1): Z first, then X Y. In the release: `ddcsv4/home_ref2.nc`.
- `macros/home_ref3.nc`: Return to reference point 3 (G30 P2). In the release: `ddcsv4/home_ref3.nc`.
- `macros/home_ref4.nc`: Return to reference point 4 (G30 P3). In the release: `ddcsv4/home_ref4.nc`.
- `macros/loadbreak.nc`: Load breakpoint: M98 P8001 (slib.nc O8001, the dialogs break*.rc). In the release: `ddcsv4/loadbreak.nc`.
- `macros/m30.nc`: Run at M30: empty here. In the release: `ddcsv4/m30.nc`.
- `macros/macroMillCylinder.nc`: Milling cylindrical machining (the Mill menu entry): opens macroMillCylinder.rc and mills. In the release: `ddcsv4/macroMillCylinder.nc`.
  - quoted (firmware 2025-04-04-012), cited by `v41-hw-call`: `M98P#1802+1X#6-#3Y#5Z#11A#7`
- `macros/macroMillRect.nc`: Milling plane machining (the Mill menu entry): opens macroMillRect.rc and surfaces a rectangle. In the release: `ddcsv4/macroMillRect.nc`.
- `macros/null.nc`: An empty program. In the release: `ddcsv4/null.nc`.
- `macros/pause.nc`: The pause hook: clears G52, then lifts Z by #1404 unless #1403 says not to. In the release: `ddcsv4/pause.nc`.
- `macros/probe-fax.nc`: Fixed tool-setter probing (a second copy of probe-fix.nc, the same text). Not in the release: only on the controller.
- `macros/probe-fix.nc`: Fixing probing: the fixed tool setter (opens probe-fix.rc). In the release: `ddcsv4/probe-fix.nc`.
- `macros/probe-float.nc`: Floating probing: the floating tool setter on the work (opens probe-float.rc). In the release: `ddcsv4/probe-float.nc`.
- `macros/probe-h.nc`: Tool length (H) measurement (opens probe-h.rc). In the release: `ddcsv4/probe-h.nc`.
- `macros/probe-vertex.nc`: Vertex probing: find a corner (opens probe-vertex.rc). In the release: `ddcsv4/probe-vertex.nc`.
- `macros/rtnbreak.nc`: Return to the pause point: M98 P8000 (slib.nc O8000). In the release: `ddcsv4/rtnbreak.nc`.
- `macros/safez.nc`: Safe Z: lift to the Z safe height #1402 when #1400 asks for it. In the release: `ddcsv4/safez.nc`.
- `macros/selcoord.nc`: Select the work coordinate system (opens selcoord.rc). In the release: `ddcsv4/selcoord.nc`.
- `macros/simulate.nc`: Simulation: keeps the machine position in #490-#492 (opens simulate.rc). In the release: `ddcsv4/simulate.nc`.
- `macros/slib-g.nc`: The G-code library: the O-number subprograms behind G-codes such as G12 (circle pocket); see the list below. In the release: `ddcsv4/slib-g.nc`.
- `macros/slib-m.nc`: The M-code library: O<10000 + n> runs M<n>; here only M50 (a 1 s pulse on output 1), M6 (the tool change) and O20000 (G43 H#17). In the release: `ddcsv4/slib-m.nc`.
- `macros/slib.nc`: The main library: the subprograms the menu macros call with M98 P<n>; see the list below. In the release: `ddcsv4/slib.nc`.
- `macros/zeroall.nc`: Set zero on every axis: #1506-#1509 = 0 (the work position). In the release: `ddcsv4/zeroall.nc`.
- `macros/zeroxy.nc`: Set X and Y zero: #1506 = 0, #1507 = 0. In the release: `ddcsv4/zeroxy.nc`.
- `macros/zeroz.nc`: Set Z zero: #1508 = 0. In the release: `ddcsv4/zeroz.nc`.
- `macros/zeroza.nc`: Set Z and A zero: #1508 = 0, #1509 = 0. In the release: `ddcsv4/zeroza.nc`.

## Dialogs

- `dialogs/M6.rc`: The tool change dialog (msg-eng #578 "Tool change"), opened by slib-m.nc O10006. In the release: `ddcsv4/M6.rc`.
- `dialogs/adjush.rc`: The tool length adjust dialog. In the release: `ddcsv4/adjush.rc`.
- `dialogs/advstart-array.rc`: Advanced Startup for an array (msg-eng #340 "Advanced Startup"). In the release: `ddcsv4/advstart-array.rc`.
- `dialogs/advstart-sr.rc`: Advanced Startup for sequence machining (msg-eng #340). In the release: `ddcsv4/advstart-sr.rc`.
- `dialogs/advstart.rc`: Advanced Startup (msg-eng #340): start from a specified line or the closest location. In the release: `ddcsv4/advstart.rc`.
- `dialogs/array.rc`: Array machining (msg-eng #341): rows, columns and spacing. In the release: `ddcsv4/array.rc`.
- `dialogs/break-array.rc`: Load breakpoint for an array (msg-eng #256 "Load breakpoint"). In the release: `ddcsv4/break-array.rc`.
- `dialogs/break-sr.rc`: Load breakpoint for sequence machining (msg-eng #256). In the release: `ddcsv4/break-sr.rc`.
- `dialogs/break.rc`: Load breakpoint for a single workpiece (msg-eng #256). In the release: `ddcsv4/break.rc`.
- `dialogs/center.rc`: The center finding dialog (centerx.nc, centery.nc). In the release: `ddcsv4/center.rc`.
- `dialogs/macroMillCylinder.rc`: Milling cylindrical machining (msg-eng #344). In the release: `ddcsv4/macroMillCylinder.rc`.
- `dialogs/macroMillRect.rc`: Milling plane machining (msg-eng #343). In the release: `ddcsv4/macroMillRect.rc`.
- `dialogs/probe-fix.rc`: Fixing probing (msg-eng #172). In the release: `ddcsv4/probe-fix.rc`.
- `dialogs/probe-float.rc`: Floating probing (msg-eng #164). In the release: `ddcsv4/probe-float.rc`.
- `dialogs/probe-h-1.rc`: Tool length measurement, a second form. In the release: `ddcsv4/probe-h-1.rc`.
- `dialogs/probe-h.rc`: Tool length (H) measurement (msg-eng #334). In the release: `ddcsv4/probe-h.rc`.
- `dialogs/probe-vertex.rc`: Vertex probing (msg-eng #182). In the release: `ddcsv4/probe-vertex.rc`.
- `dialogs/selcoord.rc`: Select the work coordinate system. In the release: `ddcsv4/selcoord.rc`.
- `dialogs/simulate.rc`: Simulation (msg-eng #23 "SIMULATION"). In the release: `ddcsv4/simulate.rc`.
- `dialogs/template.rc`: Sequence machining (msg-eng #342): the template table of workpiece positions. In the release: `ddcsv4/template.rc`.

## Library subprograms (by O-number)

`macros/slib.nc`

- O10000: G04 P-1 (a wait)
- O10100: M0
- O10030: the program end (#1802 = 1, M5 M9 M11)
- O10047: M47, empty here
- O8000: return to the pause point
- O8001: Advanced Startup / Load breakpoint (its argument picks the variant)
- O8002: Array machining
- O8003: not described yet
- O9028: behind G28 (O90nn runs G-code nn, the convention of this library)
- O9030: behind G30
- O9053: behind G53
- O9081: behind G81 (drilling)
- O9082: behind G82
- O9073: behind G73
- O9083: behind G83
- O9074: behind G74 (its own comment: left-hand tapping)
- O9084: behind G84 (its own comment: right-hand tapping)

`macros/slib-g.nc`

- O9012: G12 (its own comment)
- O9013: G13 (its own comment)
- O9100: not described yet
- O9102: G102: a clockwise oblique ellipse (its own comment)
- O9103: G103: a counter-clockwise oblique ellipse (its own comment)

`macros/slib-m.nc`

- O10050: M50: a 1 s pulse on output 1
- O10006: M6: the tool change
- O20000: G43 H#17 (internal)

