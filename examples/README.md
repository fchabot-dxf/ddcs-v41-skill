# DDCS V4.1 — examples

> Every measured statement names the bench test that measured it (see evidence.md).

Each file below is a bench probe that RAN on a real controller. Every code line is as it ran; comment lines about the authors' own tools are left out. "Result" is what was read back.

| file | controller | probe | date | result |
|---|---|---|---|---|
| `AUDIT_P1_m0.nc` | DDCS V4.1 | AUDIT_P1_m0 | 2026-10-07 | Macro Mode: the program paused at M0 showing the line with its comment; Start resumed. |
| `AUDIT_V7_labels.nc` | DDCS V4.1 | AUDIT_V7_labels | 2026-10-07 | Macro Mode (#122 = 1): #191=1 #190=0 (forward jump), #192=3 #193=3 (3-pass backward loop), #197=1 #196=0 (two-digit label), #194=5678. |
| `AUDIT_V9_spaced_goto.nc` | DDCS V4.1 | AUDIT_V9_spaced_goto | 2026-10-08 | Macro Mode: the spaced IF branched (#191=1, #190=0) and the negated clamp held (#192=3), #194=5678. |
| `AUDIT_S5d_macro.nc` | DDCS V4.1 | AUDIT_S5d_macro | 2026-10-07 | Macro Mode: WHILE / DO1 / END1 ran 3 passes and exited (#190=3). |
| `AUDIT_R27.nc` | DDCS V4.1 | AUDIT_R27 | 2026-10-08 | Program and dialog in one file: the dialog opened with its own texts; Ok held -> #192=1, #194=5678. |
