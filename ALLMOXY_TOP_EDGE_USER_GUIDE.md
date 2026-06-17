# Allmoxy Top Edge Report - User Guide

## Purpose

The Allmoxy Top Edge Report is an offline HTML tool for importing Allmoxy CSV exports, grouping drawer-side top edge work by shop routing category, printing production sheets, exporting CSV summaries, and showing compact cut optimization guidance.

## Basic Workflow

1. Open `index.html` in a browser.
2. Click **Upload Allmoxy CSV** or drag/drop the CSV onto the drop zone.
3. Review the import status. It shows imported row count, material count, and skipped rows if any.
4. Use **Delete Orders From Report** if an order should be excluded.
5. Use **Restore Removed Orders** if an excluded order needs to be added back.
6. Review the live report.
7. Print, export CSV, or click **Sync Report to Saw**.

## Order Controls

- Active orders appear in a multi-select dropdown.
- Select one or more active orders and click **Remove Selected** to exclude them from the report.
- Removed orders appear in a restore dropdown.
- Select one or more removed orders and click **Restore Selected** to add them back.

## Report Sections

Visible labels are simplified for readability:

- `Plywood`
- `Solid`
- `FAA`
- `MDF / PBC`

PVC, tape, and wood tape are treated as top-edge types and route with the MDF/PBC workflow. They still appear in the **Top Edge** column.

## Cut Optimization

For every non-solid and non-FAA report section, the tool shows a compact **Cut Optimization** block.

Cut heights shown in the report follow the saw operator rule:

- Round drawer height up to the next whole inch.
- Add `0.2"` only for Bullnose, Flat, or Foil top edges on Solid, Ply, or FAA material.
- Do not add the `0.2"` allowance for PVC, tape, wood tape, edgeband, or banding top edges, including `Flat PVC` and `PVC Flat Flush`.
- Example: `4.25"` Baltic Birch with Clear Foil Bullnose reports as `5.2"`.
- Example: `5"` Baltic Birch with PVC Tape reports as `5"`.
- Example: `5"` PBC with PVC Flat Flush reports as `5"` and is allowed.

Rules used:

- Rips run in the sheet length direction.
- Rip heights are packed across sheet width.
- Trim is `0.25"` from both sides of sheet width.
- Kerf is `0.188"`.
- Solid sections are excluded.
- FAA sections are excluded.

The optimization block shows:

- Material and top edge.
- Total optimized sheet count.
- Usable sheet width.
- Repeated sheet patterns.
- Waste for each pattern.

Example:

`3 sheets | 10" - 5 rips | 4.5" - 1 rip | Waste 4.06"`

The total row beside **Rips** also shows the optimized sheet quantity for every non-solid category.

Example:

`112 (14 Sheets)`

## Printing Notes

The report includes its own professional print header with:

- `Allmoxy Top Edge Report`
- Department label
- Weekday, date, and time

If the browser still prints extra date/title/file path lines, turn off **Headers and footers** in the browser print dialog.

The print layout has been aligned so the report title, department header, table, and optimization block share the same left and right edges.

Current print spacing is tuned for better page use:

- Top: `0.35in`
- Right: `0.55in`
- Bottom: `0.28in`
- Left: `0.55in`

Printed pages after the first page get an extra `0.18in` of top spacing so repeated page headers do not sit too close to the top edge.

The print table uses fixed print-only column widths so the **Done** column stays inside the report and the left/right margins remain visually even.

Cut Optimization is attached directly after its matching rip table in print. If the table fills the page, only the overflow continues to the next page.

## Saw Sync

The calculator includes a **Sync Report to Saw** button.

It sends the active report to:

`http://localhost:8787/sync-report`

The sync payload includes:

- Active orders
- Parts
- Boxes
- LF
- Rips
- Optimized sheet total
- A saw-ready HTML report snapshot

The helper running on `server24` saves the report into the shared saw folder:

`\\server22\SHARE\Data\Cabinet Vision\Biesse Selco\Allmoxy Top Edge Reports`

The saw operator opens the dashboard from that shared folder.
