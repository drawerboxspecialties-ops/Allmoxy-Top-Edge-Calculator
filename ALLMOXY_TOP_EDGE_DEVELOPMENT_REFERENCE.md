# Allmoxy Top Edge Report - Development Reference

## Application

Primary file:

`C:\Users\kovas\Downloads\AllmoxyTopEdgeCalculator\index.html`

The application is a standalone offline HTML file using vanilla HTML, CSS, and JavaScript. It does not require a server or build step.

## Main Responsibilities

- Import Allmoxy CSV files.
- Support both file-picker and drag/drop CSV imports.
- Parse CSV rows, including unquoted inch marks in material names such as `PF: 5/8" Maple White (96.5)`.
- Extract order numbers.
- Let users remove and restore individual or multiple orders.
- Group rows into production departments.
- Calculate parts, boxes, LF, rips, sheet totals, and cut optimization.
- Render print-ready department pages.
- Export a CSV summary.

## Data Flow

1. `handleFileImport()`
   - Reads file-picker selection and delegates to `processCsvFile()`.

2. `setupCsvDropZone()`
   - Allows drag/drop CSV import.
   - Allows click/keyboard access to file picker.

3. `processCsvFile(file, fileInput)`
   - Validates `.csv` extension.
   - Reads the uploaded CSV.
   - Calls `parseCSV()`.
   - Appends parsed rows to `items`.
   - Adds discovered orders to `activeOrderIds`.
   - Updates status text.
   - Recalculates the report.

4. `parseCSV(text)`
   - Detects comma or tab delimiter.
   - Parses each row with quote-aware CSV logic.
   - Infers important columns:
     - quantity
     - width
     - depth
     - height
     - material
     - top edge
     - order
     - LF
     - rips
     - parts
   - Handles mixed files where some rows are pre-calculated and others are dimensional.

5. `calculateReport()`
   - Filters rows by active orders.
   - Groups by top edge, material, and operator cut height.
   - Routes groups to department categories.
   - Renders report tables and cut optimization.

## Important State

- `items`: all imported parsed rows.
- `computedGroups`: current grouped report rows.
- `activeOrderIds`: orders included in the report.
- `removedOrderIds`: orders excluded but available to restore.

## Parsing Rules

### Fractions

`parseFraction()` supports:

- Decimal values: `4.5`
- Fractions: `1/2`
- Mixed fractions: `4 1/2`
- Dash fractions: `4-1/2`
- Inch marks: `4.5"`
- Inch text: `4.5 in`

### CSV Quoting

The parser treats quote marks inside unquoted fields as normal text. This is required for material names like:

`PF: 5/8" Maple White (96.5)`

Without this, rows after that field can become misaligned and skipped.

## Cut Height Rounding

Before grouping, drawer heights are rounded up to the next whole inch. The calculator adds `0.2"` only for machined Bullnose/Flat/Foil top edges on Solid, Ply, or FAA materials. PVC, tape, wood tape, edgeband, and banding top edges do not receive the allowance:

```js
height = Math.ceil(parseFraction(heightValue)) + (materialQualifies && topEdgeQualifies ? 0.2 : 0);
```

If the row has no qualifying material/top-edge combination, the `0.2"` allowance is not added.

## Department Routing

Internal categories:

- `FAA SIDES`
- `PLYWOOD SIDES`
- `SOLID SIDES`
- `MDF / PBC / PVC & TAPE SIDES`

Displayed labels:

- `FAA`
- `Plywood`
- `Solid`
- `MDF / PBC`

Routing priority:

1. FAA material goes to FAA.
2. PVC, tape, and wood tape top edges route to MDF/PBC workflow.
3. Plywood or birch material routes to Plywood.
4. Solid wood species and `PF:` / `UF:` route to Solid.
5. MDF, PBC, melamine, and particle material route to MDF/PBC.
6. Unknown materials default to MDF/PBC.

## Parts And Boxes

For pre-calculated Allmoxy rows:

- Parts are summed first.
- Boxes are calculated after grouping:

```js
boxes = Math.ceil(totalParts / 4);
```

This avoids inflated totals from rounding each CSV line independently.

## Rips And LF

For pre-calculated rows:

- Imported LF and rips are summed.
- Displayed LF and rips are rounded up per grouped row.

For dimensional rows:

```js
perimeter = (2 * depth) + (2 * width);
lf = totalInches / 12;
rips = totalInches / ripSize;
```

Rip size:

- Baltic Birch: `60"`
- Other materials: `96.5"`

## Sheet And Cut Optimization

Cut optimization appears for eligible departments only.

Excluded departments:

- `SOLID SIDES`
- `FAA SIDES`

Constants:

- Trim per side: `0.25"`
- Total width trim: `0.5"`
- Kerf: `0.188"`

Usable sheet width:

```js
usableWidth = sheetWidth - (2 * 0.25);
```

Sheet width detection:

- Birch or `(60)` material: `60"`
- Otherwise: `48"`

Optimization model:

- Rips always run in the sheet length direction.
- The optimizer packs rip heights across usable sheet width.
- Each rip consumes its height.
- Kerf is added between rips on the same sheet.
- Solid categories are skipped.

Algorithm:

- Sort rip heights descending.
- Use best-fit packing into sheets.
- Summarize identical sheet patterns.

The report shows:

- Number of sheets using each pattern.
- Rip quantity chips in the format `10" - 5 rips`.
- Waste per pattern.

The category total row also displays the optimized sheet count beside the rips total for every non-solid category:

```text
112 (14 Sheets)
```

Print flow:

- The cut optimization block is appended immediately after the matching rip table in the DOM.
- Print CSS allows category groups and table containers to break naturally.
- The cut optimization block avoids starting on a new page unless the table fills the remaining page space.
- Cut pattern rows remain intact when a page break is required.
- Print layout uses two columns for cut patterns to reduce orphan rows.

## Print Behavior

Print CSS:

- Uses `@page { margin: 0; }`
- Adds print margin through body padding.
- Current body print padding is `0.35in 0.55in 0.28in 0.55in`.
- Uses `box-sizing: border-box` in print mode.
- Removes extra print margins from category wrappers and table containers.
- Uses fixed table layout in print mode so the print header, category header, table, and cut optimization section share the same left and right edges.
- Adds `0.18in` top padding to category pages after the first page to improve repeated header spacing.
- Adds print-specific report-table column widths so all nine columns, including `Done`, stay inside the print content width.
- Uses compact two-column print layout for cut optimization patterns.
- Hides input controls.
- Prints each category as a separate page group.
- Adds an internal print header with title, category, weekday, date, and time.

Browser headers and footers are controlled by the browser print dialog. Users should turn off **Headers and footers** if date, file path, or browser title appears.

## Export Behavior

`exportCSV()` exports:

- Active order note.
- Category.
- Top edge.
- Material.
- Boxes.
- Parts.
- Height.
- Rounded LF.
- Rounded rips.
- Rip size.
- Total batch row.

Category labels in export use the simplified display names.

## Saw Sync Integration

The calculator includes a **Sync Report to Saw** button:

```html
<button class="btn btn-secondary" id="btn-sync-saw">Sync Report to Saw</button>
```

The sync endpoint is:

```js
const SAW_SYNC_URL = "http://localhost:8787/sync-report";
```

Relevant functions:

- `getSawSheetTotal()`: totals optimized sheet quantities across non-solid categories.
- `getSawSummary()`: returns parts, boxes, LF, rips, and sheet totals.
- `buildSawReportHtml()`: creates a standalone saw-ready HTML report snapshot.
- `syncReportToSaw()`: posts the active report to the helper service.

Payload sent to the helper:

```json
{
  "title": "Allmoxy Top Edge Report",
  "orders": ["601893", "602042"],
  "summary": {
    "parts": 1254,
    "boxes": 314,
    "lf": 2206,
    "rips": 349,
    "sheets": 20
  },
  "html": "<!DOCTYPE html>...",
  "syncedBy": "Windows User"
}
```

Expected helper behavior:

- Runs on `server24`.
- Receives POST requests at `/sync-report`.
- Saves report HTML to the shared saw folder on `server22`.
- Updates `index.json` for the saw dashboard.

Shared saw folder:

`\\server22\SHARE\Data\Cabinet Vision\Biesse Selco\Allmoxy Top Edge Reports`

## Latest Validation Snapshot

Validated against:

`C:\Users\kovas\Downloads\thursday all-Top Edge Report.csv`

Results:

- Parsed rows: `157`
- Skipped rows: `0`
- Orders found: `16`
- Materials found:
  - `PF: 1/2" Maple White (96.5)`
  - `PF: 12MM Baltic Birch Ply (60)`
  - `PF: 5/8" Maple White (96.5)`
- Report groups: `40`
- Total parts: `1254`
- Total boxes: `314`
- Total LF: `2206`
- Total rips: `349`
- Total synced optimized sheets: `20`
- Remove/restore order flow verified.
- Cut optimization output verified.
- Print width/margin rules verified in CSS.
- Saw sync payload and saw-ready report HTML verified.
