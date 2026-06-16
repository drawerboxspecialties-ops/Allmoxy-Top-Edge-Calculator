# Allmoxy Saw Sync - Task Scheduler Setup

## Purpose

The saw sync helper must keep running so the calculator can post reports to:

`http://localhost:8787/sync-report`

Task Scheduler runs the helper in the background so a manual CMD window does not need to stay open.

## Current Machine

Helper and calculator machine:

`server24`

Shared saw folder:

`\\server22\SHARE\Data\Cabinet Vision\Biesse Selco\Allmoxy Top Edge Reports`

Helper script:

`C:\AllmoxySawSync\sync_helper.py`

Python path found on the machine:

`C:\Users\kovas\AppData\Local\Programs\Python\Python313\python.exe`

## Create Task

Open **Task Scheduler**.

Click:

`Create Task`

## General Tab

Name:

`Allmoxy Saw Sync Helper`

Description:

`Runs the Allmoxy saw report sync helper on port 8787.`

Recommended first setup:

- Select **Run only when user is logged on**.
- Check **Run with highest privileges**.

Production setup after testing:

- Select **Run whether user is logged on or not**.
- Use an account that can access Python and write to the shared server22 report folder.

Important:

If Python is installed under `C:\Users\kovas`, another account may not be able to use it. For a service account, install Python for all users or run the task as `CORP\kovas`.

## Triggers Tab

Click **New**.

Recommended:

- Begin the task: **At log on**
- User: `CORP\kovas`

Alternative:

- Begin the task: **At startup**

At startup is better long term, but at log on is easier to test.

## Actions Tab

Click **New**.

Action:

`Start a program`

Program/script:

`C:\Users\kovas\AppData\Local\Programs\Python\Python313\python.exe`

Add arguments:

`C:\AllmoxySawSync\sync_helper.py`

Start in:

`C:\AllmoxySawSync`

Do not put the `.py` file in Program/script. Program/script must be Python, and the `.py` file goes in arguments.

## Conditions Tab

Recommended:

- Uncheck **Start the task only if the computer is on AC power**.

## Settings Tab

Recommended:

- Check **Allow task to be run on demand**.
- Check **Run task as soon as possible after a scheduled start is missed**.
- Check **If the task fails, restart every 1 minute**.
- Set restart attempts to `3`.
- Uncheck **Stop the task if it runs longer than...**

The helper is supposed to run continuously.

## Test The Task

1. Close any manual CMD/PowerShell helper window.
2. In Task Scheduler, right-click **Allmoxy Saw Sync Helper**.
3. Click **Run**.
4. Open PowerShell.
5. Run:

```powershell
Test-NetConnection localhost -Port 8787
```

Expected:

```text
TcpTestSucceeded : True
```

## Task Scheduler Result Codes

- `0x0`: task completed successfully.
- `0x41301`: task is running. This is normal for a long-running helper.
- `0x1`: Python/script issue.
- `0x2`: file path issue.

## Manual Start For Testing

If Task Scheduler is not working, run manually:

```powershell
C:\Users\kovas\AppData\Local\Programs\Python\Python313\python.exe C:\AllmoxySawSync\sync_helper.py
```

Keep that window open while testing.

## Verify Sync

1. Open calculator on `server24`.
2. Import Allmoxy CSV.
3. Click **Sync Report to Saw**.
4. Confirm files appear in:

`\\server22\SHARE\Data\Cabinet Vision\Biesse Selco\Allmoxy Top Edge Reports`

Expected files:

- `index.json`
- `reports\...`

## Logoff Behavior

If task is set to **Run only when user is logged on**:

- Disconnecting RDP usually keeps it running.
- Logging off stops it.

If task is set to **Run whether user is logged on or not**:

- It should keep running after logoff.
- Other users on the same server can use sync as long as the helper is running.
