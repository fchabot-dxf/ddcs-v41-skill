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

Each form an assistant may reach for, and what this controller does with it: ✅ works, 🛑 stops mid-run (the run starts, then stops at that line or before it: what had run is in hazards.md), or ⚠️ silently wrong (it runs and computes something else: also in hazards.md). ❔ "not measured" means no bench test has tried it here: do not assume it works.

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
- M47 = repeat the program from its first line, variables carried over: #237 = #237 + 1 / G04 P2000 / IF #237 >= 3 GOTO1 / M47 / N1 / M30 ran 3 passes in 6 s and ended with #237 = 3 (Macro Mode). *(the M47 counter loop (#237))*
- M47 (repeat from the first line) RE-READS the program file from disk at every loop, with a ONE-LOOP LAG: a file replaced during loop k (a temp file renamed over it) first runs in loop k+2, because the next loop already runs the copy read at the start of the current one. Measured with a loop of three sections and a replacement every 1.0 or 2.5 s: the loops logged the header value written one loop earlier, not the newest one (3 runs). The rename keeps the running pass on its own copy (v41-net-overwrite-rename). *(AUDIT_M47FEED, 3 runs; t3943)*
- End an M47 loop with a GOTO that jumps to an M30 placed BEFORE the M47 line (IF #N > 3 GOTO98 ... N98 M30 ... N99 M47): the loop ended cleanly, 2 of 2 (the status box READY, no Reset, no post-end pass). An M02 in the same place did NOT stop it at once: it spun on (about 50 loops in a few seconds without the dwell) and stopped by itself about 11 s in, cause unknown. Use M30. *(AUDIT_M47FEED (M30 twice, M02 once); t3943)*
- RECIPE, feeding a value into a running program: put the values in header assignment lines of the job file (#V = <value>) and let a PC replace the file (write a temp file, rename it over the job) while the program runs; run it as an M47 loop with a RAM counter that dispatches the work by IF / GOTO (Macro Mode #122 on); put one EMPTY loop between the work loops (the odd loops only re-read the header and go to the M47 line), so that a value written during work loop k is the one work loop k+1 uses (3 of 3 sections, 2 runs; an empty loop costs well under a second); end with a GOTO to an M30 before the M47 line. Results come out through uservar after the end or at a dwell (v41-var-no-write-during-motion), and the way IN is only the file (v41-var-inbound-sealed). *(AUDIT_M47EMPTY, 2 runs; t3943, t3945)*
- The words of an M98 call land in the sub as local slots: X #1, Y #2, Z #3, A #4, B #5, C #6, I #7, J #8, K #9, R #10, H #12, Q #14, D #15, F #16, S #17, T #18. U, V, W and E land in none of #0-#33, and #0, #11 and #13 are unused. Every one of these letters is accepted alone, but any two of U, V, W on one call STOP THE RUN at it (U V, U W, V W, U V W; each alone is fine), so the eight words I J K Q R U V W stop it too. The call is not refused at load: the run starts, then stops mid-run when the controller reads ahead to that line (some writes before it may have run, the moves near it do not: v41-syntax-partial); a call with all fourteen words I J K Q R U V W F S T H D E stopped the run and the V4.1 then ignored every key until a power cycle (the eight-word and the U V W stops left the keys alive), so keep a call to a few words. *(BIBLE_M98_AXES, BIBLE_M98_I_MAP, BIBLE_M98_POS_J to _T and _U _V _W _E _H _D, BIBLE_M98_MAP_ALL, BIBLE_M98_LETTERS, BIBLE_M98_COMBO_UV _UW _VW _UVW)*
- M99 at the top level of a program, outside any subprogram, ends the program silently; it does not restart it. *(BIBLE_M99_MAIN)*
- START FROM LINE: a program can open the vendor's "Advanced Startup" dialog with M98 P8001 and no panel key (slib.nc O8001; with no argument it opens advstart.rc). The dialog offers Startup method Specified line (selected) or Closest Location; the "Specified line" field is the persistent #497 and is PRE-FILLED from #497: write #497 = N, then M98 P8001 X0, and the dialog shows Specified line 0000000N (#497 = 12 showed 00000012). The dialog's own text says Closest Location needs the XY soft limits enabled and the tool over an already machined area. ALWAYS pass X on this call (a bare M98 P8001 reuses the stale #1 of the previous call: locals are not cleared between calls). THE ARGUMENT FORM picks the variant (X lands in the sub as #1): M98 P8001 X0 = the PLAIN "Advanced Startup" (single workpiece) with the line from #497; X505 = "Advanced Startup" for Array machining (Current machining: Array machining, the array parameters, Specified line / Closest, "Array positioning: Rows, Cols"); X342 = "Advanced Startup" for Sequence machining (the template table, Specified line / Closest, "Sequential positioning"); X585 = "Load breakpoint" for a Single workpiece (Program mode Axis, Line No.; Startup method Specified line / Closest Location / BREAKPOINT (a third option)); X586 = "Load breakpoint" for an Array ("workpiece located: Row, Col"); X587 = "Load breakpoint" for a Sequence ("workpiece serial No", the table). The operator must make a LONG press of Ok (the panel's Z- / ENTER key, about 1 s) to continue; Cancel (Esc) ENDS the calling program: the line after the M98 never ran and the status read READY. What the controller's own breakpoints are is from the vendor manual, not a run (un-v41-breakpoints). *(AUDIT_ADVSTART_MACRO (M98 P8001 then M30, dongle), AUDIT_PREFILL497_X0 (#497 = 12 then M98 P8001 X0), AUDIT_MENU_ARG_ADVSTART_ARRAY, _ADVSTART_SEQ, AUDIT_MENU_ARG_BREAK_SINGLE, _ARRAY, _SEQ (X505, X342, X585, X586, X587))*
- MULTI-PART: the V4.1 has a built-in "Sequence machining" that runs the SAME program once at each of a list of positions (Array is the regular-grid version, set on the panel), fed by sysdisk/template.txt: one line per part, seven space-separated numbers, Origin-X Origin-Y Origin-Z Origin-A Rotate-angle R-Center-X R-Center-Y (a two-line file 10 20 0 0 0 0 0 and 60 20 0 0 90 60 20 filled the table exactly). CRLF is accepted. The page reads a converted copy named "template" on the system disk, and that copy persists: after template.txt was deleted the page still showed the old rows. *(template.txt on the bench (Sequence machining page) and AUDIT_MENU_TEMPLATE_RC)*
- REAL SEQUENCE MACHINING, measured with a real panel-menu run of a 3-row template. Start it on the panel with Shift, then the DOWN arrow to Advanced Machining, ENTER, DOWN to Sequence Machining, ENTER: arrows, not the numbers 5 and 2 of the manual (there is a submenu and no item numbers). The page lists the template.txt rows (seven numbers per row, see v41-flow-template-txt); its Ok is an Enter hold of about 2 s (a USB device that really holds takes it, a tap does not), and no Advanced Startup dialog followed when the specified line was valid. Each part runs the selected program once with its row origin ADDED to the active work coordinate (a G52 offset: mach X 91.78, 101.78, 111.78 for G54 X 81.78 and the rows 10, 20, 30, work X reading 0 at each part start); #496 is the 0-based part counter (0, 1, 2) and #499 is 1. The program file is RE-READ before EACH part: a file replaced by a rename during part 1 ran from part 2 on, and part 1 kept its own copy. There is no wait and no prompt between parts (about 2-5 s of driver overhead between one M30 and the next part first variable write); the run stops by itself after the last template row, and no post-end fast pass followed (v41-var-after-run-reread is about an ordinary run). WHAT IT IS FOR: the same program at several positions. To run DIFFERENT code per step, or to feed new values into a run, do not swap the file under Sequence machining: use one program with an M47 loop (v41-recipe-feed-running-program), which needs no panel menu and has no race. If a file IS swapped per part anyway, it must have part n+1 on disk before part n ends, because the next part starts 2-5 s after M30 with no wait; writing it right after part n STARTS is safe, the running part keeps its copy. Not covered: the template Z column and rotation (all 0 here), a long wait in the body, more than 4 rows; an M0 or a pause in the body, a part with no motion and the stop actions are measured: v41-hazard-seq-pause-reruns, v41-hazard-seq-motionless, v41-seq-stop-actions. *(AUDIT_SEQ_REAL, a real panel-menu run, one run; t3940)*
- At a stop inside a Sequence machining part (an M0 reached by a guard, the file on disk replaced at the stop; 1 run each): Start re-runs the CURRENT part from the top with the file now on disk, then the sequence continues; Reset then Start ends the sequence (the Start is ignored in RESET); Reset twice then Start runs the file on disk once as a plain program and the sequence does not continue. So the one clean fix at such a stop is to put the right file in place and press Start (that part is redone). The template is read once at the start: a row added to template.txt during a run did not run (1 run). M2 ends a part the same way M30 does (1 run). No way to restart a sequence at part N was found: after a Reset during part 2 the menu Advanced Startup is the single-workpiece dialog (no part field), and the page row highlight did not set the start part (row 3 highlighted, the run started at part 1, 2 runs; row 2 untested). The Pause key lifts Z 5 mm and Start puts it back; a paused part reads CONT and READY like an idle controller. *(a bench script (R1-R2c, S1-S5, S4a/b), real panel-menu Sequence runs, 2026-10-29)*
- None of these stops the program: 1 / 0 returns 0, MOD[7, 0] returns 0, and SQRT of a negative number returns NaN (it reads back as nan and every comparison against it, == 0, > 0 and < 0, is false). Test a divisor or a root argument yourself before the line. *(BIBLE_DIV_ZERO, BIBLE_MOD_ZERO, BIBLE_SQRT_NEG, BIBLE_SQRT_VALUE)*
- G92 writes the work-offset table of the SELECTED frame only: with G54, G55 or G59 selected, G92 X[<current work X> + 5] changed only that frame's X slot (#1512, #1518 or #1542) by exactly 5, and none of the other 20 X Y Z slots in #1512-#1550. G92 X[<current work X>] alone undid it. *(AUDIT_G92WCS (PASS 15/15))*
- A G52 local shift does NOT survive into the next job on the V4.1: after a program set G52 X5 Y0, a Reset during its dwell, and after the same program ending on its own M30, the NEXT job moved to work X0 Y0 landed at machine X = the G54 X slot (#1500 minus #1512 read 0), 4 runs of 4. Inside one program the same G52 X5 Y0 then G0 X0 Y0 reads 5, so the 0 is a real cleared shift. G52 X5 Y0 also lands the X word in #1548 (read back 5 right after it). Still write G52 X0 Y0 at the start and at the end of a repeat as a precaution (it costs nothing); it is not load-bearing on this firmware. [TO TEST] a power cycle after a Reset, and the Expert (the V4.1 result does not carry over). *(AUDIT_G52_P1_LEAVE / P2_READ / P3_RESTORE / CTRL; t3957)*

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

- The controller's breakpoints, from the vendor manual (p54), not a run: a Pause breakpoint, a Power-down breakpoint and 4 recorded breakpoints, loaded in READY, each as a specified line, the closest line or the selected breakpoint. *(the vendor manual p54 (FINDINGS: p54 BREAKPOINTS, [CONFIRMED-BY-MANUAL]))*
- What a probe that never touches does under Macro Mode is not measured on this controller (a jump to a missing label is: it ends the program silently, see the flow rows). *(controllers/v4.1/FINDINGS.md (AUDIT_V3, T3602: standard mode))*
