"""
update_geolite2.py

Download and extract the MaxMind GeoLite2-Country.mmdb file using a
MaxMind license key. Designed for development/ops use in the project.

Usage:
  - Set environment variable `MAXMIND_LICENSE_KEY` to your MaxMind license key.
  - Optionally set `GEOIP2_DB_PATH` to control destination path. Defaults to
    `backend/geoip/GeoLite2-Country.mmdb` inside the project.

Run:
    python scripts/update_geolite2.py

Notes:
  - You must accept MaxMind license and create an account to get a license key.
  - This script is intended for admin/CI use only; do not commit license keys.
"""
from __future__ import annotations

import os
import sys
import tempfile
import tarfile
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen, Request


DEFAULT_DB_REL_PATH = Path(__file__).resolve().parents[1] / 'geoip' / 'GeoLite2-Country.mmdb'


def get_env(name: str, default=None):
    return os.environ.get(name, default)


def build_download_url(license_key: str) -> str:
    base = 'https://download.maxmind.com/app/geoip_download'
    params = f'?edition_id=GeoLite2-Country&license_key={license_key}&suffix=tar.gz'
    return base + params


def download_and_extract_mmdb(url: str) -> bytes:
    """Download the tar.gz from MaxMind and return the .mmdb file bytes.

    Raises RuntimeError on failure.
    """
    req = Request(url, headers={'User-Agent': 'ROSE-GeoIP-Updater/1.0'})
    with urlopen(req, timeout=60) as resp:
        if resp.status != 200:
            raise RuntimeError(f'Failed to download GeoLite2 DB: HTTP {resp.status}')
        content = resp.read()

    # Open tar.gz in memory and find .mmdb member
    with tarfile.open(fileobj=BytesIO(content), mode='r:gz') as tar:
        mmdb_member = None
        for member in tar.getmembers():
            if member.name.endswith('.mmdb'):
                mmdb_member = member
                break
        if mmdb_member is None:
            raise RuntimeError('No .mmdb file found in archive')
        f = tar.extractfile(mmdb_member)
        if f is None:
            raise RuntimeError('Failed to extract mmdb file from archive')
        return f.read()


def write_mmdb_bytes(data: bytes, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    # write atomically
    with tempfile.NamedTemporaryFile(dir=str(dest.parent), delete=False) as tf:
        tf.write(data)
        tmp_path = Path(tf.name)
    tmp_path.replace(dest)


def main():
    license_key = get_env('MAXMIND_LICENSE_KEY')
    if not license_key:
        print('ERROR: environment variable MAXMIND_LICENSE_KEY is not set.', file=sys.stderr)
        print('Register at https://www.maxmind.com/ to obtain a free license key for GeoLite2.', file=sys.stderr)
        sys.exit(2)

    dest = Path(get_env('GEOIP2_DB_PATH') or DEFAULT_DB_REL_PATH)
    url = build_download_url(license_key)
    print('Downloading GeoLite2 DB from MaxMind...')
    try:
        mmdb_bytes = download_and_extract_mmdb(url)
    except Exception as exc:
        print('Download/extract failed:', exc, file=sys.stderr)
        sys.exit(3)

    write_mmdb_bytes(mmdb_bytes, dest)
    print(f'GeoLite2-Country.mmdb written to {dest}')


if __name__ == '__main__':
    main()
