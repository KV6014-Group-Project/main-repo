# GeoLite2 DB scheduling

This folder includes scripts to schedule the monthly update of the MaxMind GeoLite2-Country.mmdb database.

## Files

- `update_geolite2.py` — Downloads and writes GeoLite2 DB from MaxMind using `MAXMIND_LICENSE_KEY` env var.
- `schedule_geolite2_updates.py` — Helper to generate crontab or Windows Task Scheduler commands.

## Quick start: Linux/macOS crontab

```bash
# Print the cron entry
python backend/scripts/schedule_geolite2_updates.py --cron

# Add it to your crontab:
crontab -e
# Paste the printed entry (runs 1st of month at 2 AM)
```

## Quick start: Windows Task Scheduler

```powershell
# Print PowerShell command
python backend\scripts\schedule_geolite2_updates.py --windows

# Copy the command, open PowerShell as Administrator, and run it
```

## Manual runs

```bash
# Linux/macOS
export MAXMIND_LICENSE_KEY='your_license_key'
python backend/manage.py update_geolite2

# Windows
$env:MAXMIND_LICENSE_KEY = 'your_license_key'
python backend\manage.py update_geolite2
```

## CI/CD: GitHub Actions

A GitHub Actions workflow (`.github/workflows/update-geolite2.yml`) automatically updates the DB
monthly and commits changes to the repository. The workflow requires:
- `MAXMIND_LICENSE_KEY` secret configured in your GitHub repository settings.
- The workflow runs on the 1st of each month at 00:00 UTC (or can be triggered manually).
