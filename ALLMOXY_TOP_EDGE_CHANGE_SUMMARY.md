# Allmoxy Top Edge Report - Change Summary

## Current Tool

`C:\Users\kowsh\OneDrive\Desktop\index.html`

## What Was Done

- Reviewed and debugged the original standalone HTML calculator.
- Fixed CSV parsing for unquoted inch marks in material names.
- Restored missing materials such as Maple White rows.
- Corrected box math so parts are summed before converting to boxes.
- Added active/removed order management with multi-select dropdowns.
- Added drag-and-drop CSV import.
- Added simplified report labels:
  - Plywood
  - Solid
  - FAA
  - MDF / PBC
- Kept PVC, tape, and wood tape as top-edge values instead of category labels.
- Improved print title and timestamp.
- Removed/reduced browser print header/footer impact through print CSS.
- Improved print page alignment.
- Tuned top and bottom print margins for better page spacing.
- Added extra top spacing for printed pages after page one.
- Balanced print table column widths so the Done column does not push past the right margin.
- Added cut optimization for non-solid categories.
- Excluded FAA and Solid from sheet count/cut optimization.
- Improved print flow so cut optimization starts below its matching rip table when space allows.
- Made print cut optimization more compact with two-column pattern layout.
- Added optimized sheet totals beside rips totals.
- Simplified cut optimization rows for shop readability.
- Added **Sync Report to Saw** button.
- Configured saw sync endpoint: `http://server24:8787/sync-report`.
- Added saw-ready HTML report snapshot generation.
- Added sync payload summary with orders, parts, boxes, LF, rips, and sheets.
- Documented Task Scheduler setup for running the helper in the background.
- Added operator notes, development notes, and full system documentation.

## Verification

Latest verification against the Thursday Allmoxy CSV:

- JavaScript syntax check passed.
- Parsed `157` rows.
- Skipped `0` rows.
- Found `16` orders.
- Found `3` materials.
- Generated `40` report groups.
- Verified `1254` parts, `314` boxes, and `349` rips.
- Verified `2206` LF.
- Verified `20` total synced optimized sheets.
- Verified order remove/restore flow.
- Verified cut optimization output.
- Verified latest print margin and table-width CSS rules.
- Verified saw sync payload and saw-ready HTML generation.
- Verified helper endpoint concept using `localhost:8787` for same-machine calculator/helper setup.

Latest layout/import updates:

- CSV files can be dragged and dropped onto the import card.
- Cut Optimization is allowed to flow directly after the matching rip table.
- FAA and Solid do not show sheet counts or cut optimization.

## Task Scheduler Summary

Task name:

`Allmoxy Saw Sync Helper`

Program:

`C:\Users\kovas\AppData\Local\Programs\Python\Python313\python.exe`

Arguments:

`C:\AllmoxySawSync\sync_helper.py`

Start in:

`C:\AllmoxySawSync`

## Cut Optimization Rules

- Rips run in sheet length direction.
- Heights are packed across sheet width.
- Trim is `0.25"` from both width sides.
- Kerf is `0.188"`.
- Solid is excluded.

## Documentation Package

- `ALLMOXY_TOP_EDGE_USER_GUIDE.md`
- `ALLMOXY_TOP_EDGE_DEVELOPMENT_REFERENCE.md`
- `ALLMOXY_TOP_EDGE_TEAM_PRESENTATION.md`
- `ALLMOXY_TOP_EDGE_TEAM_PRESENTATION.html`
- `ALLMOXY_TOP_EDGE_CHANGE_SUMMARY.md`
- `index_backup_YYYY-MM-DD_HHMM.html`
