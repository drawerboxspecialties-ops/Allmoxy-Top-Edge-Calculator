# Allmoxy Top Edge Calculator — Reference

The browser app is `index.html`. `src/calculatorLogic.js` mirrors the pure rules for tests. If those two disagree, the browser follows `index.html`.

## Daily use

1. Upload or drop an Allmoxy CSV.
2. Remove or restore orders from the order lists if needed.
3. Use **Filter Out Rows** to drop an order, material, or top edge from this session. Check **Add removed rows back to CSV export** only when the export should include them again.
4. Print or export CSV.

Printed department names are Plywood, Solid, FAA, and MDF / PBC. Each department starts on its own page. Rows at `13"` or taller are highlighted.

Turn off **Headers and footers** in the Chrome print dialog. The report already prints its own title, department, and timestamp.

## CSV the app expects

Header row:

`TOP EDGE, MATERIAL, PARTS, HEIGHT, LF, RIPS, Order`

A row is used when parts, LF, or rips is present. Those rows are pre-calculated: the app keeps the imported LF and rips, and does not rebuild them from width and depth.

If a file instead has quantity, width, depth, and height, the app treats it as dimensional:

- parts = quantity × 4
- inches = (2 × width + 2 × depth) × quantity
- LF = inches / 12
- rips = inches / rip length

Inch marks inside material names, such as `5/8"`, are normal text. The parser must not treat them as quotes.

## Report math

Grouping key: top edge + material + cut height.

| Value | Rule |
| --- | --- |
| Cut height | Round the imported height up to the next whole inch. Add `0.2"` only when both the material and the top edge qualify. |
| Boxes | `ceil(parts / 4)` after parts are summed. Do not round each CSV line to boxes first. |
| LF and rips | Sum first, then `ceil` for the row shown on the report. |
| Rip length | `60"` for Baltic birch that is not FAA. `96.5"` for everything else. |
| Sheet width | `60"` when the material contains `birch` or `(60)`. Otherwise `48"`. |

Material qualifies for the `0.2"` allowance when the name is FAA, ply, birch, or a solid species (including names that start with `PF:` or `UF:`).

Top edge qualifies when it is bullnose, flat, or foil, and it is not PVC, tape, or banding. `Flat PVC` and `PVC Flat Flush` do not get the allowance.

Examples:

- `4.25"` birch with Clear Foil Bullnose → `5.2"`
- `5"` birch with PVC tape → `5"`
- `5"` PBC with PVC Flat Flush → `5"`

MDF, PBC, melamine, or particle board with a bullnose, flat, or foil edge is flagged **Unsupported for MDF/PBC**. PVC on those materials is allowed.

## Departments

Checked in this order:

1. Material contains `FAA` → FAA. No cut optimization.
2. Top edge contains PVC, tape, or wood tape → MDF / PBC, even if the substrate is plywood.
3. Material contains `ply` or `birch` → Plywood.
4. Material starts with `UF` or `PF`, or names a solid species → Solid. No cut optimization.
5. Anything else, including MDF and PBC → MDF / PBC.

## Cut optimization

Built for Plywood and MDF / PBC only.

- Rips run along the sheet length.
- Heights pack across the sheet width.
- Trim is `0.25"` on each side of the width. Usable width = sheet width − `0.5"`.
- Kerf between rips is `0.188"`.
- Heights are packed largest first, best fit.
- The rips total shows the sheet count, for example `112 (14 Sheets)`.

## Print layout

Print CSS is the `@media print` block in `index.html`. Current page box:

```css
@page {
    size: letter;
    margin: 0.45in 0.5in 0.4in 0.5in;
}
```

Body padding is `0`. Margins come from `@page`, so a page that continues cut optimization still has an inset.

Material names wrap inside the material column (`32%`). Do not set the material badge back to `white-space: nowrap` in print; that is what made long names cover the next columns.

Cut optimization:

- Sits directly under its department table.
- A pattern row stays on one page.
- A long group may continue on the next page.
- Patterns print in two columns: sheet count, rip chips, waste.

## Where to edit

| Change | Where |
| --- | --- |
| Cut height, departments, sheet width, rip length, packing | The matching functions in `index.html` and `src/calculatorLogic.js` |
| Print columns, wrapping, page margins | `@media print` in `index.html` |
| Tests | `tests/calculatorLogic.test.js` |

After a rule change, run `npm test`, import a current CSV, and print one department.

## Session sheet and rip overrides

The working copy of `index.html` has a **Material Sheet & Rip Length** panel. It is not in the published GitHub commit yet. Do not delete it while cleaning the repo.

- Choices are `48` or `60` for sheet width, and `60` or `96.5` for rip length. Blank means use the default rule.
- Overrides last for the browser session only.
- A rip-length override recalculates rips from LF on pre-calculated rows: `(LF × 12) / rip length`.
- The material cell shows an **Override** note when one is active.
- The same helpers are in `src/calculatorLogic.js` and covered by `tests/calculatorLogic.test.js`.
