"""
Local scheduling helper for GeoLite2 DB updates.

This script can be used on a development or production server to schedule
the update_geolite2 management command on a recurring basis (e.g., monthly).

Supports:
- Linux/macOS: crontab scheduling
- Windows: Task Scheduler (manual setup or via PowerShell)

Usage:
  # Print crontab entry for monthly updates (1st of month at 2 AM local time)
  python backend/scripts/schedule_geolite2_updates.py --cron

  # Windows: print PowerShell Task Scheduler command
  python backend/scripts/schedule_geolite2_updates.py --windows
"""
import argparse
import sys
from pathlib import Path


def print_cron_entry(repo_root: Path):
    """Print a crontab entry for monthly GeoLite2 updates."""
    manage_py = repo_root / 'backend' / 'manage.py'
    env_file = repo_root / '.env'

    cron = f"""
# Update GeoLite2 DB monthly (1st day, 2 AM local time)
0 2 1 * * cd {repo_root} && source {env_file} 2>/dev/null; python {manage_py} update_geolite2 >> /var/log/geolite2-update.log 2>&1

# OR if no .env file, set MAXMIND_LICENSE_KEY inline:
# 0 2 1 * * export MAXMIND_LICENSE_KEY='YOUR_LICENSE_KEY'; cd {repo_root} && python backend/manage.py update_geolite2 >> /var/log/geolite2-update.log 2>&1

# To add this crontab entry, run:
#   crontab -e
# Then paste the above line.
"""
    print(cron)


def print_windows_task_scheduler():
    """Print PowerShell command for Windows Task Scheduler."""
    ps_cmd = """
# Run this PowerShell command as Administrator to schedule monthly GeoLite2 updates

$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
  -Argument '-NoProfile -WindowStyle Hidden -Command "cd C:\\path\\to\\repo && python backend\\manage.py update_geolite2"'

$trigger = New-ScheduledTaskTrigger -Monthly -DaysOfMonth 1 -At 2am

$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable

Register-ScheduledTask -TaskName 'GeoLite2-Update' `
  -Action $action -Trigger $trigger -Settings $settings `
  -Description 'Monthly update of MaxMind GeoLite2-Country.mmdb'

# Note: Set environment variable MAXMIND_LICENSE_KEY in the task or in your system environment.
"""
    print(ps_cmd)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cron', action='store_true', help='Print crontab entry (Linux/macOS)')
    parser.add_argument('--windows', action='store_true', help='Print Windows Task Scheduler command')
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[2]

    if args.cron:
        print_cron_entry(repo_root)
    elif args.windows:
        print_windows_task_scheduler()
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == '__main__':
    main()
