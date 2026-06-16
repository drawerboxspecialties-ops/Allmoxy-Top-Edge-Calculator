# Allmoxy Top Edge Report
## Team Presentation

---

## 1. What We Built

A standalone browser-based production report tool for Allmoxy top edge CSV exports.

It helps the shop:

- Import Allmoxy CSV files.
- Drag and drop CSV files into the calculator.
- Group drawer-side work by department.
- Remove or restore orders before printing.
- Print clean department sheets.
- Export a summarized CSV.
- See compact cut optimization guidance.
- Sync the active report to the saw dashboard.

---

## 2. Why It Matters

Before this update, operators had to manually interpret material groups, decide which orders belonged in a batch, and estimate cut layouts.

The updated tool reduces manual decisions by:

- Showing only active orders.
- Keeping removed orders easy to restore.
- Calculating parts, boxes, LF, rips, and sheet counts.
- Suggesting optimized rip layouts.

---

## 3. Main Workflow

1. Upload Allmoxy CSV.
   - Upload button or drag/drop.
2. Review import status.
3. Remove any orders not needed.
4. Restore orders if needed.
5. Review grouped report.
6. Review cut optimization.
7. Print, export, or sync to saw.

---

## 4. Order Management

The tool now includes dropdown multi-select controls:

- **Delete Orders From Report**
- **Restore Removed Orders**

This lets the operator remove or add back multiple orders at once.

---

## 5. Report Labels

Department labels were simplified for readability:

- Plywood
- Solid
- FAA
- MDF / PBC

PVC and wood tape remain visible in the **Top Edge** column, not as category labels.

---

## 6. Calculation Fixes

Important fixes made:

- CSV rows with inch marks in material names now parse correctly.
- Missing Maple materials now import correctly.
- Parts are summed before converting to boxes.
- `290` parts now calculates correctly instead of being inflated by row-by-row rounding.

---

## 7. Cut Optimization

The tool now shows cut guidance for non-solid materials.

Rules:

- Rips run lengthwise.
- Heights are packed across sheet width.
- Trim is `0.25"` on both sheet-width sides.
- Kerf is `0.188"`.
- Solid and FAA materials are skipped.

---

## 8. How To Read Cut Optimization

Example:

`3 sheets`

`10" - 5 rips`

`4.5" - 1 rip`

`Waste 4.06"`

Meaning:

Cut 3 sheets using that same rip layout.

The rips total also shows total optimized sheet quantity:

`112 (14 Sheets)`

---

## 9. Print Improvements

The printed sheets now include:

- Allmoxy Top Edge Report heading.
- Department name.
- Weekday, date, and time.
- Clean category table.
- Compact cut optimization section.
- Aligned title, department header, table, and optimization block.
- Tuned top and bottom print margins for better page use.
- Extra top spacing on printed pages after page one.
- Balanced print column widths so the right margin and Done column stay aligned.
- Cut optimization starts after its matching rip table and uses compact two-column print layout.

---

## 10. Validation

The latest tool was checked against the Thursday Allmoxy CSV:

- `157` rows imported.
- `0` rows skipped.
- `16` orders found.
- `3` materials found.
- `40` report groups generated.
- `1254` total parts.
- `314` total boxes.
- `2206` total LF.
- `349` total rips.
- `20` total synced optimized sheets.
- Remove and restore order flow verified.
- Cut optimization output verified.
- Saw sync payload verified.
- Drag/drop CSV import added.
- FAA and Solid excluded from sheet count/cut optimization.

---

## 11. Saw Sync

The calculator now has a **Sync Report to Saw** button.

It sends the active report to:

`http://server24:8787/sync-report`

The helper saves report files into:

`\\server22\SHARE\Data\Cabinet Vision\Biesse Selco\Allmoxy Top Edge Reports`

The saw operator opens the dashboard from that shared folder.

The helper is kept running by Windows Task Scheduler on `server24`.

---

## 12. Task Scheduler Setup

Task name:

`Allmoxy Saw Sync Helper`

Program:

`C:\Users\kovas\AppData\Local\Programs\Python\Python313\python.exe`

Arguments:

`C:\AllmoxySawSync\sync_helper.py`

Start in:

`C:\AllmoxySawSync`

Validation:

`Test-NetConnection localhost -Port 8787`

Note: Browser headers and footers must be disabled in the browser print dialog if file path or browser date appears.

---

## 13. Files Saved

- Main tool: `index.html`
- User guide: `ALLMOXY_TOP_EDGE_USER_GUIDE.md`
- Development reference: `ALLMOXY_TOP_EDGE_DEVELOPMENT_REFERENCE.md`
- Backup: `index_backup_YYYY-MM-DD_HHMM.html`

---

## 14. Next Improvements

Possible future improvements:

- Add editable sheet size settings.
- Add export for cut optimization.
- Add operator-friendly print presets.
- Add saved shop defaults for kerf and trim.
- Improve optimization with exact knapsack search for even lower waste.
