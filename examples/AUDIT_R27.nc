( AUDIT R27 - V4.1 - program and dialog in ONE file. NO MOTION )
;  { FRAMEWIN_CreateIndirect, "9", ID_FRAMEWIN_0, 2, 101, 1020, 360, 0, 100, 1 },
;  { BUTTON_CreateIndirect, "Button", ID_BUTTON_0, 780, 250, 100, 45, 0, 0, 0 },
;  { BUTTON_CreateIndirect, "Button", ID_BUTTON_1, 900, 250, 100, 45, 0, 0, 0 },
;  { TEXT_CreateIndirect, "Text", ID_TEXT_0, 2, 28, 1024, 32, 0, 100, 0 },
;  { TEXT_CreateIndirect, "Text", ID_TEXT_1, 12, 75, 1024, 32, 0, 100, 0 },
;  { TEXT_CreateIndirect, "Text", ID_TEXT_2, 12, 115, 1024, 32, 0, 100, 0 },
;  { TEXT_CreateIndirect, "Text", ID_TEXT_3, 12, 155, 1024, 32, 0, 100, 0 },
;    FRAMEWIN_SetFont(hItem, GUI_FONT_24B_ASCII);
;    FRAMEWIN_SetText(hItem, "One`file");
;    hItem = WM_GetDialogItem(pMsg->hWin, ID_BUTTON_0);
;    BUTTON_SetText(hItem, "Ok");
;    BUTTON_SetFont(hItem, GUI_FONT_24B_ASCII);
;    hItem = WM_GetDialogItem(pMsg->hWin, ID_BUTTON_1);
;    BUTTON_SetText(hItem, "Cancel");
;    BUTTON_SetFont(hItem, GUI_FONT_24B_ASCII);
;    hItem = WM_GetDialogItem(pMsg->hWin, ID_TEXT_0);
;    TEXT_SetTextAlign(hItem, GUI_TA_LEFT | GUI_TA_VCENTER);
;    TEXT_SetText(hItem, "Program`and`dialog`in`ONE`file");
;    TEXT_SetFont(hItem, GUI_FONT_24B_ASCII);
;    hItem = WM_GetDialogItem(pMsg->hWin, ID_TEXT_1);
;    TEXT_SetTextAlign(hItem, GUI_TA_LEFT | GUI_TA_VCENTER);
;    TEXT_SetFont(hItem, GUI_FONT_24B_ASCII);
;    TEXT_SetText(hItem, "R27`works");
;    hItem = WM_GetDialogItem(pMsg->hWin, ID_TEXT_2);
;    TEXT_SetTextAlign(hItem, GUI_TA_LEFT | GUI_TA_VCENTER);
;    TEXT_SetFont(hItem, GUI_FONT_24B_ASCII);
;    TEXT_SetText(hItem, "hold`Ok");
;    hItem = WM_GetDialogItem(pMsg->hWin, ID_TEXT_3);
;    TEXT_SetTextAlign(hItem, GUI_TA_LEFT | GUI_TA_VCENTER);
;    TEXT_SetFont(hItem, GUI_FONT_24B_ASCII);
;    TEXT_SetText(hItem, "");
M5
#195 = 337
#192 = 0
#194 = 0
#100 = 0
MarcoDialog "/local/AUDIT_R27.nc"
#192 = 1
#194 = 5678
M30
