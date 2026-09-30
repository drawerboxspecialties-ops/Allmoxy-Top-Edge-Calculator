# Allmoxy Top Edge Calculator

Static browser app that turns an Allmoxy top-edge CSV into a shop report: parts, boxes, cut heights, linear feet, rips, and cut layouts.

Live site: https://drawerboxspecialties-ops.github.io/Allmoxy-Top-Edge-Calculator/

## Files

| File | What it is |
| --- | --- |
| `index.html` | The app. Open this. All UI and report rules used in the browser live here. |
| `src/calculatorLogic.js` | The same pure rules, extracted so they can be tested. Keep this in step with `index.html` when a rule changes. |
| `tests/calculatorLogic.test.js` | Tests for those rules. |
| `REFERENCE.md` | How the report is calculated, printed, and fixed. |
| `ALLMOXY_SAW_SYNC_TASK_SCHEDULER_SETUP.md` | How the saw helper is kept running on `server24`. |

## Run

Open `index.html` in a browser, or:

```bash
python -m http.server 8892
```

Then open `http://127.0.0.1:8892`.

## Test

```bash
npm install
npm test
```

## Change a rule

1. Change the function in `index.html`.
2. Make the same change in `src/calculatorLogic.js`.
3. Add or update a test.
4. Run `npm test`.
5. Import a real CSV and print one department page.

Do not edit only one copy of a rule. The browser never loads `calculatorLogic.js`.
