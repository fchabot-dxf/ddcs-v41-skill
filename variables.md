# DDCS V4.1 — variables

> Every measured statement names the bench test that measured it (see evidence.md).

## Access: who reads and writes, and when

Where a read or a write comes from, and when it works. Each mark points to the fact that says so: its page, and its bench test there. ✅ works, ⛔ does not, ⚠️ with a catch, ❔ no fact says yet, — does not apply.

| from | read at idle | read during a run | write at idle | write during a run | survives a reboot |
|---|---|---|---|---|---|
| the running program | — | ✅ syntax.md (AUDIT_HW1) · ✅ integration.md (SWEEP #470) · ✅ integration.md (SWEEP #103) · ✅ integration.md (SWEEP #612) · ✅ integration.md (SWEEP #790) · ✅ integration.md (SWEEP #1508) · ✅ integration.md (SWEEP #1651) · ✅ integration.md (SWEEP #1824) · ⛔ integration.md (SWEEP #1806) | — | ✅ syntax.md (AUDIT_HW1) · ⚠️ hazards.md (AUDIT_MSG1) · ✅ integration.md (SWEEP #470) · ✅ integration.md (SWEEP #103) · ✅ integration.md (SWEEP #612) · ✅ integration.md (SWEEP #790) · ✅ integration.md (SWEEP #1508) · ✅ integration.md (SWEEP #1651) · ⛔ integration.md (SWEEP #1824) · ✅ integration.md (SWEEP #1806) | ✅ dialogs.md (AUDIT_R22) · ✅ integration.md (SWEEP #470) · ✅ integration.md (SWEEP #103) · ✅ integration.md (SWEEP #612) · ✅ integration.md (SWEEP #790) · ✅ integration.md (SWEEP #1508) · ⛔ integration.md (SWEEP #1651) · ⛔ integration.md (SWEEP #1824) |
| a hook macro (an M-code body, a K-key or key-N macro, a start or error hook) | ❔ | ❔ | ⚠️ integration.md (a merged slib-m.nc with an O10012 block) | ❔ | ✅ integration.md (a merged slib-m.nc with an O10012 block) |
| MDI (a line typed on the pendant) | ❔ | ❔ | ❔ | ❔ | ❔ |
| injected G-code (Modbus register 3000) | ⛔ integration.md (firmware string scan 2025-04-04) | ⛔ integration.md (firmware string scan 2025-04-04) | ⛔ integration.md (firmware string scan 2025-04-04) | ⛔ integration.md (firmware string scan 2025-04-04) | ⛔ integration.md (firmware string scan 2025-04-04) |
| the uservar file (a PC, over the share) | ✅ integration.md (uservar readback) | ⚠️ integration.md (dispatcher heartbeat #246) · ⚠️ integration.md (AUDIT_LOOKAHEAD_TOAST) | ⛔ integration.md (a bench script) · ⛔ hazards.md (a bench script) | ⛔ integration.md (a bench script) · ⛔ hazards.md (a bench script) | ✅ integration.md (a bench script) |
| Modbus registers (a PC) | ⛔ integration.md (firmware string scan 2025-04-04) | ⛔ integration.md (firmware string scan 2025-04-04) | ⛔ integration.md (firmware string scan 2025-04-04) | ⛔ integration.md (firmware string scan 2025-04-04) | ⛔ integration.md (firmware string scan 2025-04-04) |
| the setting file / Param page | ✅ integration.md (a bench script) | ❔ | ⚠️ ui.md (#324 change) | ❔ | ❔ |
| the pendant | ❔ | ❔ | ⚠️ ui.md (a bench script: numpad * and 5 holds) | ❔ | ❔ |

Source: **DDCS V4.1 Variables list.xlsx**, a variable table for the DDCS V4.1. The descriptions are the table's own words.

⛔ Never write a variable you have not looked up here. A value of 0 does not mean unused.

## Beyond the table

What is declared or measured about these variables beyond the table, each with its evidence.

| variables | | what | evidence |
|---|---|---|---|
| #100 | ⛔ reserved | #100 is the DDCS V4.1's dialog control variable: any dialog resets it to 0. Never keep data in it. | declared; not bench-measured |
| #100 | ⚠ the firmware writes it | The dialog control variable: a normal dialog resets it to 0 while open; 1 closes a non-blocking dialog. | AUDIT_R22, AUDIT_R23, AUDIT_R24 |
| #100-#499 | measured | Persist through power-off; the system share's uservar file holds them (slot = #var - 100), written at program start and end, by the time a program pauses at an M0, and continuously while a dialog or toast is open. A PC reads it, never writes it: only a reboot loads the file. | uservar readback |
| #101 | ⛔ reserved | #101-#148 are the DDCS V4.1's own dialog memory (the operator's remembered tool-change and probe defaults). Never keep data in it. | declared; not bench-measured |
| #102 | ⛔ reserved | #101-#148 are the DDCS V4.1's own dialog memory (M6.rc binds #102-#105). Never keep data in it. | declared; not bench-measured |
| #103 | ⛔ reserved | #101-#148 are the DDCS V4.1's own dialog memory (M6.rc binds #102-#105). Never keep data in it. | declared; not bench-measured |
| #104 | ⛔ reserved | #101-#148 are the DDCS V4.1's own dialog memory (M6.rc binds #102-#105). Never keep data in it. | declared; not bench-measured |
| #490-#536 | ⛔ do not write | #490-#536 are the V4.1 firmware's own (its macros write them; #490-#495 hold the machine position for power-off recovery), never a variable to store data in | BIBLE_M98_POS_H and BIBLE_M98_POS_D (slots #490-#495), the vendor safez.nc |
| #500-#1499 | ⛔ do not write | The system parameter area (the Param page): a write changes a machine setting. | the variable table names it |
| #790-#844 | measured | Parameters (#790 is Pr290), not a position as on the Expert: the work position is #1506-#1508, in the #1500 block. | SWEEP #790; the variable sweep (a bench script SWEEP_WRITE / SWEEP_PARAM_LEAVE / SWEEP_READ), soft reboots between |
| #1500-#1503 | ⛔ do not write | The machine position: never write it. | the variable table names it |
| #1505 | measured | Not a dialog on this controller: writing it is a silent variable write, no message, no pause. | AUDIT_P2_1505 |
| #1506-#1509 | ⛔ do not write | The work position: a write moves the work zero. The vendor's zeroxy.nc and zeroall.nc set zero by writing it; never as scratch. | the variable table names it |
| #1512-#1515 | ⛔ do not write | G54 offsets: a write moves the work zero. Never as scratch. | the variable table names it |
| #1518-#1521 | ⛔ do not write | G55 offsets. Never as scratch. | the variable table names it |
| #1524-#1527 | ⛔ do not write | G56 offsets. Never as scratch. | the variable table names it |
| #1530-#1533 | ⛔ do not write | G57 offsets. Never as scratch. | the variable table names it |
| #1536-#1539 | ⛔ do not write | G58 offsets. Never as scratch. | the variable table names it |
| #1542-#1545 | ⛔ do not write | G59 offsets. Never as scratch. | the variable table names it |
| #1548-#1551 | ⛔ do not write | G52 offsets. Never as scratch. | the variable table names it |
| #1554-#1557 | ⛔ do not write | Tool offsets. Never as scratch. | the variable table names it |
| #1560 | ⛔ do not write | #1560 selects whether H1-H16 (#1561-#1576) hold the tool length or its wear. Never as scratch. | the variable table names it |
| #1561-#1576 | ⛔ do not write | H1-H16 tool length values. Never as scratch. | the variable table names it |
| #1577 | ⛔ do not write | #1577 selects whether D1-D16 (#1578-#1593) hold the tool diameter or its wear. Never as scratch. | the variable table names it |
| #1578-#1593 | ⛔ do not write | D1-D16 diameter compensation values. Never as scratch. | the variable table names it |
| #1650 | ⛔ do not write | Reads back the output word; a write is ignored. Read-only. | the variable table names it |
| #1651-#1653 | ⛔ do not write | Outputs 1-3: a write switches an output at once (OUT1 is the spindle output on the measured unit). Never as scratch. | the variable table names it |
| #1654-#1681 | ⛔ do not write | Output ports 4-31, NOT storage (the vendor list calls them a global variable area): a write switches an output bit. | the variable table names it |
| #1682 | ⛔ do not write | Not storage: a write is ignored. | the variable table names it |
| #1683-#1713 | ⛔ do not write | The input word and inputs 1-30: read-only, a write is ignored. Not storage. | the variable table names it |
| #1714-#1715 | ⛔ do not write | Not storage: a write is ignored. | the variable table names it |
| #2000-#99999 | ⛔ do not write | Never write any variable from #2000 up on this controller: #3000 = 1 FROZE it (power-cycle needed); the Expert's #2042 beep, #2070 entry and #3000 have no use here. | AUDIT_MSG1 |

## A parameter, not a variable

- Parameter #122 "Macro programming mode" is a setting on the Param page, not macro variable #122: the operator sets it, a program never writes it. *(AUDIT_S5c_rerun (at #122=0 and #122=1))*

## User

| variables | description | note |
|---|---|---|
| #0-#99 | Local variable (subroutine-internal) |  |
| #100-#499 | Global variable area 1 (power-off recovery) | ⛔ reserved, ⚠ the firmware writes it, measured, ⛔ do not write |

## System

| variables | description | note |
|---|---|---|
| #500-#1499 | System parameter area (set on the parameter page) | ⛔ do not write, measured |
| #1500 | Mach position of X axis | ⛔ do not write |
| #1501 | Mach position of Y axis | ⛔ do not write |
| #1502 | Mach position of Z axis | ⛔ do not write |
| #1503 | Mach position of A axis — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §12): a write stores straight into the A machine position the interpreter reads back (the Expert writes its status line with #1503; never on this controller). Read-only in practice. | ⛔ do not write |
| #1504-#1505 | Global variable area 2 (volatile) | measured |
| #1506 | workpiece coordinate position of X axis | ⛔ do not write |
| #1507 | workpiece coordinate position of Y axis | ⛔ do not write |
| #1508 | workpiece coordinate position of Z axis | ⛔ do not write |
| #1509 | workpiece coordinate position of A axis | ⛔ do not write |
| #1510-#1511 | Global variable area 2 (volatile) |  |
| #1512 | G54 workpiece Coordinates Home Offset of X axis | ⛔ do not write |
| #1513 | G54 workpiece Coordinates Home Offset of Y axis | ⛔ do not write |
| #1514-#1515 | G54 workpiece Coordinates Home Offset of Z axis | ⛔ do not write |
| #1516-#1517 | Global variable area 2 (volatile) |  |
| #1518 | G55 workpiece Coordinates Home Offset of X axis | ⛔ do not write |
| #1519 | G55 workpiece Coordinates Home Offset of Y axis | ⛔ do not write |
| #1520-#1521 | G55 workpiece Coordinates Home Offset of Z axis | ⛔ do not write |
| #1522-#1523 | Global variable area 2 (volatile) |  |
| #1524 | G56 workpiece Coordinates Home Offset of X axis | ⛔ do not write |
| #1525 | G56 workpiece Coordinates Home Offset of Y axis | ⛔ do not write |
| #1526-#1527 | G56 workpiece Coordinates Home Offset of Z axis | ⛔ do not write |
| #1528-#1529 | Global variable area 2 (volatile) |  |
| #1530 | G57 workpiece Coordinates Home Offset of X axis | ⛔ do not write |
| #1531 | G57 workpiece Coordinates Home Offset of Y axis | ⛔ do not write |
| #1532-#1533 | G57 workpiece Coordinates Home Offset of Z axis | ⛔ do not write |
| #1534-#1535 | Global variable area 2 (volatile) |  |
| #1536 | G58 workpiece Coordinates Home Offset of X axis | ⛔ do not write |
| #1537 | G58 workpiece Coordinates Home Offset of Y axis | ⛔ do not write |
| #1538-#1539 | G58 workpiece Coordinates Home Offset of Z axis | ⛔ do not write |
| #1540-#1541 | Global variable area 2 (volatile) |  |
| #1542 | G59 workpiece Coordinates Home Offset of X axis | ⛔ do not write |
| #1543 | G59 workpiece Coordinates Home Offset of Y axis | ⛔ do not write |
| #1544-#1545 | G59 workpiece Coordinates Home Offset of Z axis | ⛔ do not write |
| #1546-#1547 | Global variable area 2 (volatile) |  |
| #1548 | G52 workpiece Coordinates Home Offset of X axis | ⛔ do not write |
| #1549 | G52 workpiece Coordinates Home Offset of Y axis | ⛔ do not write |
| #1550-#1551 | G52 workpiece Coordinates Home Offset of Z axis | ⛔ do not write |
| #1552-#1553 | Global variable area 2 (volatile) |  |
| #1554 | Tool Offsets of X axis | ⛔ do not write |
| #1555 | Tool Offsets of Y axis | ⛔ do not write |
| #1556 | Tool Offsets of Z axis | ⛔ do not write |
| #1557 | Tool Offsets of A axis | ⛔ do not write |
| #1558-#1559 | Global variable area 2 (volatile) |  |
| #1560 | Tool Length compensation Kinds | ⛔ do not write |
| #1561 | H1 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1562 | H2 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1563 | H3 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1564 | H4 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1565 | H5 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1566 | H6 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1567 | H7 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1568 | H8 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1569 | H9 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1570 | H10 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1571 | H11 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1572 | H12 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1573 | H13 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1574 | H14 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1575 | H15 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1576 | H16 value, If #1560=0, its value is the tool length compensation amount; otherwise, its value is the tool length wear amount | ⛔ do not write |
| #1577 | Tool Diamaters compensation Kinds | ⛔ do not write |
| #1578 | D1 value,If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1579 | D2 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1580 | D3 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1581 | D4 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1582 | D5 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1583 | D6 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1584 | D7 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1585 | D8 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1586 | D9 value, if #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1587 | D10 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1588 | D11 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1589 | D12 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1590 | D13 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1591 | D14 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1592 | D15 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1593 | D16 value, If #1577=0, its value is the tool diameter compensation amount; otherwise, its value is the tool diameters wear amount | ⛔ do not write |
| #1594-#1649 | Global variable area 2 (volatile) |  |
| #1650 | Output port master control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a read returns the whole output read-back word; a write is ignored (no error). Read-only. | ⛔ do not write |
| #1651 | Output port 1 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 0 at once (value truncated toward zero; no polarity applied), through the same output register as M3/M4/M8/M10. NOT storage. | ⛔ do not write |
| #1652 | Output port 2 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 1 at once (value truncated toward zero; no polarity applied), through the same output register as M3/M4/M8/M10. NOT storage. | ⛔ do not write |
| #1653 | Output port 3 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 2 at once (value truncated toward zero; no polarity applied), through the same output register as M3/M4/M8/M10. NOT storage. | ⛔ do not write |
| #1654 | Output port 4 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 3 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1655 | Output port 5 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 4 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1656 | Output port 6 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 5 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1657 | Output port 7 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 6 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1658 | Output port 8 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 7 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1659 | Output port 9 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 8 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1660 | Output port 10 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 9 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1661 | Output port 11 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 10 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1662 | Output port 12 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 11 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1663 | Output port 13 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 12 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1664 | Output port 14 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 13 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1665 | Output port 15 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 14 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1666 | Output port 16 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 15 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1667 | Output port 17 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 16 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1668 | Output port 18 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 17 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1669 | Output port 19 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 18 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1670 | Output port 20 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 19 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1671 | Output port 21 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 20 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1672 | Output port 22 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 21 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1673 | Output port 23 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 22 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1674 | Output port 24 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 23 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1675 | Output port 25 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 24 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1676 | Output port 26 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 25 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1677 | Output port 27 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 26 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1678 | Output port 28 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 27 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1679 | Output port 29 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 28 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1680 | Output port 30 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 29 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1681 | Output port 31 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a write drives output bit 30 at once, a read returns its read-back. NOT storage: never use as scratch. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1682 | Not storage: a write is ignored — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): the write is dropped with no error. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1683 | Input port master control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): a read returns the whole input word, read live; a write is ignored (no error). Read-only. | ⛔ do not write |
| #1684 | Input port 1 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 0 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1685 | Input port 2 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 1 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1686 | Input port 3 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 2 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1687 | Input port 4 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 3 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1688 | Input port 5 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 4 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1689 | Input port 6 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 5 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1690 | Input port 7 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 6 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1691 | Input port 8 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 7 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1692 | Input port 9 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 8 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1693 | Input port 10 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 9 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1694 | Input port 11 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 10 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1695 | Input port 12 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 11 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1696 | Input port 13 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 12 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1697 | Input port 14 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 13 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1698 | Input port 15 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 14 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1699 | Input port 16 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 15 live, the raw pin level (no active-level parameter applied); a write is ignored. Read-only, NOT storage. | ⛔ do not write |
| #1700 | Input port 17 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 16 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1701 | Input port 18 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 17 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1702 | Input port 19 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 18 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1703 | Input port 20 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 19 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1704 | Input port 21 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 20 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1705 | Input port 22 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 21 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1706 | Input port 23 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 22 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1707 | Input port 24 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 23 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1708 | Input port 25 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 24 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1709 | Input port 26 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 25 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1710 | Input port 27 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 26 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1711 | Input port 28 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 27 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1712 | Input port 29 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 28 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1713 | Input port 30 control register — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): reads input bit 29 live; a write is ignored. Read-only, NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1714-#1715 | Not storage: a write is ignored — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §11): the write is dropped with no error. The vendor list labels it 'Global variable area 2 (volatile)'. | ⛔ do not write |
| #1716-#1800 | Global variable area 2 (volatile) |  |
| #1801 | Active work system (a write selects it) — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §12): the executor sets the active WCS from a write (v + 54). NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. |  |
| #1802 | Buzzer: 1 = on, any other value = off — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §12): #1802 = 1 turns the buzzer on and leaves it on, 0 (or any value but exactly 1) turns it off; nothing turns it off at program end; it sounds only with Pr323 Enable of beep; a read does not return the buzzer state. NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. |  |
| #1803 | Global variable area 2 (volatile) |  |
| #1804 | Not storage: a write returns a stop code — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §12): the executor returns -2 on a write (a stop/end request is an inference, not read). The vendor list labels it 'Global variable area 2 (volatile)'. |  |
| #1805 | Not storage: a write is discarded — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §12): the executor formats the value into a buffer that is discarded. The vendor list labels it 'Global variable area 2 (volatile)'. |  |
| #1806-#1811 | Not storage: an executor flag — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §12): the executor writes it as a byte flag (the vendor home_*.nc macros use #1806-#1809). The vendor list labels it 'Global variable area 2 (volatile)'. |  |
| #1812-#1823 | Global variable area 2 (volatile) |  |
| #1824 | Current Tool Compensation Number |  |
| #1825-#1899 | Global variable area 2 (volatile) |  |
| #1900 | MarcoDialog (written by the dialog call) — Firmware 2025-04-04 (controllers/v4.1/FIRMWARE-RE-2025-04-04.md §12): the executor treats a write to #1900 as MarcoDialog. NOT storage. The vendor list labels it 'Global variable area 2 (volatile)'. |  |
| #1901-#1999 | Global variable area 2 (volatile) |  |
