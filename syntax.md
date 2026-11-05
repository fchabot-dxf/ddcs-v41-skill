# DDCS V4.1 — syntax

> Every measured statement names the bench test that measured it (see evidence.md).


## Program structure

End a program with: `M30`

Write every line from column 0 (no indentation): a label with a leading space is a syntax error on the DDCS family.

Distance mode: `G90` absolute, `G91` incremental.

Dwell 1.5 s: `G04 P1500` (P is in milliseconds).

Move in machine coordinates (Z to the value in #190):
```gcode
G0 G53 Z#190
```

## Jumps and loops

⛔ **Every jump and loop needs Macro Mode**: parameter #122 "Macro programming mode" = Enable, set by the operator on the Param page (a program must never write it). Without it a jump halts or freezes the controller.

Conditional jump:
```gcode
IF #190<#191GOTO5
GOTO6
N5
N6
```

The spaced form:
```gcode
IF #190 <= 0 GOTO3
```

Loop (three passes):
```gcode
#190=0
WHILE [#190 < 3] DO1
#190=[#190+1]
END1
```

A clamp ("if #190 > 3 then #190 = 3") — never an inline IF .. THEN on this controller:
```gcode
IF #190 <= 3 GOTO4
#190=3
N4
```

Expression functions (declared; the measured ones are in the Math section): FIX: seen in the controller's own macros; FUP: unattested.

## Math

- SQRT[16] = 4, and TAN[45] * 1000 = 999.9999999999999 (degrees) (1 run each). *(ALIAS_MATH (alias matrix))*
- An exact == between computed decimals can miss: #v = 0.3 - 0.2, then IF #v == 0.1 did NOT jump (the double is not exactly 0.1; 1 run). Compare with a tolerance instead. *(ALIAS_DEC_AXES (alias matrix))*
- Precedence is standard: * and / bind before + and -, comparisons last (2 + 3 * 4 = 14; #194-[#197-1]*2 = 479 with #194 = 499 and #197 = 11). *(AUDIT_HW1, AUDIT_MATH1)*
- ⚠ ROUND truncates toward zero, it does not round: ROUND[2.6] = 2, ROUND[-2.6] = -2, ROUND[SIN[30]*1000] = 499 (the double is 499.99999999999994). *(AUDIT_HW1, AUDIT_MATH1)*
- ⚠ FUP always adds 1: FUP[2] = 3, FUP[2.1] = 3. Never use FUP for a ceiling here; write FIX[x] + [x GT FIX[x]] for x >= 0 (a comparison is worth 1 or 0). *(AUDIT_MATH1)*
- FIX truncates toward zero, not down: FIX[-2.5] = -2. *(AUDIT_MATH1)*
- MOD is a function: MOD[7, 3] = 1, MOD[-7, 3] = -1 (the remainder of the integer parts; its sign follows the first). `a MOD b` is not a form. *(AUDIT_MATH1)*
- ⚠ An unknown character is silently dropped: 2 + ^3 evaluates to 5 with no error. A unary minus after an operator works (2 * -4 = -8); a comparison is worth 1 or 0 (1 + 2 EQ 3 = 1). *(AUDIT_MATH1)*
- A whole number past the integer range is clamped: 3000000000 reads 2147483647. *(AUDIT_MATH1)*

- To round to the nearest whole number here, write FIX[x + 0.5] for x >= 0 and FIX[x - 0.5] for x < 0 (FIX truncates toward zero; ROUND truncates too). *(firmware read: FIRMWARE-RE §13b; not a bench test)*
- There is no power operator, no exponent (1E3), no unary plus (+4); functions are upper-case only (AND, OR and XOR are measured: they stop the run mid-way; so does an exponent, 1E3 and 1e2, which is NOT dropped). (The silent drop of an unknown character is measured: AUDIT_MATH1.) *(firmware read: FIRMWARE-RE §13c; not a bench test)*

## Comments

- `( text )` — one comment, never nested: a `(` or `)` inside the text ends or breaks it. Keep both out of comment text.
- A ; comment after code parses (#1505=1   ;text) and the program continues. *(AUDIT_V1_1505_write)*
- A spaced paren comment after code parses (#1505=1 ( text )). *(AUDIT_V2_spaced_1505)*
- A comment that is never closed is NOT refused and does not freeze the controller: it swallows every following line up to the next ")" in the file, or to the end of the file with M30 included, so the code on those lines silently does not run (the code before the "(" on its own line does run). Measured in 2 runs with no later ")" and 1 run closed two lines later. Close every comment on the line that opens it. *(AUDIT COMMENT CASE: unclosed, unclosed_closes_later)*
- Text after the ")" of a comment on the same line is read as code: if it is valid code it RUNS (G0 X0 (note) X5 moved to X5, and (note) G0 X0 ran its G0, bench 2026-10-23); if it is not valid code the run stops mid-way when the parser reaches it (re-run after twelve counted lines, ( note ) zz: those lines ran, "L22[zz]", no freeze; it was first read as a refusal of the WHOLE file at load). Earlier refusals (2026-10-08, 2026-10-15) showed "Unrecognized file format: L<n>[<leftover>"; on 2026-10-23 three refusals of a nested comment showed nothing and left the controller frozen until a restart (power cycle, or Ctrl+Alt+Del: v41-kbd-ctrl-alt-del) (v41-hazard-refused-file-freeze). Treat such a stop as possibly needing a power cycle. A comment ends at its first ")" and nothing but the end of the line is safe after it. *(AUDIT COMMENT CASE: post_x, post_g; BIBLE_SQRT_VALUE; ALIAS_CMT_TRAIL_BAD (alias matrix))*

## Aliases and alternative forms

Each form you might reach for, and what this controller does with it: ✅ works, 🛑 stops mid-run (the run starts, then stops at that line or before it: what had run is in hazards.md), or ⚠️ silently wrong (it runs and computes something else: also in hazards.md). ❔ "not measured" means no bench test has tried it here: do not assume it works.

| | form | on this controller | bench test |
|---|---|---|---|
| Comparison | == (equal) | ✅ **works** | AUDIT_HW1 |
| Comparison | EQ (equal, the word) | ✅ **works** | ALIAS_CMP_WORDS (alias matrix) |
| Comparison | != (not equal) | ✅ **works** | AUDIT_NE_JUMP |
| Comparison | NE (not equal, the word) | ✅ **works** | ALIAS_CMP_WORDS (alias matrix) |
| Comparison | <> (not equal) | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Comparison | < > <= >= | ✅ **works** | AUDIT_HW1 |
| Comparison | LT GT LE GE (the words) | ✅ **works** | ALIAS_CMP_WORDS (alias matrix) |
| Logic | AND / OR / XOR | 🛑 **stops mid-run** | AUDIT_REMATH_AND, AUDIT_REMATH_OR, AUDIT_REMATH_XOR, ALIAS_OLD_AND (alias matrix) |
| Logic | && / \|\| | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Logic | NOT[x] | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Logic | !x (logical not) | ⚠️ **silently wrong** | ALIAS_LOGIC (alias matrix) |
| Math | MOD[a, b] | ✅ **works** | AUDIT_MATH1 |
| Math | a MOD b (as an operator) | 🛑 **stops mid-run** | the alias gaps, 2026-10-30 |
| Math | % (remainder) | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Math | ^ (power) | ⚠️ **silently wrong** | AUDIT_MATH1 |
| Math | POW[a, b] | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Math | ** (power) | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Math | SQRT[x] | ✅ **works** | ALIAS_MATH (alias matrix); BIBLE_DIV_ZERO, BIBLE_MOD_ZERO, BIBLE_SQRT_NEG, BIBLE_SQRT_VALUE |
| Math | SQR[x] | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Math | TAN[x] | ✅ **works** | ALIAS_MATH (alias matrix) |
| Math | ATAN[x] (one argument) | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Math | ATAN[y, x] | ✅ **works** | S5o, S6g |
| Math | ATAN[y]/[x] | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Words | G00 for G0 | ✅ **works** | ALIAS_WORDS, ALIAS_NUM_COORD (alias matrix) |
| Words | G4 for G04 | ✅ **works** | ALIAS_WORDS, ALIAS_NUM_COORD (alias matrix) |
| Words | M03 for M3 | ✅ **works** | ALIAS_WORDS, ALIAS_NUM_COORD (alias matrix) |
| Words | lowercase words (g0 x10) | ✅ **works** | ALIAS_WORDS, ALIAS_NUM_COORD (alias matrix) |
| Words | a space inside a word (G 0, X 10) | ✅ **works** | ALIAS_WORDS, ALIAS_NUM_COORD (alias matrix) |
| Words | a space after # (# 100 = 5) | ✅ **works** | ALIAS_WORDS, ALIAS_NUM_COORD (alias matrix) |
| Words | decimal forms (.5, 5., 5.0) | ✅ **works** | ALIAS_NUM_COORD, ALIAS_NUM_VALUE (alias matrix); ALIAS_DEC_AXES, ALIAS_DEC_ARGS, ALIAS_DWELL_INT / _DOT / _FRAC (alias matrix) |
| Words | leading zeros (X005) | ✅ **works** | ALIAS_NUM_COORD, ALIAS_NUM_VALUE (alias matrix) |
| Words | a leading + (X+5, +.5) | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Words | an exponent (1e2) | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Words | a decimal comma (0,5) | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Words | H1 for H01 | ✅ **works** | the alias gaps, 2026-10-30 |
| Words | G04 P3.0 (a decimal dwell) | ⚠️ **silently wrong** | the alias gaps, 2026-10-30 |
| Jumps | GOTO 5 (a space before the label) | ✅ **works** | the alias gaps, 2026-10-30 |
| Jumps | GO TO (two words) | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |
| Jumps | a leading zero in a label (N010, GOTO010) | ✅ **works** | ALIAS_FLOW (alias matrix) |
| Jumps | M099 for M99 | ⚠️ **silently wrong** | ALIAS_FLOW_M099, ALIAS_FLOW_M099_ARG, ALIAS_FLOW_M099_FREE, ALIAS_FLOW_M99_FREE, ALIAS_DEC_ARGS (alias matrix) |
| Jumps | IF #a <= b GOTOn (spaces between the parts) | ✅ **works** | AUDIT_V9_spaced_goto |
| Jumps | IF … THEN … (inline) | 🛑 **stops mid-run** | AUDIT_V8_then, ALIAS_OLD_THEN (alias matrix) |
| Jumps | an indented N label | 🛑 **stops mid-run** | AUDIT_LABEL_COL0, AUDIT_LABEL_SP1, AUDIT_LABEL_SP1_FAR |
| Comments | ; comment | ✅ **works** | AUDIT_V1_1505_write |
| Comments | ( a ( b ) c ) (a nested comment) | 🛑 **stops mid-run** | AUDIT_R30 (first attempt), ALIAS_CMT_NESTED (alias matrix) |
| Comments | / (block delete) | 🛑 **stops mid-run** | ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix) |

## Measured on this controller

- Every jump needs Macro Mode: with parameter #122 "Macro programming mode" = Enable, IF..GOTO branches; with #122 = Disable the same file halts or freezes at the jump. *(AUDIT_S5c_rerun (at #122=0 and #122=1))*
- In Macro Mode: conditional forward and backward jumps, bare GOTO, two-digit labels and nested GOTO loops all run. *(AUDIT_V4, AUDIT_V5, AUDIT_V7 (#122=1))*
- In Macro Mode WHILE [cond] DOn / ENDn loops run (3 passes, exited); in standard mode the body ran once and ENDn errored. Give every WHILE in one program its OWN DO id (never reuse one): two sequential DO1 blocks ran, then the program never reached its end; see v41-hazard-while-do-reuse. *(AUDIT_S5d_macro)*
- The spaced form IF #a <= b GOTOn runs in Macro Mode. *(AUDIT_V9_spaced_goto)*
- The clamp written as a negated jump, the assignment, then the label (IF #192 <= 3 GOTO4 / #192 = 3 / N4) clamps correctly. *(AUDIT_V9_spaced_goto (re-run))*
- An inline IF .. THEN assignment is not taken: the run stops mid-way when the parser reaches it ("Unrecognized file format: L<n>[IF ... THEN ...]", RESET). Re-run after twelve counted lines, those lines ran; the first run stopped before an earlier FIX line ran, by read-ahead (v41-syntax-partial). *(AUDIT_V8_then, ALIAS_OLD_THEN (alias matrix))*
- IF #a != b GOTOn works in Macro Mode: with #a = 5, IF #a != 4 jumped and IF #a != 5 fell through, and the run reached its end (2 runs). *(AUDIT_NE_JUMP)*
- Start every line at column 0. A label at column 0 is a jump target; the same label with ONE leading space is NOT refused at load: the run starts, then stops with "Unrecognized file format: L<n>[N20]" and the status box goes RESET (2 runs). The stop comes by read-ahead, before the line is reached: 20 counted lines before an indented label, and only 14 had run when it stopped (1 run). *(AUDIT_LABEL_COL0, AUDIT_LABEL_SP1, AUDIT_LABEL_SP1_FAR)*
- The word comparisons EQ, NE, GT, LT, GE and LE all branch in an IF in Macro Mode: with #a = 5, each true case jumped and each false case fell through (IF #a EQ 5, IF #a NE 4, IF #a GT 4, IF #a LT 6, IF #a GE 5, IF #a LE 5; 1 run). *(ALIAS_CMP_WORDS (alias matrix))*
- These forms are not taken: each stopped the run mid-way with "Unrecognized file format: L<n>[<the line>]" and RESET (1 run each): <> (IF #a <> 4), NOT[0], && and ||, SQR[16], ATAN[1] with one argument, the slash form ATAN[y]/[x] (ATAN[1]/[2]), POW[2, 3], 2 ** 3, 7 % 3, GO TO (two words), a / block delete line, a leading + (X+5, +.5, as a coordinate and as a value), an exponent (1e2, and 1E3, X1E1 in capitals) and a decimal comma (0,5). *(ALIAS_CMP_WORDS, ALIAS_LOGIC, ALIAS_MATH, ALIAS_FLOW, ALIAS_BLOCKDEL, ALIAS_NUM_COORD, ALIAS_NUM_VALUE, ALIAS_EXP_UPPER (alias matrix))*
- ⚠ !0 is not a logical NOT: #v = !0 ran to the end and gave 0, with no error (1 run). *(ALIAS_LOGIC (alias matrix))*
- Word spellings that work (1 run each): G00 X9 and G0 X8 both moved (to 9 and 8); G4 P1 and G04 P1 both dwell; M3 and M03 both switch output 1 on (#1651 read 1); lowercase words (g0 x7, x5) work; a space inside a word works (G 0 X6, X 5, # 400 = 5). *(ALIAS_WORDS, ALIAS_NUM_COORD (alias matrix))*
- Number forms that work, as a coordinate (G0 X..., the work X read back) and as a value (#v = ...), each giving the value meant (1 run each): 5, 5., 5.0, 0.5, .5, -.5, -5, leading zeros (005), 5.123456789, #v, and [#1+2]. *(ALIAS_NUM_COORD, ALIAS_NUM_VALUE (alias matrix))*
- 7 MOD 3 (MOD as an operator) is not understood: "Unrecognized file format:L21[#400 = 7 MOD 3]" and a RESET; the parser reached it about 18 lines early, so nothing after that point ran (1 run). Write MOD[7, 3] instead. *(the alias gaps, 2026-10-30)*
- H1 is the same as H01: G43 H1 and G43 H01 both shifted the work Z by exactly -#1561 (with #1560 = 0; 1 run each, the tool table only read). *(the alias gaps, 2026-10-30)*
- G04 P3.0 dwells 3 MILLISECONDS, not 3 s: ten of them ran in 13.6 s, the same as no dwell, while ten G04 P3000 took 43.9 s (1 run each). P is always milliseconds, decimal point or not. *(the alias gaps, 2026-10-30)*
- GOTO 5 (a space before the label) jumps like GOTO5 (1 run each). *(the alias gaps, 2026-10-30)*
- A helical G2 / G3 with Z, in G90, moves Z to the ABSOLUTE value written: six G3 arcs stepping Z down 0.027 each from 1.5 read 1.446, 1.392 and 1.338 after arcs 2, 4 and 6; G2 and G1 with the same end points gave the same Z. Z does not accumulate. No parameter sets I/J or arc-Z modes (Pr110-Pr112 are the chord error, the circular acceleration and the speed factor). *(the helix test, 2026-10-30 (a Fusion GRBL-post pattern))*
- M98 P<n> L3 runs the subprogram 3 times. L0 runs it ONCE, not zero times (1 run each). *(the M98 gaps, 2026-10-30)*
- A repeat count folded into P (M98 P39110 for O9110 three times, the Fanuc form) calls NOTHING: it reads as O39110, which does not exist, and the program runs on with no message (1 run). Use L for the count. *(the M98 gaps, 2026-10-30)*
- Subprograms nest at least 8 deep: calls 4, 5 and 8 deep each entered and returned through every level (1 run each). *(the M98 gaps, 2026-10-30)*
- An O line as the very FIRST line of a file (O0001, the Fanuc program header) ends the program at once: nothing ran, READY, no message (1 run). Never start a file with an O line. *(the M98 gaps, 2026-10-30)*
- A G91 set inside a subprogram does NOT carry back to the caller: after the M99, the main flow's G0 X5 from X17 landed at X5, absolute (1 run). *(the M98 gaps, 2026-10-30)*
- M99 P<n> (return to line N<n> of the caller) is not understood: "Unrecognized file format:L30[M99 P650]" and a RESET when the read-ahead reached it (1 run). Return with a plain M99 and jump with GOTO in the caller. *(the M98 gaps, 2026-10-30)*
- G65 P<n> calls a subprogram exactly like M98 P<n>, letters included: one G65 call with the 16 words X Y Z A B C I J K R H Q D F S T (each a distinct decimal value) returned and left them in the sub as X #1, Y #2, Z #3, A #4, B #5, C #6, I #7, J #8, K #9, R #10, H #12, Q #14, D #15, F #16, S #17, T #18, the same map as M98 (v41-m98-letter-slots; the same call through M98 gave the same map). U5 and E5 alone were accepted and landed in none of #0-#33, as through M98. A DECIMAL value on U, V, W or E stops the run at the call, through G65 and M98 alike: G65 P9130 U21.25 (also V22.25, W23.25, E5.25, U21.25 V22.25) and M98 P9130 U21.25 (also E5.25) each stopped mid-run with Unrecognized file format: L<n>[the call]. Read from firmware: the scanner gives G65 and M98 the same token. *(FIRMWARE-RE (G65 and M98 = token 327); t4024 bench re-run; t4026 alias groups LETTERS_G65_16, LETTERS_M98_16, LETTERS_G65_U / _V / _W / _E / _UV, LETTERS_M98_U / _E, LETTERS_G65_U5 / _E5, LETTERS_M98_U5 / _E5 (2026-11-04/05))*
- WHILE loop numbers are checked against 999 in the firmware (0x000a3ee8), not restricted to DO1..DO3 as on Fanuc. DO4 ran correctly on the bench. DO1000 gave NO error at the WHILE line and the body ran once; the RESET came at the END line with The loop instruction WHILE is incomplete (2026-11-04). The earlier note of Error 11 over bound at the WHILE did not repeat. *(FIRMWARE-RE 0x000a3ee8; bench runs 2026-11-03 and 2026-11-04 (t4024))*
- Combining arc center vectors (I/J/K) and radius (R) on the same G2/G3 line is strictly prohibited: the validator at 0x000d2bf0 checks (I || J) && R for G17, (I || K) && R for G18, and (J || K) && R for G19. Running G17 G2 X10 Y10 I5 J0 R10 F500 faulted instantly in RESET with Error 33 ("G2/G3 programming error") on live hardware. *(FIRMWARE-RE 0x000d2bf0; bench runs 2026-11-03 and 2026-11-04 (t4024))*
- Cutter radius compensation startup (G41/G42) and cancellation (G40) MUST be on linear moves (G0 or G1): the transition validator at 0x000d1b60 checks if motion type > 1. Starting G41 on G2 (G41 D1 G2 X10 Y10 I5 J0 F500) halted immediately in RESET with Error 36 ("G41/G42 creates or cancels segmentation error") on live hardware. *(FIRMWARE-RE 0x000d1b60; bench run 2026-11-03)*
- In Inverse Time Feed mode (G93), every motion block must explicitly specify an F word: in G93 F is strictly non-modal (0x000d1880). Executing G93 followed by G1 X5 without an F word faulted immediately in RESET with Error 38 ("G93 does not have F word") on live hardware. *(FIRMWARE-RE 0x000d1880; bench run 2026-11-03)*
- Subprogram return M99 must be written without a space: the scanner reads unspaced M99 as one token (0x0009cda0). M 99 (with a space) does NOT return to the caller: the line after the call never ran. It does not end the file either: the controller fell through, ran the rest of the subprogram, then the lines after it and M30. Plain M99 returned. *(FIRMWARE-RE 0x0009cda0; bench runs 2026-11-03 and 2026-11-04 (t4024))*
- G10 does not set a work offset here. Measured for L2 and L20: G10 L2 P2 X5.5 ran with no error and left the G55 X slot #1518 unchanged (t4024); G10 L2 P1 X5 and G10 L20 P1 X0 left the G54 X slot #1512 unchanged and MOVED the X axis instead (v41-cam-g10). G10 L10 / L11 (tool offsets), measured (t4026): G10 L10 P1 Z5.5, G10 L11 P1 Z0.25 and G10 L10 P1 R1.5 left H1 (#1561), D1 (#1578), Pr264 (#764) and Pr280 (#780) unchanged and the setting file byte-equal, and their axis word MOVED the axis (work Z to 5.5, then 0.25; G10 L10 P1 X7 moved work X to 7). The firmware-read alternative, writing #1601-#1636 for the work offsets, is not measured (the G54 X slot measured on this bench is #1512); of the tool registers #1561-#1593, only #1561 (H1) was measured as a write that G43 H1 then applied (2026-10-29, with #1560 = 0). *(t4024 bench re-run; the CAM-codes batch, 2026-10-30; t4026 alias group G10_L10_L11 (2026-11-05))*
- Coordinate system rotation G68 (G68 X... Y... R...) and cancellation G69 are SILENT NO-OPS: the controller executes past the block without rotation, moving along unrotated machine axes. Rotate geometry upstream in CAD/CAM before posting, or use polar coordinates G16/G15. *(FIRMWARE-RE; t4024 bench re-run (G68 X30 Y0 R90, then G1 X35 Y0 ended at work X35 Y0))*
- Modulo remainder calculations must use function call syntax MOD[dividend, divisor]: writing Fanuc infix syntax (#1 = 17 MOD 5) triggers Error 7 ("Unrecognized file format"). Function call MOD[17, 5] evaluates correctly to 2.0. *(FIRMWARE-RE; t4024 bench re-run (MOD[17, 5] = 2; 17 MOD 5 stopped with Unrecognized file format))*
- Arctangent calculations must use comma-separated arguments ATAN[Y, X]: writing Fanuc two-bracket quotient syntax (ATAN[Y]/[X]) triggers Error 7 ("Unrecognized file format"). Comma syntax ATAN[1.0, 1.0] evaluates correctly to 45.0 degrees. *(FIRMWARE-RE; t4024 bench re-run (ATAN[1.0, 1.0] = 45; ATAN[1.0]/[1.0] stopped with Unrecognized file format))*
- The ROUND function performs integer truncation (floor toward zero), NOT mathematical rounding to nearest integer: ROUND[10.9] evaluates to 10.0, identically to FIX[10.9]. For true nearest-integer rounding, write #1 = FIX[#2 + 0.5]. *(FIRMWARE-RE; t4024 bench re-run (ROUND[10.9] = 10, ROUND[2.5] = 2, ROUND[-10.9] = -10, FIX[10.9 + 0.5] = 11))*
- Program end M02 does NOT halt execution: unlike M30, M02 is treated by DDCS V4.1 as a complete NO-OP and execution falls right through to subsequent lines (bench 2026-11-03). Always terminate programs with M30, never M02. *(bench run 2026-11-03)*
- Bracketed, indirect, and arithmetic variable addressing #[n], #[#n], and #[#n + 1] are fully supported: #[100] reads #100, #[#100] with #100=101 writes #101=77, and #[#100 + 1] dynamically computes index #101 and assigns 88.0 (bench 2026-11-03). *(bench run 2026-11-03)*
- Exponential EXP[x] and natural logarithm LN[x] functions are ABSENT: programming EXP[1.0] or LN[2.718] aborts execution with "Unrecognized file format: L<n>[...]" and enters RESET (bench 2026-11-03). Compute exponentials or logs upstream in CAD/CAM before posting. *(bench run 2026-11-03)*
- G04 X<n> is accepted and X does not move, but the dwell is NOT in seconds: 6 x G04 X5 took under 14 s and 20 x G04 X1000 under 17 s, against about 40 s for 6 x G04 P5000 (2026-11-04). What unit X is was not measured. Write G04 P in milliseconds. *(bench run 2026-11-04 (t4024))*
- G28.1 reference point set truncates decimal .1 and executes as G28 homing: issuing G28.1 launches an unbounded switch search on physical axes that runs away until manual Reset (bench 2026-11-03). Never emit G28.1. *(bench run 2026-11-03)*
- A macro assignment #[500 + Pr] writes the setting Pr000-Pr999 mid-run: #438 = 112 then #[500 + #438] = 1.25 read back #612 = 1.25 at once, held over a 15 s dwell, and writing the found value back the same way left the setting file byte-equal (t4026). The new value was in sysdisk/setting after the run (index 112 = 1.25); a PC reading the file over SMB during the run still saw the old value (an SMB cache is not ruled out, so when the file changes is not settled; read from firmware: at once, 0x00056c70). ⭐ The dry-run replay (Start after an M0) does NOT repeat it: #[500 + 112] = #612 + 0.25 before an M0, then Start, left Pr112 at 1.25, not 1.5, while a user counter before the same M0 counted 2 (the replay ran). Read from firmware: the dispatcher at 0x00095c64 skips setting writes when [ctx + 0x250] = 0. *(FIRMWARE-RE 0x00056c70, 0x00095c64; t4026 alias groups PARAM_INDIRECT, PARAM_PUT_BACK and a bench script m0param (2026-11-04); setting file copied first, byte-equal after)*
- G84 and G74 run: they are the vendor subprograms O9084 (sets #1999 = 1, right-hand tapping) and O9074 (#1999 = 0) in slib.nc. G84 X0 Y0 Z-5 R2 F100 from X30 went to X0 Y0 (the words are the hole position), fed Z to the bottom and back, and ended at Z = R (2), with no message. Driving a servo spindle needs Pr188 "Spindle interface type" = PUL/DIR and Pr189 "Spindle mapping axis" set; with Pr188 = Analog (as tested) nothing drives one, so the synchronised spindle itself is not measured. *(the tapping test, 2026-10-30 (Pr188 = Analog, Pr189 = A))*
- A linear move of Z with a rotary A (the pattern of a tap with the spindle as an axis) ends exactly together: G1 Z-1 A360 ended at Z-1, A360; five G91 G1 Z-1 A360 steps ended at Z-5, A1800. F600 took about 36 s and F100 about 220 s for the 360 degrees, which reads as degrees per minute along A, so a tap's F = RPM x 360; with Z this short a combined (vector) feed would take the same time, so the two are not told apart (1 run each). *(the tapping test, 2026-10-30)*
- Arcs by radius work: G2 X5 Y-5 R5 (90 degrees) and G2 X5 Y5 R-5 (over 180 degrees, the negative R) each ended on their end point. G18 (XZ) and G19 (YZ) arcs ended on their end points too (1 run each). *(the CAM-codes batch, 2026-10-30)*
- A FULL circle written with R (G2 or G3 X0 Y0 R5 from X0 Y0, start = end) HANGS the controller silently, at execution: everything before it ran (a marker 30 lines earlier and one just before landed), the screen stays on the line before the arc at F 0, AUTO, with no message and the timer counting; the arc never starts (4 of 4 runs, G2 and G3). Recovery is inconsistent: Reset cleared it three times, once only a soft reboot did. The same circle with I / J runs (G2 X0 Y0 I5 J0 came back to 0, 0). Write full circles with I / J, or as two half-circles. *(the CAM-codes batch + the R-circle investigation, 2026-10-30)*
- A near-full arc by R follows the standard rule: from X0 Y0, G2 X0.001 Y0 R5 took the short arc and R-5 the near-full one, both ending at X0.001 Y0; a semicircle G2 X10 Y0 R5 (chord = 2R) runs (1 run each). *(the R-circle investigation, 2026-10-30)*
- An impossible R arc, with the chord longer than 2R (G2 X20 Y0 R5 from X0 Y0), is NOT refused: it ran to X20 Y0 taking the time of an R10 semicircle, so the radius is silently stretched to half the chord (1 run). *(the R-circle investigation, 2026-10-30)*
- G90.1 and G91.1 (the arc-centre modes) are read as G90 and G91: after G91.1, G0 X10 moved incrementally. I / J stay incremental either way, and an arc whose I / J do not match its radius silently did not move (1 run each). *(the CAM-codes batch, 2026-10-30)*
- G92 X0 sets the current position as work zero by WRITING the G54 offset (#1512 changed by 10). G92.1 does NOT cancel it, with no message. G52 X10 sets a local offset (#1548 = 10) and G52 X0 clears it (1 run each). *(the CAM-codes batch, 2026-10-30)*
- G10 L2 P1 X5 and G10 L20 P1 X0 do NOT set the G54 offset: #1512 stayed unchanged and the X word MOVED the axis instead (work X went to 5, then 0), with no message (1 run each). Set work offsets by writing #1512 and up, or with G92. *(the CAM-codes batch, 2026-10-30)*
- G91 G28 X0 and G30 X0 start a homing search on X (BUSY, X counting past +600 and +6500 mm with no switch wired), not a move to a stored point; only Reset stopped it (1 run each). *(the CAM-codes batch, 2026-10-30)*
- Instant software / artificial homing works via #1806-#1808 = 0 (A, #1809, not run with 0): #1806-#1809 are the per-axis (X Y Z A) "search the switch on G28" switches. #1806 = 0 #1807 = 0 #1808 = 0 followed by G91 G28 Z0 and G91 G28 X0 Y0 homed the machine instantly with ZERO physical motion, setting the machine coordinates to reference point 1 (Pr800-Pr802) and changing the DRO mark from a cross to a circle dot (2026-10-31); with #1806 = 1, G91 G28 X0 searched for the switch instead (2026-10-15, 2026-10-31; see v41-home-flags). Separately, the machine position can be written: #1500 = #1500 + 1.5 read back 36.5 for 35 (t4024), and #1501, #1502, #1503 (Y, Z, A) and #1504, #1505 each took found + 1.5 and read it back (t4026); the work position moved with it (#1507, #1508, #1509 each +1.5, the offset unchanged), but the Mach and Abs columns of the DRO did NOT change during a 12 s hold after the writes. Each was written back to its found value. Whether G53 follows is not measured (the bench is not homed, and G53 is refused unhomed). *(the home-flag test, 2026-10-15 and 2026-10-31 (FINDINGS: THE HOMED MARK; #1806-#1809 ARE PER-AXIS); t4024 bench re-run (#1500); t4026 alias group MACH_1501_1505 (2026-11-05); FIRMWARE-RE 0x00095dfc)*
- Accepted, ending on the programmed point: G41 D1 and G42 D1 round a square, then G40 (how far the path shifts was not measured); G61 and G64; M7, M8 and M9; M3 S1000.5 (a decimal S); M4. G93 inverse time is honoured: G93 G1 X5 F6 took about 10 s, where F6 mm/min would take 50 s (1 run each). *(the CAM-codes batch, 2026-10-30)*
- M1 (optional stop) does NOT stop, and no parameter in the list turns it on (1 run). *(the CAM-codes batch, 2026-10-30)*
- Loops that work (1 run each): WHILE nested 3 deep (DO1 / DO2 / DO3) counted 8; a backward-GOTO counter loop ran 100 times; WHILE [#a GT b] with a word condition; an indirect write and read #[#438]. A GOTO into the middle of a WHILE runs on from there (the counter read 3). *(the CAM-codes batch, 2026-10-30)*
- A GOTO out of an unfinished WHILE, followed later by a fresh DO1, HANGS the program silently (AUTO at line 3), the same hang as reusing a DO id (1 run). *(the CAM-codes batch, 2026-10-30)*
- ABS and FUP work. LN, EXP, ASIN and ACOS each stop the run ("Unrecognized file format", 1 run each). #0 reads 0: #0 + 5 = 5, and IF [#0 EQ 0] is taken (it is not "vacant"). *(the CAM-codes batch, 2026-10-30)*
- Surface mapping built-ins RecordCoords[id, x, y, z, a] and ClearCoords[id] are FUNCTION EXPRESSIONS, not bare statements (0x000a4cac / 0x000a4ef8). Assigned to a variable, RecordCoords returned 1.0 and wrote cncdisk ProbeMap<id>.txt with CRLF lines of the four values to 4 decimals (12.3456,23.4567,34.5678,45.6789); ClearCoords deleted the file, but its return value was NOT 1.0 (it returned an old value, 45.678894), so do not test its result. A bare ClearCoords[99] with no assignment is refused (Unrecognized file format). *(FIRMWARE-RE 0x000a4cac, 0x000a4ef8; bench runs 2026-11-03 and 2026-11-04 (t4024))*
- Boolean relational expressions inside brackets evaluate directly to IEEE double 1.0 (true) and 0.0 (false) in variable assignments and arithmetic: #461 = [#100 > 5.0] gave 1.0, #462 = [#100 < 5.0] gave 0.0, and algebraic composition works cleanly: #464 = [#100 > 5.0] * 50 + [#100 < 5.0] * 20 evaluates to 50.0. *(byacc parser Rule 60 (0x000a49bc); bench run 2026-11-03)*
- A leading plus sign is rejected, on an axis word and on a value: G0 X+5 and #400 = +5 each stopped the run with "Unrecognized file format: L<n>[G0 X+5]" (and [#400 = +5]) and RESET. It is not refused at load: the run starts, the lines before it may run, and it stops when the controller reads ahead to that line (the alias matrix of 2026-10-29 measured the same for X+.5 and +.5). Write numbers unsigned or with a leading minus (X-15.0 or X15.0). *(flex scanner Rule 14; the alias matrix 2026-10-29 (NUM_COORD, NUM_VALUE); t4026 alias groups PLUS_AXIS, PLUS_VALUE (2026-11-05))*
- Drill cycles take ABSOLUTE X / Y in G90: G90 G98 G81 X10 Y5 Z-2 R1 F100 from X30 Y0 Z20 drilled at X10 Y5 (not X40) and ended at Z20 (G98, the start level); with G99 it ended at R (Z1). G82 P500, G83 Q0.5 and G73 Q0.5 ran and ended the same way; G82's P is in MILLISECONDS (P10000 added about 12 s, P0 and P1000 were within the noise). The cycle is modal: a following X15 Y5 line drilled a second hole; after G80, X20 only moved (1 run each). *(the drill-cycle test, 2026-10-30)*
- A repeat count on a drill cycle repeats the INCREMENT, even in G90: G81 X10 Y5 … L3 from X30 Y0 drilled 3 holes, each 20 left and 5 up from the last, ending at X-30 Y15 (the vendor cycle moves G91 by the difference, L times). K3 was ignored: one hole (1 run each). *(the drill-cycle test, 2026-10-30)*
- Canned drill cycles dispatch to macro subprograms Sub ID = 9000 + G in sysdisk/slib.nc (G81 -> O9081, G84 -> O9084, G73 -> O9073). Rigid tapping writes #1999 for the servo spindle direction: with #1999 set to 0 first, G84 X0 Y0 Z-5 R2 F100 left #1999 = 1; with it set to 1, G74 left 0 (the vendor O9084 / O9074 write it as their first line). Cycles G85-G89 have no subprogram in the bench slib.nc and pass as a silent NO-OP: G90 G98 G85 (and G86, G87, G88, G89) X10 Y5 Z-2 R1 P100 F100 from X30 Y0 Z20 left the work position at X30 Y0 Z20, with no message, and the program ran on to its end. Read from firmware: the lookup returns nothing and the executor returns 0 (0x000938a8), so an O9085 appended to slib.nc would be called (not measured). *(AUDIT_CANNED_G85_SILENT_NOOP, TAP_G84, TAP_G74, bench runs (2026-11-02); t4026 alias groups CYC_G85 to CYC_G89, TAP_1999 (2026-11-05); FIRMWARE-RE 0x000da510)*
- A repeat count L on a canned drill cycle (G81, G82, G83, G73) repeats the INCREMENTAL DELTA even under G90: G90 G98 G81 X10 Y5 Z-2 R1 L3 from X30 Y0 does not drill at X10 Y5 three times; it steps by the initial delta (-20, +5) across each pass, drilling at (10, 5), (-10, 10), and ending at (-30, 15), because vendor O9081 wraps WHILE #13 > 0 DO13 -> G91 G00 X#0 Y#1. On a live machine, using L > 1 under G90 can crash into fixtures or clamps. Never use L > 1 under G90; program each hole coordinate explicitly. *(AUDIT_CANNED_L_REPEAT, bench run (2026-11-02); FIRMWARE-RE 0x000da56c)*
- A G1 before any F ran at Pr102 (3000 mm/min here). M3 with no S runs at Pr191, the default spindle speed (24000 here, with Pr190 "Spindle speed selection" = G code). M3 S0 shows S 0. M3 S99999 shows S 99999: it is NOT clamped to Pr192, the maximum spindle speed (1 run each). *(the feed / speed test, 2026-10-30)*
- F0 is not refused: G1 X10 F0 crawled at about 1-2 mm/min and never finished (F showed 0), until a Reset (1 run). *(the feed / speed test, 2026-10-30)*
- An N number on a code line (N10 G0 X1) runs the line AND makes it a GOTO target. With a duplicate N, GOTO lands on the FIRST one, with no message (1 run each). *(the CAM-file test, 2026-10-30)*
- Several words on one line (1 run each): with two G words of the same group the LAST wins (G0 G1 X10 F60 fed, G1 G0 X10 F60 rapided); M3 M8 S1000 switched both on; an M word before a move (M5 G0 X5) still moved; a 248-character line ran; a coordinate with 10 decimals (X5.1234567891) kept them all. *(the CAM-file test, 2026-10-30)*
- A G31 that never touches is NOT an error: G91 G31 Z-10 F100 with nothing wired travelled the full 10 mm and the program went on, with no alarm. Two G31 moves inside a WHILE both ran to their end, so a probing loop with no contact carries on as if each one touched (1 run each). The vendor form G91 G31 Z-10 L1 Q1 K0 F100 stopped after 0.004 mm instead, as if touched at once (with the unwired input reading High). *(the probe / soft-limit test, 2026-10-31)*
- No variable tells a program that G31 touched: right after a G31 that never touched and one that touched at once, 193 candidates were compared (#1500-#1530, the input word and inputs #1683-#1713, #1800-#1830, #1900-#1999) and only the position differed (#1502 machine Z, #1508 work Z); the vendor probe macros read nothing after their G31 either. So check by POSITION: G31 toward a known target and compare #1502 or #1508 with it (still at the target = no touch), or read the probe input itself. L selects the trigger: L1 stopped at once with the unwired input reading High (L1, L1 Q0 K0, L1 Q1 K1), while Q1, K0, L0, L0 Q1 K0, L2, L3 and a plain G31 ran the full distance; Q and K changed nothing here. Which input L reads is not separated (every input read 1). *(the probe-flag test, 2026-10-31)*
- Opening the Advanced Startup dialog from a program (M98 P8001 X0) does NOT start the job from a line: the dialog opened with Closest Location selected and Specified line pre-filled from #497; with Specified line chosen (the Up key) and Ok held, the CALLING program simply went on (2 runs), and the next Start ran the file from line 1. Starting from a line is the panel menu's route only (see v41-panel-start-from-line). *(the operation test, 2026-10-31)*
- G95 (feed per revolution) is ACCEPTED AND IGNORED: G95 G1 X35 F1 moved at F1 mm per minute (0.69 mm in about 41 s, spindle at S 0), while G94 G1 X130 F600 took about 10 s. Feed is per minute whatever is written. *(the basics run, 2026-11-01)*
- A % on the first and last line, or on the first line only, is accepted. A file with no M30 ends at its last line and the controller is READY. Code after an M30 does not run. *(the basics run, 2026-11-01)*
- G65 P9120 A5 B6 is accepted and RUNS the sub in the same file, as M98 does; the letters did not land in #1 and #2 (the sub read #1 = #2 = 0). G66 P9120 A5 B6 ... G67 is accepted but calls NO sub (no move came after it): there is no modal macro call. *(the Fanuc habits run, 2026-11-01)*
- Expressions with 10 and with 30 nested brackets evaluate correctly: no limit was found up to 30. 7 / 2 = 3.5 (no integer division), FIX[7 / 2] = 3, 1 / 3 * 3 = 1, and a variable holding 3.0 as a WHILE counter ran 3 times. *(the Fanuc habits run, 2026-11-01)*
- FIX[2.9] = 2, FIX[-2.9] = -2, FUP[2.1] = 3, ROUND[2.5] = 2 (not 3). SIN and COS take degrees and carry float noise (SIN[30] * 100 = 49.99999999999999, COS[60] * 100 = 50.000000000000014). BIN[10] and BCD[10] STOP the run. *(the Fanuc habits run, 2026-11-01)*
- A program CANNOT start a Sequence or an Array run. MarcoDialog "template.rc" from a program opens the Sequence dialog with an EMPTY table (from the panel it lists the template rows); Ok held 1.5 s closes it and the calling program simply carries on to its M30 once: no run, no restart. #496 = -3 then M98 P8002 (the vendor start routine in slib.nc) did the same, and left #499 = 1 with nothing re-calling the program within 25 s. Array (#496 = -2, array.rc through O8002): Ok let the caller run on, then the bench went to RESET with no message (F3 cleared it). A Sequence run starts only through the panel route, which loads the template rows first (1 run each). *(the dialog-runs test, 2026-11-01)*
- G41 D1 reads the tool table's D1 (#1577 = 0 selects diameter here, D1 = 1, so a radius of 0.5); the position read just after the G41 block showed no shift on that first block. A G40 placed after non-motion lines (a dwell or variable reads) STOPS the run: "G41/G42 creates or cancels segmentation error" and a RESET (1 run). *(the leftovers test, 2026-10-31)*
- G68 (rotation) and G51 (scaling) are silently IGNORED: after each, X10 Y0 still went to X10 Y0, with no message. G16 polar coordinates work (G0 X10 Y90 went to X0 Y10) and G15 cancels them (1 run each). *(the leftovers test, 2026-10-31)*
- Decimals (1 run each). There is no "calculator" scaling: an integer word means the same as its decimal twin. X5 = X5.0 and Z5 = Z5.0 (5 mm), and the M98 words I5 = I5.0, R5 = R5., F100 = F100. and S12000 = S12000. read 5, 5, 100 and 12000 in the subprogram. Precision is kept: X5.1234567 read back 5.1234567; X0.0004, X0.0005 and X0.0006 each landed at its own value (no rounding to 0.001); #v = 1/3 is the full double; X-0 is 0. G04 P1000. dwells like G04 P1000, and G04 P4.5 is 4.5 ms, not seconds. *(ALIAS_DEC_AXES, ALIAS_DEC_ARGS, ALIAS_DWELL_INT / _DOT / _FRAC (alias matrix))*
- A leading zero in a label works both ways: GOTO604 reached a label written N0604, and GOTO0607 reached N607 (1 run each). *(ALIAS_FLOW (alias matrix))*
- M099 is not M99: an in-file subprogram ending in M099 ran (its marker set) and then ENDED the program, READY, with no message, and the line after the M98 never ran (6 runs). The same subprogram ending in M99 returned (2 runs, and 11 returns in another run). *(ALIAS_FLOW_M099, ALIAS_FLOW_M099_ARG, ALIAS_FLOW_M099_FREE, ALIAS_FLOW_M99_FREE, ALIAS_DEC_ARGS (alias matrix))*
- FIX[] works and truncates: FIX[7 / 2] = 3, FIX[7.9] = 7. *(AUDIT_V8b_fix, AUDIT_HW1)*
- In a user program (Macro Mode): indirect #[190+#191] = 77 works; == >= <= > < all work (and so does !=, measured on its own: AUDIT_NE_JUMP); a bare GOTO jumps; ABS[0-4] + FIX[7.9] = 11. *(AUDIT_HW1)*
- Trailing garbage after a valid expression stops the run mid-way when the parser reaches it ("Unrecognized file format: L<n>"); it is not truncated. Re-run after twelve counted lines (#v = #191k8), those lines ran. *(S6a, S6b, S6c, ALIAS_OLD_TRAIL (alias matrix))*
- A misspelled value on a real axis word (G0 Xwidht) stops the run at its own line; re-run after twelve counted lines, those lines ran. *(S6d, ALIAS_OLD_XWIDHT (alias matrix))*
- An unclosed [ stops the run mid-way (re-run after twelve counted lines: they ran), and the error names the line AFTER the one holding the [, not the last line of the file: a bad line 7 is reported as line 8 with M30 on line 9. *(S6f (L19 -> L20), AUDIT_REMATH_S6F (L7 -> L8, corrected 2026-10-15), ALIAS_OLD_UNCLOSED (alias matrix))*
- AND, OR and XOR do not exist on this controller: each stops the run mid-way (the screen reads Unrecognized file format on its line, for example L7[#175 = 1 AND 1]); AND re-run after twelve counted lines, those lines ran. *(AUDIT_REMATH_AND, AUDIT_REMATH_OR, AUDIT_REMATH_XOR, ALIAS_OLD_AND (alias matrix))*
- ATAN[y, x] (comma form) works and returns DEGREES; the first argument is y: ATAN[1, 2] * 100 = 2656.505. *(S5o, S6g)*
- G04 P is in MILLISECONDS: P45000 dwelled about 45 s. *(inbound dwell test (P45000))*
- The words of an M98 call land in the sub as local slots: X #1, Y #2, Z #3, A #4, B #5, C #6, I #7, J #8, K #9, R #10, H #12, Q #14, D #15, F #16, S #17, T #18. U, V, W and E land in none of #0-#33, and #0, #11 and #13 are unused. Every one of these letters is accepted alone with a whole value (U5, E5), but U, V, W or E with a DECIMAL value stops the run at the call (M98 P9130 U21.25 and E5.25, 2026-11-05; G65 the same), and any two of U, V, W on one call STOP THE RUN at it (U V, U W, V W, U V W; each alone with a whole value is fine), so the eight words I J K Q R U V W stop it too. The call is not refused at load: the run starts, then stops mid-run when the controller reads ahead to that line (some writes before it may have run, the moves near it do not: v41-syntax-partial); a call with all fourteen words I J K Q R U V W F S T H D E stopped the run and the V4.1 then ignored every key until a power cycle (the eight-word and the U V W stops left the keys alive), so keep a call to a few words. *(BIBLE_M98_AXES, BIBLE_M98_I_MAP, BIBLE_M98_POS_J to _T and _U _V _W _E _H _D, BIBLE_M98_MAP_ALL, BIBLE_M98_LETTERS, BIBLE_M98_COMBO_UV _UW _VW _UVW; t4026 LETTERS_M98_16, LETTERS_M98_U / _E, LETTERS_M98_U5 / _E5)*
- M99 at the top level of a program, outside any subprogram, ends the program silently; it does not restart it. *(BIBLE_M99_MAIN)*
- START FROM LINE: a program can open the vendor's "Advanced Startup" dialog with M98 P8001 and no panel key (slib.nc O8001; with no argument it opens advstart.rc). The dialog offers Startup method Specified line (selected) or Closest Location; the "Specified line" field is the persistent #497 and is PRE-FILLED from #497: write #497 = N, then M98 P8001 X0, and the dialog shows Specified line 0000000N (#497 = 12 showed 00000012). The dialog's own text says Closest Location needs the XY soft limits enabled and the tool over an already machined area. ALWAYS pass X on this call (a bare M98 P8001 reuses the stale #1 of the previous call: locals are not cleared between calls). THE ARGUMENT FORM picks the variant (X lands in the sub as #1): M98 P8001 X0 = the PLAIN "Advanced Startup" (single workpiece) with the line from #497; X505 = "Advanced Startup" for Array machining (Current machining: Array machining, the array parameters, Specified line / Closest, "Array positioning: Rows, Cols"); X342 = "Advanced Startup" for Sequence machining (the template table, Specified line / Closest, "Sequential positioning"); X585 = "Load breakpoint" for a Single workpiece (Program mode Axis, Line No.; Startup method Specified line / Closest Location / BREAKPOINT (a third option)); X586 = "Load breakpoint" for an Array ("workpiece located: Row, Col"); X587 = "Load breakpoint" for a Sequence ("workpiece serial No", the table). The operator must make a LONG press of Ok (the panel's Z- / ENTER key, about 1 s) to continue; Cancel (Esc) ENDS the calling program: the line after the M98 never ran and the status read READY. What the controller's own breakpoints are is from the vendor manual, not a run (un-v41-breakpoints). *(AUDIT_ADVSTART_MACRO (M98 P8001 then M30, dongle), AUDIT_PREFILL497_X0 (#497 = 12 then M98 P8001 X0), AUDIT_MENU_ARG_ADVSTART_ARRAY, _ADVSTART_SEQ, AUDIT_MENU_ARG_BREAK_SINGLE, _ARRAY, _SEQ (X505, X342, X585, X586, X587))*
- None of these stops the program: 1 / 0 returns 0, MOD[7, 0] returns 0, and SQRT of a negative number returns NaN (it reads back as nan and every comparison against it, == 0, > 0 and < 0, is false). Test a divisor or a root argument yourself before the line. *(BIBLE_DIV_ZERO, BIBLE_MOD_ZERO, BIBLE_SQRT_NEG, BIBLE_SQRT_VALUE)*
- G92 writes the work-offset table of the SELECTED frame only: with G54, G55 or G59 selected, G92 X[<current work X> + 5] changed only that frame's X slot (#1512, #1518 or #1542) by exactly 5, and none of the other 20 X Y Z slots in #1512-#1550. G92 X[<current work X>] alone undid it. *(AUDIT_G92WCS (PASS 15/15))*
- A G52 local shift does NOT survive into the next job on the V4.1: after a program set G52 X5 Y0, a Reset during its dwell, and after the same program ending on its own M30, the NEXT job moved to work X0 Y0 landed at machine X = the G54 X slot (#1500 minus #1512 read 0), 4 runs of 4. Inside one program the same G52 X5 Y0 then G0 X0 Y0 reads 5, so the 0 is a real cleared shift. G52 X5 Y0 also lands the X word in #1548 (read back 5 right after it). Still write G52 X0 Y0 at the start and at the end of a repeat as a precaution (it costs nothing); it is not load-bearing on this firmware. [TO TEST] a power cycle after a Reset, and the Expert (the V4.1 result does not carry over). *(AUDIT_G52_P1_LEAVE / P2_READ / P3_RESTORE / CTRL; t3957)*

## Loops, pausing, and updating variables mid-run

- M47 = repeat the program from its first line, variables carried over: #237 = #237 + 1 / G04 P2000 / IF #237 >= 3 GOTO1 / M47 / N1 / M30 ran 3 passes in 6 s and ended with #237 = 3 (Macro Mode). *(the M47 counter loop (#237))*
- M47 (repeat from the first line) RE-READS the program file from disk at every loop, with a ONE-LOOP LAG: a file replaced during loop k (a temp file renamed over it) first runs in loop k+2, because the next loop already runs the copy read at the start of the current one. Measured with a loop of three sections and a replacement every 1.0 or 2.5 s: the loops logged the header value written one loop earlier, not the newest one (3 runs). The rename keeps the running pass on its own copy (v41-net-overwrite-rename). *(AUDIT_M47FEED, 3 runs; t3943)*
- End an M47 loop with a GOTO that jumps to an M30 placed BEFORE the M47 line (IF #N > 3 GOTO98 ... N98 M30 ... N99 M47): the loop ended cleanly, 2 of 2 (the status box READY, no Reset, no post-end pass). An M02 in the same place did NOT stop it at once: it spun on (about 50 loops in a few seconds without the dwell) and stopped by itself about 11 s in, cause unknown. Use M30. *(AUDIT_M47FEED (M30 twice, M02 once); t3943)*
- RECIPE, feeding a value into a running program: put the values in header assignment lines of the job file (#V = <value>) and let a PC replace the file (write a temp file, rename it over the job) while the program runs; run it as an M47 loop with a RAM counter that dispatches the work by IF / GOTO (Macro Mode #122 on); put one EMPTY loop between the work loops (the odd loops only re-read the header and go to the M47 line), so that a value written during work loop k is the one work loop k+1 uses (3 of 3 sections, 2 runs; an empty loop costs well under a second); end with a GOTO to an M30 before the M47 line. Results come out through uservar after the end or at a dwell (v41-var-no-write-during-motion), and the way IN is only the file (v41-var-inbound-sealed). *(AUDIT_M47EMPTY, 2 runs; t3943, t3945)*
- HOW M0 + START (AND PAUSE + START) WORK (LINE-1 DRY-RUN REPLAY): pressing Start to resume from an M0 — or after pressing the Pause key (F2) — re-opens the .nc file on disk at line 1 and runs a fast-forward DRY-RUN pass (motors OFF) from line 1 down to the paused line, then turns physical motor motion ON only for the lines AFTER that stop. During that line-1-to-pause dry-run pass, G0 / G1 moves, G04 dwells (G04 P6000 before M0 skipped in ~0 s), and MarcoDialog calls before the stop are skipped without blocking or moving the motors, whereas variable assignments (#k = ...) and IF / GOTO branches execute for real in RAM (but not a parameter write: #[500 + 112] = #612 + 0.25 before an M0 left Pr112 at 1.25, not 1.5, across the replay, t4026 / v41-syntax-param-live-tune) — so an unguarded #k = #k + 1 placed before M0 or a Pause stop increments TWICE across one pause-and-resume (1 on the initial run, 2 on the Start replay), and #1500 reports the simulated dry-run coordinate while the physical axis on the DRO does not move. Multiple sequential M0 stops in a plain top-to-bottom straight-line program (N10 G91 G1 X1 ... M0, then N20 G91 G1 X2 ... M0, then N30 G91 G1 X4 ... M30) move the full physical distance (+1.0 -> +3.0 -> +7.0 mm on Mach X), because each Start dry-runs the already-cut blocks above the active M0 and enables motor motion after it. ⛔ THE LOOP TRAP (WHY M0 AND PAUSE+START FAIL IN BOTH PRE-INCREMENT AND POST-INCREMENT LOOPS): (1) if an IF / GOTO or M47 loop increments its pass counter before M0 (or before pressing Pause), pressing Start at pass 1's M0 (10:M0) or Pause stop (11:G04) replays from line 1, increments the counter to 2, and branches into N20 WHILE STILL IN DRY-RUN MODE (motors OFF) — stopping at N20's 16:M0 with #1500 simulated at +2.0 mm while physical Mach X on the DRO stays frozen at pass 1's +1.000 mm (or after a Pause key + Start in pass 1, skipping pass 2's +2.0 mm physical move and moving only pass 3's +4.0 mm for +5.0 mm total instead of +7.0 mm); (2) even if the counter is incremented AFTER M0 and loops back via GOTO, resuming from pass 2's M0 dry-runs from line 1 directly into branch N20 (because the counter in RAM is already 1) and pause.nc's return resets Mach X back to pass 1's coordinate (+1.000 mm instead of +7.000 mm). Never use M0 (or Pause + Start without an init/resume guard) inside any M47, WHILE, or IF / GOTO loop to pause between passes; place M0 only at the single exit label (N98) right before M30 if a final stop is needed. *(AUDIT_M0_REPLAY (situations 1-4, top-vs-bottom, straight-line Case A, falsification Exps 1-7, Edge Case 3 Pause+Start), a bench script, a bench script, a bench script, a bench script, a bench script, a bench script)*
- M47 LOOP QUIRKS: (1) M47 re-reads the .nc file from disk on every cycle even in a G04-only program with no G0 / G1 motion (#473 updated from 111 to 222). (2) A 1-bit RAM toggle (#477) at the top of the file that runs an empty pass (#477 = 1 - #477 / IF #477 == 0 GOTO99) between work passes absorbs the 1-loop prefetch lag so every work pass k+1 runs the file renamed into place during work pass k (#483 = 111, #484 = 222, #485 = 333, physical Mach X delta +7.000 mm). (3) While a tight M47 loop with no dwell keeps uservar frozen on disk until M30, placing a G04 dwell (measured with both G04 P6000 and G04 P2000) inside each M47 pass flushes uservar to disk on EVERY pass (#471 = 1.0, 2.0, 3.0, 4.0 and dX = 1.0, 2.0, 3.0, 4.0 read back via shutil.copy2 every 2.0 s during a 4-pass G04 P2000 loop). (4) Always read #1500 after the pass's last motion before incrementing the pass counter or dwelling so look-ahead cannot flush the new count before motion finishes (v41-var-no-write-during-motion). (5) Because #100-#499 persist across M30 and new Start runs, always reset the pass counter, the empty-pass toggle, and any one-time init guard (#471 = 0, #476 = 0, #477 = 0) at the N98 exit block before M30. *(AUDIT_M47_QUIRKS (G04-only reread, 6 s and 2 s dwell flushes, Case C empty-pass toggle), a bench script, a bench script)*
- PAUSING AND UPDATING VARIABLES INSIDE AN M47 OR WHILE LOOP (METHOD 1 — BLOCKING .rc MarcoDialog): calling MarcoDialog "/local/<file>.rc" (with FRAMEWIN last field 1, a normal blocking dialog) at the end of each pass inside an M47 or WHILE / DO1 / END1 loop pauses indefinitely with ZERO Z-lift (unlike M0's +5 mm pause.nc lift), flushes uservar to disk continuously while open, and when closed with a 1.2-1.5 s Ok (Enter) hold continues normal execution into M47 or END1 with NO line-1 dry-run replay and 100% real physical motor motion (in M47: 2 back-to-back runs of 3 passes +1.0, +2.0, +4.0 mm each moved physical Mach X by +7.000 mm with #483 = 111, #484 = 222, #485 = 333; in WHILE [#471 < 3] DO1 ... END1: 3 passes of +2.0 mm moved physical Mach X by +6.000 mm). ⛔ Put G04 P1500 on the line immediately after MarcoDialog (before GOTO99 / M47 or END1): the dialog closes at ~1.0 s of the 1.2-1.5 s Enter hold, and without G04 P1500 the remaining 0.2-0.5 s of the held Enter key carries into the next pass's dialog or M30. Three ways to update variables or files during this dialog pause: (a) FROM THE PANEL OR USB KEYBOARD (ZERO LAG, MEASURED): any EDIT (#<min>max*width^k float wheel or &<min>max*width^k integer wheel), RADIO (0-based index), CHECKBOX (0 or 1), or DROPDOWN (0-based index) widget in the .rc dialog writes its bound #variable (the 10th field of CreateIndirect) directly into RAM the instant Ok is held, so the very next line after MarcoDialog sees the new value (measured with an EDIT wheel bound to #150 dialed to 2, 4, and 5 across 3 M47 passes: G91 G01 X#150 F1200 moved physical Mach X by +2.0, +6.0, and +11.0 mm cumulative); (b) FROM A PC OVER SMB (.nc FILE SWAP): while paused at MarcoDialog, read uservar via shutil.copy2, write a temp .nc file with updated header assignments or coordinates and atomically rename it over the running .nc file, then send a 1.2-1.5 s Enter hold — with the #477 empty-pass toggle at the top of the loop, the next work pass runs the new .nc file; (c) DYNAMIC DIALOG TEXT OR BMP (ZERO LAG FOR EXTERNAL .rc FILES, MEASURED): MarcoDialog re-reads an external .rc file from disk at the MarcoDialog line itself and resolves #<var> / &<var> live from RAM — atomically swapping /local/<dlg>.rc while paused at Pass 1's dialog immediately rendered the new title and text on Pass 2 with 0-loop lag and no #477 empty pass needed. *(AUDIT_M47_DIALOG (3-pass MarcoDialog + G04 P1500 + .nc swap, 2 back-to-back runs; live EDIT #150 wheel in M47 loop; WHILE DO1/END1 loop; external .rc swap 0-loop lag), a bench script, a bench script)*

```gcode
#470 = 111.0
IF #476 == 1 GOTO5
#471 = 0
#476 = 1
#477 = 0
N5
#477 = 1 - #477
IF #477 == 0 GOTO99
#471 = #471 + 1
IF #471 == 1 GOTO10
IF #471 == 2 GOTO20
IF #471 == 3 GOTO30
GOTO98
N10
G91 G01 X1.0 F300
G90
#483 = #470
#480 = #1500
MarcoDialog "/local/loop_pause.rc"
G04 P1500
GOTO99
N20
G91 G01 X2.0 F300
G90
#484 = #470
#481 = #1500
MarcoDialog "/local/loop_pause.rc"
G04 P1500
GOTO99
N30
G91 G01 X4.0 F300
G90
#485 = #470
#482 = #1500
MarcoDialog "/local/loop_pause.rc"
G04 P1500
GOTO98
N98
#471 = 0
#476 = 0
#477 = 0
M30
N99
M47
```

- PAUSING AND SWAPPING FILES BETWEEN PASSES WITHOUT M47 (METHOD 2 — M30 PER PASS + EXTERNAL START): when an operator or USB keyboard device sends a Start tap between passes, end each IF / GOTO branch (N10, N20, N30) with its own M30 instead of M0 or M47. Reaching M30 ends the pass cleanly with ZERO Z-lift and flushes uservar to disk immediately, while #100-#499 (including the pass counter #471) persist in RAM across M30 and across the next Start (v41-fanuc-variable-lifetime). While the controller sits in CONT / READY between passes, read uservar FIRST (before renaming the file, so the post-run fast pass ~22 s after M30 cannot overwrite uservar with the new file's header assignments: v41-var-after-run-reread), atomically rename the updated .nc file into place on cncdisk, and send a single Start tap (numpad Enter with NumLock ON): the next pass runs fresh from line 1 with 100% real physical motor motion, zero dry-run replay, and zero 1-loop prefetch lag (3 passes moved physical Mach X by +7.000 mm; #483 = 111, #484 = 222, #485 = 333). If M0's +5 mm Z-lift (pause.nc) is wanted at the end of each pass, place M0 followed immediately by M30 at the end of each branch and send two Start taps per pass (the first resumes from M0 into M30 and lowers Z back; the second starts the next pass from line 1). *(AUDIT_M30_PASS (3-pass M30 + .nc swap + Start) (Case B))*

```gcode
#470 = 111.0
#471 = #471 + 1
IF #471 == 1 GOTO10
IF #471 == 2 GOTO20
IF #471 == 3 GOTO30
GOTO98
N10
G91 G01 X1.0 F300
G90
#483 = #470
#480 = #1500
M30
N20
G91 G01 X2.0 F300
G90
#484 = #470
#481 = #1500
M30
N30
G91 G01 X4.0 F300
G90
#485 = #470
#482 = #1500
#471 = 0
M30
N98
#471 = 0
M30
```

## Measured recipe: a subprogram in your own file

A subprogram in your own file sits BEFORE M30 and the main flow jumps over it; M98 P<number> then runs it and returns. ⛔ Reaching an O line in the flow ENDS the program there, with no error; a subprogram after M30 is not found, with no error. M98 P20000 reaches the vendor library and returns. *(AUDIT_HW1, AUDIT_HW2)*
```gcode
#190 = 0
M98 P9002
GOTO10
O9002
#190 = #190 + 1
M99
N10
M30
```

## Writing by hand: forms the controller's own macros use

These lines are from the macros the controller ships with. They show a FORM the parser takes; they were not run as bench tests.

⛔ The vendor's macros run as the firmware's own code. In a program you write, every jump and loop still needs Macro Mode (#122 = Enable) *(AUDIT_S5c_rerun (at #122=0 and #122=1))*.

- The vendor passes ARGUMENT WORDS to a library subprogram: M98P#1802+1X#6-#3Y#5Z#11A#7 (M98 P<number or expression>, then argument words). The call itself is measured (AUDIT_HW2); the argument words are not. *(vendor macro: macroMillCylinder.nc; not a bench test)*

## Not measured on this controller

- From the firmware disassembly, NOT bench-measured (2026-11-03): M instruction numbers allow up to M9999: the parser compares M numbers against double 9999.0 at 0x000a3e08. Values exceeding 9999 trigger Error 12 ("M instruction number is over bound"). *(FIRMWARE-RE 0x000a3e08 (a measured row until 2026-11-04; demoted: no bench test))*
- From the firmware disassembly, NOT bench-measured (2026-11-03): Soft limits are evaluated in the motion look-ahead buffer in machine coordinates before physical step generation: routine 0x00020a00 checks parameter #90 (enable) and compares target coordinates against negative limits (#235+axis) and positive limits (#240+axis). Violations abort in look-ahead with Errors 42-45 and report the exact offending line number and file byte offset before any axis moves. *(FIRMWARE-RE 0x00020a00-0x00020b90 (a measured row until 2026-11-04; demoted: no bench test))*
- The controller's breakpoints, from the vendor manual (p54), not a run: a Pause breakpoint, a Power-down breakpoint and 4 recorded breakpoints, loaded in READY, each as a specified line, the closest line or the selected breakpoint. *(the vendor manual p54 (FINDINGS: p54 BREAKPOINTS, [CONFIRMED-BY-MANUAL]))*
- What a probe that never touches does under Macro Mode is not measured on this controller (a jump to a missing label is: it ends the program silently, see the flow rows). *(controllers/v4.1/FINDINGS.md (AUDIT_V3, T3602: standard mode))*
