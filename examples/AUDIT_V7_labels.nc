( AUDIT V7 - V4.1 - label DIGITS. August S5c branched with GOTO1/N1; every jump this week used a 2-digit label. NO MOTION )
( part 1: IF..GOTO forward to N3. READ #191=1 and #190=0 means it branched; #190=111 means it fell through )
( part 2: a 3-pass loop on N4 with IF..GOTO back. READ #193=3 means it looped; #193=0 and #192=1 means the back-jump halted )
( part 3: IF..GOTO forward to the 2-digit N12. READ #197=1 and #196=0 means 2-digit labels work; #196=111 fell through; both 0 = halted there )
( READ #195=209 means the file ran; #194=5678 means parts 1-2 completed )
#195 = 209
#190 = 0
#191 = 0
#192 = 0
#193 = 0
#194 = 0
#196 = 0
#197 = 0
IF #190==0GOTO3
#190 = 111
N3
#191 = 1
N4
#192 = [#192 + 1]
IF #192<3GOTO4
#193 = #192
#194 = 5678
IF #194==5678GOTO12
#196 = 111
N12
#197 = 1
M30
