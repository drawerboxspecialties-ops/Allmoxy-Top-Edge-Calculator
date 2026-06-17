# Allmoxy Top Edge Calculator

Static browser app for converting Allmoxy CSV data into a top-edge production report for DBS Drawers.

## What It Does

- Imports Allmoxy CSV files in the browser.
- Parses drawer dimensions, quantities, materials, top edges, and order numbers.
- Groups report rows by top edge, material, and operator cut height.
- Calculates boxes, parts, rounded linear feet, rounded rips, and rip size.
- Categorizes rows into plywood, FAA, solid, and MDF/PBC/PVC/tape groups.
- Shows cut optimization patterns for non-solid and non-FAA categories.
- Prints a production report.
- Exports a CSV report.
- Optionally syncs the report to a local saw helper endpoint.

## Project Structure

- `index.html` is the working static app.
- `ALLMOXY_TOP_EDGE_FULL_DOCUMENTATION.md` is the full system reference.
- `ALLMOXY_TOP_EDGE_USER_GUIDE.md` is the user guide.
- `ALLMOXY_TOP_EDGE_OPERATOR_NOTES.md` is the shop-floor operator reference.
- `ALLMOXY_TOP_EDGE_DEVELOPMENT_NOTES.md` and `ALLMOXY_TOP_EDGE_DEVELOPMENT_REFERENCE.md` document development logic.
- `ALLMOXY_SAW_SYNC_TASK_SCHEDULER_SETUP.md` documents saw sync helper setup.
- `src/calculatorLogic.js` contains testable copies of high-risk pure calculator rules.
- `tests/calculatorLogic.test.js` covers parsing, material categorization, sheet-width, and cut optimization behavior.

## Run Locally

Open `index.html` directly in a browser, or serve it with a simple local server:

```bash
python -m http.server 8892
```

Then open:

```text
http://127.0.0.1:8892
```

## Run Tests

Install Node.js, then run:

```bash
npm install
npm test
```

## Important Logic Notes

- Box count for pre-calculated rows uses `Math.ceil(parts / 4)`.
- Non-pre-calculated rows calculate parts as `qty * 4`.
- Cut height rounds imported drawer height up to the next whole inch. It adds `0.2"` only for machined Bullnose/Flat/Foil top edges on Solid, Ply, or FAA materials; PVC/tape/banding edges, including `Flat PVC` and `PVC Flat Flush`, do not get the allowance.
- Linear feet are rounded up with `Math.ceil`.
- Rips are rounded up with `Math.ceil`.
- Birch and `(60)` materials use 60 inch sheets for optimization.
- Other non-solid materials use 48 inch sheets.
- Solid and FAA sides do not generate cut optimization groups.
- MDF/PBC/melamine materials do not offer Bullnose/Flat/Foil top edges; those combinations are flagged in the report for review. MDF/PBC with `Flat PVC` or `PVC Flat Flush` is allowed.
- PVC/tape/wood tape top edges route to the MDF/PBC/PVC/tape category even when the material contains plywood.

## Deployment

This repo is compatible with GitHub Pages because it is a static app.
