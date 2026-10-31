# DDCS V4.1 — operator prompts and dialogs

> Every measured statement names the bench test that measured it (see evidence.md).


## The .rc dialog

A prompt, a number entry and a 2-way choice are each a `.rc` dialog file the program opens with `MarcoDialog "<full path>"`. The operator HOLDS Ok to continue; Cancel ends the program.

The dialog's own last line, which tells the operator how to continue: "Hold Ok to continue".

If a prompt's text cannot be drawn in a dialog, it falls back to `( text )` + `M0` with "Press Start to continue".

A choice is a RADIO of exactly 2 labels writing the chosen 0-based index into #192; the program branches on it right after the dialog.

A number entry is an EDIT bound to the target variable, decimal, -10000..10000, 10 characters wide.

## Where the dialog file lives

The program calls each dialog by FULL path, in the folder it runs from:

- Work disk: `/local/`
- USB stick: `/udisk-sda1/`

- **One dialog**: the program CARRIES it — the dialog's lines at the top, each prefixed with `;`, and `MarcoDialog "<folder>/<program>.nc"` (the program opens itself). Renaming or moving the file breaks its dialog.
- **Two or more dialogs**: one `.rc` file per dialog, named `<program>-<n>.rc`, beside the program.
- A program carries its dialog only when none of its other lines contains a dialog-loader keyword (CreateIndirect, WM_GetDialogItem, SetFont, SetText, AddString, AddColumn, SetGridVis, AddRow, SetItemText, SetTextColor, SetHeaderHeight, SetRowHeight, SetTitleVis, SetTextAlign); otherwise it uses the files.

Exits: continue = hold Ok; end = Cancel/Esc.

## A dialog file

The controller reads only the lines below from a dialog file (any line without one of the loader keywords is ignored). A prompt ("Check the clamp", Ok / Cancel):
```
  { FRAMEWIN_CreateIndirect, "9", ID_FRAMEWIN_0, 2, 101, 1020, 360, 0, 100, 1 },
  { BUTTON_CreateIndirect, "Button", ID_BUTTON_0, 780, 250, 100, 45, 0, 0, 0 },
  { BUTTON_CreateIndirect, "Button", ID_BUTTON_1, 900, 250, 100, 45, 0, 0, 0 },
  { TEXT_CreateIndirect, "Text", ID_TEXT_0, 2, 28, 1024, 32, 0, 100, 0 },
  { TEXT_CreateIndirect, "Text", ID_TEXT_1, 12, 75, 1024, 32, 0, 100, 0 },
    FRAMEWIN_SetFont(hItem, GUI_FONT_24B_ASCII);
    FRAMEWIN_SetText(hItem, "Operator");
    hItem = WM_GetDialogItem(pMsg->hWin, ID_BUTTON_0);
    BUTTON_SetText(hItem, "Ok");
    BUTTON_SetFont(hItem, GUI_FONT_24B_ASCII);
    hItem = WM_GetDialogItem(pMsg->hWin, ID_BUTTON_1);
    BUTTON_SetText(hItem, "Cancel");
    BUTTON_SetFont(hItem, GUI_FONT_24B_ASCII);
    hItem = WM_GetDialogItem(pMsg->hWin, ID_TEXT_0);
    TEXT_SetTextAlign(hItem, GUI_TA_LEFT | GUI_TA_VCENTER);
    TEXT_SetText(hItem, "Check$42the$42clamp");
    TEXT_SetFont(hItem, GUI_FONT_24B_ASCII);
    hItem = WM_GetDialogItem(pMsg->hWin, ID_TEXT_1);
    TEXT_SetTextAlign(hItem, GUI_TA_LEFT | GUI_TA_VCENTER);
    TEXT_SetFont(hItem, GUI_FONT_24B_ASCII);
    TEXT_SetText(hItem, "Hold$42Ok$42to$42continue");
```

A number entry into #150:
```
  { FRAMEWIN_CreateIndirect, "9", ID_FRAMEWIN_0, 2, 101, 1020, 360, 0, 100, 1 },
  { BUTTON_CreateIndirect, "Button", ID_BUTTON_0, 780, 250, 100, 45, 0, 0, 0 },
  { BUTTON_CreateIndirect, "Button", ID_BUTTON_1, 900, 250, 100, 45, 0, 0, 0 },
  { TEXT_CreateIndirect, "Text", ID_TEXT_0, 2, 28, 1024, 32, 0, 100, 0 },
  { TEXT_CreateIndirect, "Text", ID_TEXT_1, 12, 75, 1024, 32, 0, 100, 0 },
  { TEXT_CreateIndirect, "Text", ID_TEXT_2, 12, 115, 300, 32, 0, 100, 0 },
  { EDIT_CreateIndirect, "Edit", ID_EDIT_0, 315, 115, 155, 32, 0, 100, 150 },
    FRAMEWIN_SetFont(hItem, GUI_FONT_24B_ASCII);
    FRAMEWIN_SetText(hItem, "Enter$42a$42value");
    hItem = WM_GetDialogItem(pMsg->hWin, ID_BUTTON_0);
    BUTTON_SetText(hItem, "Ok");
    BUTTON_SetFont(hItem, GUI_FONT_24B_ASCII);
    hItem = WM_GetDialogItem(pMsg->hWin, ID_BUTTON_1);
    BUTTON_SetText(hItem, "Cancel");
    BUTTON_SetFont(hItem, GUI_FONT_24B_ASCII);
    hItem = WM_GetDialogItem(pMsg->hWin, ID_TEXT_0);
    TEXT_SetTextAlign(hItem, GUI_TA_LEFT | GUI_TA_VCENTER);
    TEXT_SetText(hItem, "Stock$42height");
    TEXT_SetFont(hItem, GUI_FONT_24B_ASCII);
    hItem = WM_GetDialogItem(pMsg->hWin, ID_TEXT_1);
    TEXT_SetTextAlign(hItem, GUI_TA_LEFT | GUI_TA_VCENTER);
    TEXT_SetFont(hItem, GUI_FONT_24B_ASCII);
    TEXT_SetText(hItem, "Hold$42Ok$42to$42continue");
    hItem = WM_GetDialogItem(pMsg->hWin, ID_TEXT_2);
    TEXT_SetTextAlign(hItem, GUI_TA_LEFT | GUI_TA_VCENTER);
    TEXT_SetFont(hItem, GUI_FONT_24B_ASCII);
    TEXT_SetText(hItem, "Value");
    hItem = WM_GetDialogItem(pMsg->hWin, ID_EDIT_0);
    EDIT_SetText(hItem, "#<-10000>10000*10^1");
    EDIT_SetFont(hItem, GUI_FONT_13_ASCII);
    EDIT_SetTextAlign(hItem, GUI_TA_RIGHT | GUI_TA_VCENTER);
```

Save a dialog file with CRLF line endings and 7-bit ASCII text; carried inside a program, prefix each of these lines with `;`.

## A message that does not stop the program (toast)

1. The toast is a dialog whose FRAMEWIN row ends in 2: it stays on screen and the program runs on. *(AUDIT_R22)*
2. #100 closes it: with #100 = 1, the next MarcoDialog of the toast's file closes it. #100 survives power-cycles, and a leftover 1 stops the next toast from opening, so set #100 = 0 before opening one. *(AUDIT_R22, AUDIT_R23, AUDIT_R24)*
3. Close the toast before any other dialog and before the program ends (why: the firmware reading under "Not measured" below; not bench-measured).
4. Give a toast NO Ok/Cancel buttons. *(AUDIT_R33)* On a toast with buttons, Cancel looks like "stop" but closes only the toast: the next refresh opens it again and the program runs on. *(AUDIT_R22)*

The toast file ("Roughing"):
```
  { FRAMEWIN_CreateIndirect, "9", ID_FRAMEWIN_0, 2, 101, 1020, 360, 0, 100, 2 },
  { TEXT_CreateIndirect, "Text", ID_TEXT_0, 2, 28, 1024, 32, 0, 100, 0 },
    FRAMEWIN_SetFont(hItem, GUI_FONT_24B_ASCII);
    FRAMEWIN_SetText(hItem, "Message");
    hItem = WM_GetDialogItem(pMsg->hWin, ID_TEXT_0);
    TEXT_SetTextAlign(hItem, GUI_TA_LEFT | GUI_TA_VCENTER);
    TEXT_SetText(hItem, "Roughing");
    TEXT_SetFont(hItem, GUI_FONT_24B_ASCII);
```

The program lines around one toast:
```gcode
#100 = 1
MarcoDialog "/local/<program>-1.rc"
#100 = 0
MarcoDialog "/local/<program>-1.rc"
( ... the program runs on with the toast up ... )
#100 = 1
MarcoDialog "/local/<program>-1.rc"
#100 = 0
```

## Writing a dialog file

1. A type-9 dialog's held Ok writes no coordinate or setting: it only closes the dialog. *(AUDIT_R15 + state-file diff)*
2. The FRAMEWIN row's LAST field sets the mode: 1 = a normal blocking dialog (held Ok continues, Cancel ends the program); 2 = non-blocking (Ok ignored, the program keeps running; #100 = 1 then MarcoDialog closes it). *(AUDIT_R23 (1), AUDIT_R22 (2))*
3. A dialog whose frame row ends in 0 is modal: Cancel and Esc do not close it; only a held Ok does, and the program then runs on. *(AUDIT_R32)*
4. A dialog opened by MarcoDialog "<file>.rc" from a disk program closes on a HELD Ok (a tap does nothing) and the program continues. *(AUDIT_R1 (held Ok))*
5. Cancel discards the dialog's edits and ENDS the program; the keyboard Esc does the same in an Input Dialog (a .rc dialog, the Jogging-distance box) and ONLY there: a Message box (the boot "Go to home?" box) ignores Esc and cancels with PgUp. *(AUDIT_R2b (Cancel), AUDIT_R16 (Esc), bench keyboard sweep (Esc and PgUp per dialog kind))*
6. Cancel on a toast WITH buttons closes only the toast: the next MarcoDialog refresh opens it again, and the program runs on to its end. It does not stop the program, unlike Cancel on a normal dialog. *(AUDIT_R22)*
7. A TEXT line never wraps (one widget per line); only GUI_FONT_24B_ASCII is honoured on a TEXT widget; about seven 40-px rows fit a 360-px frame. *(AUDIT_R16)*
8. A backtick in dialog text draws a space; so does $42 (a message-table entry that is one space), ended by a TAB byte when a digit follows. *(AUDIT_R12, AUDIT_R15, AUDIT_R22)*
9. Dialog literal text: spaces, #, %, &, ; and ) are not drawn as written (stripped or read as commands); A-Z a-z 0-9 and ! * + - . / : = ? @ [ ] _ { | } ~ < > ' \ ( , draw as written. *(AUDIT_R8 (palette on the system disk))*
10. Dialog text commands: $n = message string n; ^n = the message string whose id is in #n; #n = the value of #n with 4 decimals; &n = the value of #n as an integer. Each takes every digit that follows. *(AUDIT_R13, AUDIT_R14)*
11. An EDIT widget: the CreateIndirect row's LAST field is the variable it reads and writes; EDIT_SetText carries the format #<min>max*width^k (decimal, sign + 4 places, width characters: #<-10000>10000*10 shows +0000.0000) or &<min>max*width^k (integer, width digits). EDITs added with their own ids work. *(AUDIT_R2, AUDIT_R21)*
12. An EDIT field is a digit wheel (TAB selects, X-/X+ move the digit, Y-/Y+ change it); a held Ok writes its value into the bound variable (single precision, about 7 digits). *(AUDIT_R2, AUDIT_R2b, AUDIT_R21)*
13. A RADIO widget: the row's second-to-last field is para = (spacing << 8) | item count (7683 = 30 px, 3 items), the LAST field the variable that receives the 0-based index; items set with RADIO_SetText(hItem, "<label>", <index>). *(AUDIT_R19)*
14. A RADIO writes the chosen 0-based index into its bound variable on a held Ok. *(AUDIT_R19)*
15. One file holds ONE dialog: two dialog blocks in one file draw one merged, broken dialog. *(AUDIT_R28)*
16. #100 is the dialog control variable: a normal dialog resets it to 0 while open, 1 closes a non-blocking dialog, and it survives power-cycles. Never keep data in #100. *(AUDIT_R22, AUDIT_R23, AUDIT_R24)*
17. A picture group is //<disk>/<file>.bmp:x:y in the FRAMEWIN name (double slash; a 45-character name holding two groups worked); put pictures in NORMAL dialogs only, since a non-blocking dialog's refresh erases them. *(AUDIT_R29, AUDIT_R30)*
18. A dialog can show BMP pictures: frame name //<disk>/<file>.bmp:x:y (several groups allowed, 24-bit and 8-bit draw); a refresh of a non-blocking dialog partly erases them. *(AUDIT_R29, AUDIT_R30)*

Not measured on this controller:

- While a toast is open, a MarcoDialog of ANY file only refreshes or closes the toast (the firmware skips the reload), so a normal dialog called then would not open: read in the firmware, not bench-measured. Close the toast before every dialog call. *(controllers/v4.1/FIRMWARE-RE-2025-04-04.md §4a)*
- What the keyboard Esc does on a toast WITH buttons is not measured (Cancel closes only the toast and the program runs on: AUDIT_R22; on a buttonless toast Esc closes only the toast: v41-hazard-toast-swallows-reset). *(controllers/v4.1/FIRMWARE-RE-2025-04-04.md §4a)*

## Also measured on this controller

- A (MSG, text) comment, or any (text) comment, shows nothing on the pendant (the screen did not change through a 12 s dwell, 1 run): an operator message needs a MarcoDialog. *(the CAM-file test, 2026-10-30)*
- A toast with NO Ok/Cancel buttons (frame last field 2, no BUTTON rows) opens, refreshes while the program runs, and closes at #100 = 1 + MarcoDialog. *(AUDIT_R33)*
- Beep: #1802 = 1 turns the buzzer on, #1802 = 0 (or any value but exactly 1: #1802 = 500 is off) turns it off; a 0.3 s beep is #1802 = 1 / G04 P300 / #1802 = 0. It sounds only with Pr323 "Enable of beep" = Enable (Param page). Always pair = 1 with = 0. *(AUDIT_BEEP1 (owner))*
- M0 with the instruction in a comment is a readable blocking prompt: the screen shows the current line with its comment; Start resumes. *(AUDIT_P1_m0)*
- #1505 is NOT a dialog here: writing it is a silent variable write, no message, no pause. *(AUDIT_P2_1505)*
- A dialog needs no Macro Mode: a straight-line program with MarcoDialog runs and continues with #122 = Disable. *(AUDIT_R5)*
- A BARE .rc name is read from the system disk root only; a bare name that is not there draws the last dialog parsed, with garbage text. *(AUDIT_R8 after AUDIT_R3)*
- A FULL path reads a .rc from anywhere the controller sees: the work disk is /local/ (MarcoDialog "/local/<name>.rc"). *(AUDIT_R25)*
- A USB stick mounts at /udisk-sda1 on either port; a second stick plugged at the same time is ignored. *(AUDIT_R26, AUDIT_R26c, two-stick test)*
- A program can carry its own dialog: the .rc keyword lines prefixed with ";" at the top, and MarcoDialog "<its own full path>" opens it. *(AUDIT_R27)*
- There is no cache by name: MarcoDialog re-reads the file at every call. *(AUDIT_R12 rewritten (R17))*
- A dialog whose frame row ends in 2 does not block: the program keeps running under it, and each later MarcoDialog of the same file refreshes its texts. *(AUDIT_R22)*
- A program can show its own progress with a buttonless toast (frame last field 2) whose rc rows are the lines that start with a semicolon at the top of the JOB file, shown by MarcoDialog "/local/<job>.nc": a text like Section`&190`/`3 (backticks are spaces, &190 is #190 as an integer) is refreshed by setting #190 and calling the same MarcoDialog, and closed with #100 = 1 plus the call before the program ends. In an M47 loop it never blocked (the section timings were unchanged, 8 s each), the number on screen matched the running section on camera frames, the loop re-read and the counter were unaffected, and it closed cleanly before the M30 (2 of 2); the dialog text is read from the job file at each call, so a renamed-in file works as well. While the toast is open it captures a USB keyboard's Reset: press Esc first (v41-hazard-toast-swallows-reset). *(AUDIT_M47TOAST, webcam frames; t3946)*
- The controller's own dialogs open from a user program with NO motion: MarcoDialog "selcoord.rc" = the G54-G59 coordinate table (X, Y, Z, A) with #1 = 146; MarcoDialog "adjush.rc" = Tool Management (H-compensation, length wear, diameter, diameter wear) with #1 = 595; MarcoDialog "center.rc" = find the middle of X or Y with #1 = 366 and #2-#4 = 140-142 (X) or #1 = 367 and #2-#4 = 143-145 (Y), the way the vendor centerx.nc and centery.nc set them; MarcoDialog "array.rc" = Array machining (rows, columns, spacings, rotation angle and centre); MarcoDialog "template.rc" = Sequence machining; M98 P8003 = the Simulation dialog. Set the #1-#4 values in the SAME file as the MarcoDialog line. Esc cancels the dialog and ENDS the program, back to the Main page. What Ok does on them is not measured (un-v41-vendor-dialog-ok). *(AUDIT_MENU_SELCOORD, AUDIT_MENU_ADJUSH, AUDIT_MENU_CENTERX, AUDIT_MENU_ARRAY_RC, AUDIT_MENU_TEMPLATE_RC, AUDIT_MENU_SIMULATE (dongle))*
- A dialog TEXT line shows about 75 digit-width characters (1024 px at GUI_FONT_24B_ASCII) and CLIPS the rest silently, with no wrap and no ellipsis: the 70-character line was whole, every line from 80 characters on was cut after the 75th. The font is proportional (a digit is about 13.3 px, a letter wider), so a line of wide letters shows fewer; how few for a line of capitals is not measured. Split a longer prompt on words over several TEXT lines. *(AUDIT_TEXTW (shot AUDIT_TEXTW-182121), control AUDIT_TEXTW4)*
- A dialog picture is clipped at 244 px below the title bar: Y + height <= 244, whatever the frame height (360, 480 and 540 cut the same) and silently. A 1000x244 picture at Y = 0 drew whole; a 1000x250 one lost its last 6 rows. *(the t3892 BMP size sweep (FINDINGS 2026-10-21 / 22 section))*
- Picture width is not the limit: 640, 900 and 1000 px wide (at x = 10) drew whole; an odd width (637) drew whole in 24-bit and 8-bit (no multiple-of-4 rule); 8-bit palette BMPs draw. *(the t3892 BMP size sweep (FINDINGS 2026-10-21 / 22 section))*
- A picture is drawn under the dialog's TEXT widgets and over its background, but not over main-screen widgets when the frame sits high (frame y = 2 let the FRO row show through); with the vendor frame position y = 101 there is no such hole. *(the t3892 BMP size sweep (FINDINGS 2026-10-21 / 22 section))*
- Dark pictures vanish on the panel LCD: a dark diagram (blue-grey lines on black) clear in Print Screen was nearly invisible on the panel at 320x110 and 640x220, in 24-bit and 8-bit; the same diagram on white with dark lines was readable, and 3-5 px text in a bitmap was unreadable at every size. Draw on white with strokes of 2 px or more and put numbers in TEXT widgets. *(the t3892 real-picture runs (webcam on the panel))*
- $42 spaces render on a .rc opened by full path from /local/ (not only on the system disk). *(the t3892 Surfacing export (surface.rc))*
- A value dialled into an EDIT and confirmed with a held Ok reaches the program: Width dialled to 1.0000 made the body run with it (Abs X ended at 1.000); Esc on the same dialog stopped the program at the line before the dialog call, with no body run. *(the t3892 Surfacing export (macro_surface.nc))*

## Beep, status and message lines (attested, not bench-measured)

- ⛔ Never #1503 = <n>(text) on this controller (the Expert's status line): #1503 is the A machine position here, and the write overwrites it. *(firmware read: FIRMWARE-RE §12e; not a bench test)*
- No variable, M-code or comment writes the message line: only program errors and alarms appear there. To show text while the program keeps running, use the toast. (A deliberate error line is NOT a message method here: #3000 froze the bench.) *(firmware read: FIRMWARE-RE §12f; not a bench test)*
