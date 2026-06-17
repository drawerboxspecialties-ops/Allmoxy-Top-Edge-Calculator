# Allmoxy Top Edge Calculator - Operator Notes

## Daily Use

1. Open the calculator in Chrome on `server24`.
2. Upload the Allmoxy Top Edge CSV with the upload button or drag/drop it into the CSV drop zone.
3. Confirm import status shows rows and materials.
4. Remove orders that should not go to the saw report.
5. Restore orders if needed.
6. Review each department page.
7. Use **Sync Report to Saw** for paperless saw access.
8. Print only if a paper copy is needed.

## Order Controls

- Use **Delete Orders From Report** to remove one or more orders.
- Use **Restore Removed Orders** to add them back.
- The report recalculates immediately after changes.

## Cut Optimization Notes

Cut optimization is a suggested sheet layout.

It is shown for eligible non-solid/non-FAA sections only. Solid and FAA do not show sheet count or cut optimization.

Cut heights are operator cut heights:

- Drawer heights round up to the next whole inch.
- Bullnose, Flat, and Foil top edges add `0.2"` allowance on Solid, Ply, and FAA material.
- PVC, tape, wood tape, edgeband, and banding top edges do not add `0.2"`. This includes `Flat PVC` and `PVC Flat Flush`.
- MDF/PBC/melamine materials should not have Bullnose, Flat, or Foil top edges. If they appear, the report flags them as unsupported for review.
- Example: `4.25"` Baltic Birch with Clear Foil Bullnose reports as `5.2"`.
- Example: `5"` Baltic Birch with PVC Tape reports as `5"`.
- Example: `5"` PBC with PVC Flat Flush reports as `5"` and is allowed.

Example:

```text
3 sheets
10" - 5 rips
4.5" - 1 rip
Waste 4.06"
```

This means use the same layout on 3 sheets.

## Saw Sync Notes

The **Sync Report to Saw** button sends the current active report to the helper on the same computer:

`http://localhost:8787/sync-report`

If sync fails:

1. Check helper is running.
2. Run:

```powershell
Test-NetConnection localhost -Port 8787
```

Expected:

```text
TcpTestSucceeded : True
```

3. If false, start or fix the scheduled task.

## Print Notes

If Chrome prints extra browser date, page title, or file path:

- Open print dialog.
- Turn off **Headers and footers**.

If a later page header is too close to the top, the CSS has a page-two spacing rule:

```css
.category-print-group:not(:first-of-type) {
    padding-top: 0.18in !important;
}
```

Cut Optimization should print directly below its matching rip table when there is enough page space. If the rip table reaches the bottom of the sheet, the remaining optimization rows continue onto the next page.
