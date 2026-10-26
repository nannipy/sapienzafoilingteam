"""Run Team Day migrations and payment integrity checks on disposable local PostgreSQL.

No remote database, actual account or payment provider is used.
Requires PostgreSQL server binaries (set SFT_POSTGRES_BIN if not on PATH).
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import os
import shutil
import subprocess
import tempfile

site = Path(__file__).resolve().parents[1]
candidates = [os.environ.get('SFT_POSTGRES_BIN'), '/opt/homebrew/opt/postgresql@17/bin']
if shutil.which('postgres'):
    candidates.append(str(Path(shutil.which('postgres')).parent))
binary_dir = next((Path(p) for p in candidates if p and (Path(p) / 'postgres').is_file()), None)
if binary_dir is None:
    raise SystemExit('PostgreSQL server binaries missing. Set SFT_POSTGRES_BIN to their directory.')

def command(name, *args):
    return subprocess.run([str(binary_dir / name), *map(str, args)], capture_output=True, text=True, check=True)

with tempfile.TemporaryDirectory(prefix='sft-teamday-payment-test-') as temporary:
    root = Path(temporary)
    socket = root / 'socket'
    socket.mkdir()
    command('initdb', '-D', root / 'data', '-A', 'trust', '--no-locale', '-E', 'UTF8')
    # Unix socket in a unique private directory, no TCP listening port.
    command('pg_ctl', '-D', root / 'data', '-l', root / 'postgres.log', '-o', f"-k {socket} -h ''", 'start')
    def sql(text, expect_success=True):
        result = subprocess.run([
            str(binary_dir / 'psql'), '-h', str(socket), '-d', 'postgres', '-X', '-At',
            '-v', 'ON_ERROR_STOP=1', '-c', text,
        ], capture_output=True, text=True)
        if expect_success and result.returncode:
            raise AssertionError(result.stderr)
        return result
    try:
        sql('CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;')
        for name in ['20261026120000_team_day_registrations.sql', '20261026123000_team_day_bank_transfer.sql']:
            sql((site / 'supabase' / 'migrations' / name).read_text())
        request = "SELECT public.register_team_day('b58fb537-c994-43c7-98ed-2fa9a3351374','Mario','Rossi','test@example.com','cash','test-hash');"
        # Concurrent retries must return the same confirmation and save just once.
        with ThreadPoolExecutor(max_workers=2) as pool:
            responses = list(pool.map(lambda _: sql('SET ROLE service_role;' + request).stdout.strip(), range(2)))
        assert responses[0] == responses[1]
        assert sql('SELECT count(*) FROM team_day_registrations').stdout.strip() == '1'
        for index, method in enumerate(['paypal', 'revolut', 'bank_transfer'], start=1):
            registration = request.replace('b58fb537', f'b58fb53{index}').replace('test@example.com', f'test{index}@example.com').replace("'cash'", f"'{method}'")
            sql('SET ROLE service_role;' + registration)
        assert sql("SELECT count(*) FROM team_day_registrations WHERE payment_status='pending' AND amount_cents=1500").stdout.strip() == '4'
        assert sql('SET ROLE anon; SELECT * FROM team_day_registrations;', False).returncode != 0
        assert sql('SET ROLE authenticated;' + request, False).returncode != 0
        assert sql("SET ROLE anon; UPDATE team_day_registrations SET payment_status='paid';", False).returncode != 0
        assert sql('SET ROLE service_role;' + request.replace('b58fb537', 'a58fb537'), False).returncode != 0
        assert sql('SET ROLE service_role;' + request.replace("'cash'", "'paypal'"), False).returncode != 0
        # Authorized server operation marks receipt. No public caller can do this.
        sql("SET ROLE service_role; UPDATE team_day_registrations SET payment_status='paid' WHERE payment_method='bank_transfer';")
        assert sql("SELECT count(*) FROM team_day_registrations WHERE payment_status='paid'").stdout.strip() == '1'
        sql("SET ROLE service_role; UPDATE team_day_registrations SET payment_status='pending' WHERE payment_method='bank_transfer';")
        assert sql("SELECT count(*) FROM team_day_registrations WHERE payment_status='paid'").stdout.strip() == '0'
        print('PASS: both migrations; all four methods saved at 15 EUR/pending; concurrent retries; duplicate and altered request blocked; public reads/paid updates denied; authorized paid/pending updates.')
    finally:
        command('pg_ctl', '-D', root / 'data', 'stop', '-m', 'fast')
