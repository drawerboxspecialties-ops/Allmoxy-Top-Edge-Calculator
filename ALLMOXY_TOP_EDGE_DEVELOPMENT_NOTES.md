# Allmoxy Top Edge Calculator - Development Notes

## Architecture

The calculator is a single-file vanilla HTML application:

`index.html`

No build step is required.

## Core State

```js
let items = [];
let computedGroups = [];
let activeOrderIds = [];
let removedOrderIds = [];
let removedMaterials = [];
let removedTopEdges = [];
const SAW_SYNC_URL = "http://localhost:8787/sync-report";
```

## Key Functions

- `parseCSV(text)`: parses Allmoxy CSV text.
- `processCsvFile(file, fileInput)`: shared file-processing path for file picker and drag/drop imports.
- `setupCsvDropZone()`: wires drag/drop, click, and keyboard upload behavior.
- `parseFraction(value)`: parses decimals, fractions, mixed fractions, and inch text.
- `getCutHeight(height, topEdge)`: rounds drawer height to a whole-inch operator cut height and adds `0.2"` when a top edge is present.
- `getMaterialCategory(material, topEdge)`: routes groups to departments.
- `calculateReport()`: filters active orders, groups rows, calculates totals, renders report.
- `getCutOptimizationGroups(list, catName)`: builds optimization groups for non-solid categories.
- `packRipHeights(heights, usableWidth, kerf)`: packs rip heights across sheet width.
- `renderCutOptimization(list, catName)`: renders compact cut layouts.
- `getSawSummary()`: builds saw sync totals.
- `buildSawReportHtml()`: builds standalone report HTML for the saw dashboard.
- `syncReportToSaw()`: sends the report payload to the helper.

## CSV Parsing Detail

The parser intentionally treats quote marks inside unquoted fields as normal text. This is required for materials such as:

`PF: 5/8" Maple White (96.5)`

Without this, row columns shift and materials are skipped.

## Box Calculation

Pre-calculated Allmoxy parts are summed first. Boxes are calculated after grouping:

```js
boxes = Math.ceil(parts / 4);
```

Do not return to row-by-row box rounding. That inflates totals.

## Cut Height Calculation

Operators cut top-edge rips to whole-number heights, not half-inch increments. Before grouping, the calculator rounds the imported drawer height up to the next whole inch. If the row has any top edge value, it adds `0.2"` for top-edge allowance.

```js
height = Math.ceil(parsedHeight) + (topEdge ? 0.2 : 0);
```

Examples:

- `4.25"` with top edge -> `5.2"`
- `5"` with top edge -> `5.2"`
- `5.01"` with top edge -> `6.2"`

## Cut Optimization Detail

Constants:

```js
kerf = 0.188;
trimPerSide = 0.25;
usableWidth = sheetWidth - (2 * trimPerSide);
```

Excluded categories:

- `SOLID SIDES`
- `FAA SIDES`

Sheet width:

- Birch or `(60)` material: `60"`
- Other non-solid material: `48"`

The optimizer is best-fit decreasing:

1. Expand each group into individual rip heights.
2. Sort heights largest to smallest.
3. Place each rip into the sheet that leaves the least remaining width.
4. Create a new sheet if none fits.
5. Summarize repeated sheet patterns.

Print layout:

- `.category-print-group` and `.grid-container` use `page-break-inside: auto` so the cut optimization is not pushed to a separate sheet as one block.
- `.cut-optimization` uses `page-break-before: avoid` and compact spacing.
- `.cut-pattern-list` prints as two columns.
- Individual `.cut-pattern` rows use `break-inside: avoid` for readability.

## Saw Sync Detail

The browser sends:

```json
{
  "title": "Allmoxy Top Edge Report",
  "orders": [],
  "summary": {
    "parts": 0,
    "boxes": 0,
    "lf": 0,
    "rips": 0,
    "sheets": 0
  },
  "html": "<!DOCTYPE html>...",
  "syncedBy": "Windows User"
}
```

Endpoint:

`http://localhost:8787/sync-report`

This is correct because the helper and calculator are both running on `server24`.

If the helper moves to a different machine, change `SAW_SYNC_URL`.

## Print Layout Detail

Important print CSS:

```css
@page {
    size: letter;
    margin: 0;
}

body {
    padding: 0.35in 0.55in 0.28in 0.55in !important;
}
```

Page two and later:

```css
.category-print-group:not(:first-of-type) {
    padding-top: 0.18in !important;
}
```

Report table uses fixed print-only widths to prevent the Done column from overflowing.

## Maintenance Checklist

After any change:

1. Run JavaScript syntax validation.
2. Import the Thursday CSV.
3. Confirm `157` rows and `0` skipped rows.
4. Confirm materials include both Maple White materials and Baltic Birch.
5. Confirm order remove/restore works.
6. Confirm cut optimization has no `Make` or `height` wording.
7. Confirm Solid and FAA do not show sheet counts or cut optimization.
8. Confirm drag/drop CSV import works.
9. Confirm cut optimization starts below its matching rip table in print preview when space allows.
10. Confirm saw sync payload builds.
11. Confirm the commit is pushed so Git contains the version backup.
