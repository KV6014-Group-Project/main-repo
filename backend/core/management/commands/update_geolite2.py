from django.core.management.base import BaseCommand
from django.conf import settings
import os
import sys
import tempfile
import tarfile
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen, Request


DEFAULT_DB_REL_PATH = Path(settings.BASE_DIR) / 'geoip' / 'GeoLite2-Country.mmdb'


def build_download_url(license_key: str) -> str:
    base = 'https://download.maxmind.com/app/geoip_download'
    params = f'?edition_id=GeoLite2-Country&license_key={license_key}&suffix=tar.gz'
    return base + params


def download_and_extract_mmdb(url: str) -> bytes:
    req = Request(url, headers={'User-Agent': 'ROSE-GeoIP-Updater/1.0'})
    with urlopen(req, timeout=60) as resp:
        if resp.status != 200:
            raise RuntimeError(f'Failed to download GeoLite2 DB: HTTP {resp.status}')
        content = resp.read()

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
    with tempfile.NamedTemporaryFile(dir=str(dest.parent), delete=False) as tf:
        tf.write(data)
        tmp_path = Path(tf.name)
    tmp_path.replace(dest)


class Command(BaseCommand):
    help = 'Download and update GeoLite2-Country.mmdb using MAXMIND_LICENSE_KEY env var'

    def handle(self, *args, **options):
        license_key = os.environ.get('MAXMIND_LICENSE_KEY')
        if not license_key:
            self.stderr.write('MAXMIND_LICENSE_KEY environment variable is not set')
            sys.exit(2)

        dest = Path(os.environ.get('GEOIP2_DB_PATH') or getattr(settings, 'GEOIP2_DB_PATH', DEFAULT_DB_REL_PATH))
        url = build_download_url(license_key)
        self.stdout.write('Downloading GeoLite2 DB from MaxMind...')
        try:
            mmdb_bytes = download_and_extract_mmdb(url)
        except Exception as exc:
            self.stderr.write(f'Download/extract failed: {exc}')
            sys.exit(3)

        write_mmdb_bytes(mmdb_bytes, dest)
        self.stdout.write(f'GeoLite2-Country.mmdb written to {dest}')
