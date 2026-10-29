( AUDIT V9 - V4.1 Macro Mode #122=1 - the KERNELS' exact spaced jump form, never measured: spaces around the comparator and a space before GOTO. NO MOTION )
( READ #195=316 means the file ran; #191=1 and #190=0 means the spaced jump branched; #190=111 means it fell through; both 0 = halted at the IF )
( part 2: the kernels' clamp shape as the dialect will declare it, the NEGATED test skips the assign: IF #192 <= 3 GOTO4 then #192=3 then N4. From 5, READ #192=3 means the clamp held )
( READ #194=5678 means the end was reached )
#195 = 316
#190 = 0
#191 = 0
#192 = 5
#194 = 0
IF #190 <= 0 GOTO3
#190 = 111
N3
#191 = 1
IF #192 <= 3 GOTO4
#192 = 3
N4
#194 = 5678
M30
