"""Run Team Day migrations and payment integrity checks on disposable local PostgreSQL.

No remote database, actual account or payment provider is used.
Requires PostgreSQL server binaries (set SFT_POSTGRES_BIN if not on PATH).
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import os
import json
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
        for name in ['20261026120000_team_day_registrations.sql', '20261026123000_team_day_bank_transfer.sql', '20261026130000_team_day_optional_email_allergies.sql']:
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
        # Test optional email and dietary notes
        sql("SET ROLE service_role; SELECT public.register_team_day('c58fb537-c994-43c7-98ed-2fa9a3351371','Luca','Bianchi',NULL,'cash','test-hash-2','Allergia glutine');")
        sql("SET ROLE service_role; SELECT public.register_team_day('c58fb537-c994-43c7-98ed-2fa9a3351372','Anna','Verdi','','cash','test-hash-3',NULL);")
        assert sql("SELECT count(*) FROM team_day_registrations WHERE email IS NULL").stdout.strip() == '2'
        assert sql("SELECT dietary_notes FROM team_day_registrations WHERE first_name='Luca'").stdout.strip() == 'Allergia glutine'
        # Upgrade a populated legacy database and preserve every booking/payment.
        sql((site / 'supabase/migrations/20261026140000_team_day_tickets.sql').read_text())
        assert sql('SELECT count(*) FROM team_day_tickets').stdout.strip() == '6'
        assert sql('SET ROLE service_role;'+request).stdout.strip()==responses[0]
        assert sql('SELECT count(*) FROM team_day_tickets').stdout.strip() == '6'
        assert sql('SELECT count(*) FROM team_day_ticket_emails').stdout.strip() == '4'
        group = "SELECT public.register_team_day_booking('d58fb537-c994-43c7-98ed-2fa9a3351371','Group','Owner','group@example.com','cash','group-hash',NULL,'[{\"firstName\":\"Guest\",\"lastName\":\"Two\",\"email\":\"guest@example.com\",\"dietaryNotes\":null}]');"
        with ThreadPoolExecutor(max_workers=3) as pool:
            responses=list(pool.map(lambda _:sql('SET ROLE service_role;'+group).stdout.strip(),range(3)))
        assert len(set(responses))==1
        assert sql("SELECT amount_cents FROM team_day_registrations WHERE email='group@example.com'").stdout.strip()=='3000'
        assert sql("SELECT count(*) FROM team_day_participants WHERE registration_id='d58fb537-c994-43c7-98ed-2fa9a3351371'").stdout.strip()=='2'
        assert sql('SELECT count(*)=count(DISTINCT code) FROM team_day_tickets').stdout.strip()=='t'
        assert sql('SET ROLE service_role;'+group.replace('Guest','Changed'),False).returncode!=0
        bad=group.replace('d58fb537','e58fb537').replace('group@example.com','rollback@example.com').replace('Guest','')
        assert sql('SET ROLE service_role;'+bad,False).returncode!=0
        assert sql("SELECT count(*) FROM team_day_registrations WHERE email='rollback@example.com'").stdout.strip()=='0'
        code=sql("SELECT t.code FROM team_day_tickets t JOIN team_day_participants p ON p.id=t.participant_id WHERE p.email='guest@example.com'").stdout.strip()
        actor='11111111-1111-4111-8111-111111111111'
        def control(action,event='sft-day-2026'):
            return f"SET ROLE service_role; SELECT public.control_team_day_ticket('{code}','{event}','{action}','{actor}')->>'result';"
        assert sql(control('verify')).stdout.strip().endswith('valid')
        assert sql(control('verify','other-event')).stdout.strip().endswith('not_found')
        with ThreadPoolExecutor(max_workers=3) as pool:
            admissions=list(pool.map(lambda _:sql(control('check_in')).stdout.strip(),range(3)))
        assert sum(r.endswith('admitted') for r in admissions)==1
        assert sum(r.endswith('used') for r in admissions)==2
        assert sql(control('cancel')).stdout.strip().endswith('used')
        owner_code=sql("SELECT t.code FROM team_day_tickets t JOIN team_day_participants p ON p.id=t.participant_id WHERE p.email='group@example.com'").stdout.strip()
        assert sql(control('cancel').replace(code,owner_code)).stdout.strip().endswith('cancelled')
        assert sql(control('check_in').replace(code,owner_code)).stdout.strip().endswith('cancelled')
        fallback=group.replace('d58fb537','f58fb537').replace('group@example.com','fallback@example.com').replace('"email":"guest@example.com"','"email":null')
        sql('SET ROLE service_role;'+fallback)
        assert sql("SELECT count(*) FROM team_day_ticket_emails WHERE recipient='fallback@example.com'").stdout.strip()=='2'
        for table in ['team_day_events','team_day_participants','team_day_tickets','team_day_ticket_emails']:
            for role in ['anon','authenticated']:
                assert sql(f'SET ROLE {role}; SELECT * FROM {table}',False).returncode!=0
        assert sql(control('check_in').replace('service_role','authenticated'),False).returncode!=0
        job=sql("SELECT id FROM team_day_ticket_emails LIMIT 1").stdout.strip()
        lease='22222222-2222-4222-8222-222222222222'
        claim=f"SET ROLE service_role; SELECT public.claim_team_day_email('{job}','{lease}') IS NOT NULL;"
        with ThreadPoolExecutor(max_workers=3) as pool:
            claims=list(pool.map(lambda _:sql(claim).stdout.strip(),range(3)))
        assert sum(c.endswith('t') for c in claims)==1
        sql(f"UPDATE team_day_ticket_emails SET lease_until=now()-interval '1 minute',first_attempt_at=now()-interval '25 hours' WHERE id='{job}'")
        assert sql(claim).stdout.strip().endswith('f')
        assert sql(f"SELECT status FROM team_day_ticket_emails WHERE id='{job}'").stdout.strip()=='review'
        # Search covers participant data and returns totals independently of the current 50-row page.
        found=json.loads(sql("SET ROLE service_role; SELECT public.list_team_day_bookings('guest@example.com',0);").stdout.strip().splitlines()[-1])
        assert found['total']==1 and len(found['rows'][0]['tickets'])==2
        assert found['rows'][0]['amount_cents']==3000
        assert 'source_hash' not in found['rows'][0]
        assert sql("SET ROLE anon; SELECT public.list_team_day_bookings('',0)",False).returncode!=0
        sql("INSERT INTO team_day_registrations(id,first_name,last_name,email,payment_method,source_hash) SELECT gen_random_uuid(),'Page','Test',NULL,'cash','pagination-test' FROM generate_series(1,1005)")
        page=json.loads(sql("SET ROLE service_role; SELECT public.list_team_day_bookings('Page Test',20)").stdout.strip().splitlines()[-1])
        assert page['total']==1005 and len(page['rows'])==5 and page['due']==1005*1500
        print('PASS: server search includes group attendees; pagination beyond 1000 rows; full filtered totals; public search denied.')
        print('PASS: populated legacy upgrade, group transaction, concurrent booking retries, distinct tickets, altered retry rejected, atomic rollback, QR event scope, simultaneous entry admits once, used/cancelled blocked, server-only permissions, exclusive email lease, expired deduplication window held for review.')
        print('PASS: all three migrations; all four methods saved at 15 EUR/pending; concurrent retries; duplicate and altered request blocked; optional email and dietary notes saved; public reads/paid updates denied; authorized paid/pending updates.')
    finally:
        command('pg_ctl', '-D', root / 'data', 'stop', '-m', 'fast')
