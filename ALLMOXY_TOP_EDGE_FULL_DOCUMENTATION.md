# Allmoxy Top Edge Calculator - Full Documentation

## Location

Active calculator:

`C:\Users\kowsh\OneDrive\Desktop\Allmoxy Top Edge Calculator\index.html`

Shared saw report folder:

`\\server22\SHARE\Data\Cabinet Vision\Biesse Selco\Allmoxy Top Edge Reports`

Saw sync helper machine:

`server24`

Saw sync endpoint:

`http://localhost:8787/sync-report`

The calculator and helper currently run on the same machine, so the calculator uses `localhost`.

## What The Calculator Does

The calculator is a standalone offline HTML application. It imports Allmoxy Top Edge CSV files, groups rows by production category, calculates boxes/parts/LF/rips/sheets, prints clean department reports, exports CSV, and syncs a saw-ready report to the saw dashboard helper.

## Main Workflow

1. Open `index.html` in Chrome on `server24`.
2. Upload the Allmoxy CSV using **Upload Allmoxy CSV** or drag/drop the CSV onto the drop zone.
3. Review import status.
4. Remove unwanted orders using the multi-select order dropdown.
5. Restore removed orders if needed.
6. Review report, totals, and cut optimization.
7. Print, export CSV, or click **Sync Report to Saw**.

## Categories

Internal routing categories:

- `PLYWOOD SIDES`
- `SOLID SIDES`
- `FAA SIDES`
- `MDF / PBC / PVC & TAPE SIDES`

Displayed labels:

- `Plywood`
- `Solid`
- `FAA`
- `MDF / PBC`

PVC, tape, and wood tape appear in the **Top Edge** column and route with the MDF/PBC workflow.

## Important Fixes Completed

- Fixed CSV parsing for unquoted inch marks in material names.
- Fixed missing Maple White material rows.
- Fixed parts-to-box math by summing parts before converting to boxes.
- Added drag-and-drop CSV importing.
- Added active/removed order controls.
- Added print title, department labels, weekday/date/time stamp.
- Tuned print margins and page spacing.
- Balanced print table column widths so the Done column stays inside the report.
- Adjusted print page-break rules so cut optimization starts immediately after its matching rip table when space allows.
- Made print cut optimization more compact with two-column pattern rows.
- Added cut optimization for non-solid categories.
- Added total sheet count beside rips totals.
- Added saw sync button and payload generation.

## Print Setup

Print CSS uses:

- `@page { margin: 0; }`
- Body padding: `0.35in 0.55in 0.28in 0.55in`
- Additional `0.18in` top padding for printed category pages after page one.
- Fixed print table column widths for all 9 report columns.

If browser date/file path headers appear, turn off **Headers and footers** in Chrome print settings.

## Cut Optimization

Cut optimization appears for all non-solid categories.

Rules:

- Rips run in sheet length direction.
- Rip heights pack across sheet width.
- Trim is `0.25"` on both width sides.
- Kerf is `0.188"`.
- Solid is excluded.
- FAA is excluded.

Print behavior:

- The rip table is allowed to split naturally.
- The cut optimization block is not forced onto a separate sheet.
- Cut pattern rows stay together when a page break is required.
- Print patterns use a compact two-column layout to reduce wasted page space.

Display format:

```text
3 sheets
10" - 5 rips
4.5" - 1 rip
Waste 4.06"
```

The report total row also shows sheet quantity beside rips:

```text
112 (14 Sheets)
```

## Saw Sync

The calculator button **Sync Report to Saw** posts JSON to:

`http://localhost:8787/sync-report`

Payload includes:

- Title
- Active orders
- Summary: parts, boxes, LF, rips, sheets
- Standalone saw-ready HTML report
- Synced-by value

The helper saves reports to the server22 shared saw folder and updates `index.json` for the saw dashboard.

## Saw Operator Workflow

The saw operator opens:

`\\server22\SHARE\Data\Cabinet Vision\Biesse Selco\Allmoxy Top Edge Reports\saw_dashboard.html`

The dashboard should show synced reports by date/time and let the operator open the full report.

## Latest Validation Snapshot

Validated against:

`C:\Users\kowsh\Downloads\thursday all-Top Edge Report.csv`

Results:

- Parsed rows: `157`
- Skipped rows: `0`
- Orders: `16`
- Materials: `3`
- Report groups: `40`
- Parts: `1254`
- Boxes: `314`
- LF: `2206`
- Rips: `349`
- Synced optimized sheets: `20`
- Order remove/restore verified.
- Cut optimization verified.
- Saw sync payload verified.
- JavaScript syntax verified.
