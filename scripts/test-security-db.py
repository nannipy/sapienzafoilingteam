"""Verify security migrations against disposable PostgreSQL, never production."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import subprocess
import tempfile

site = Path(__file__).resolve().parents[1]
bins = Path('/opt/homebrew/opt/postgresql@17/bin')
def cmd(name, *args):
    return subprocess.run([str(bins/name), *map(str,args)], capture_output=True, text=True, check=True)
with tempfile.TemporaryDirectory(prefix='sft-security-') as tmp:
    root = Path(tmp); socket = root/'socket'; socket.mkdir()
    cmd('initdb','-D',root/'data','-A','trust','--no-locale','-E','UTF8')
    cmd('pg_ctl','-D',root/'data','-l',root/'log','-o',f"-k {socket} -h ''",'start')
    def sql(query, ok=True):
        r = subprocess.run([str(bins/'psql'),'-h',str(socket),'-d','postgres','-X','-At','-v','ON_ERROR_STOP=1','-c',query],capture_output=True,text=True)
        if ok and r.returncode: raise AssertionError(r.stderr)
        return r
    try:
        sql("CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE TABLE posts(id integer primary key, status text); INSERT INTO posts VALUES(1,'published'),(2,'draft'); GRANT ALL ON posts TO anon,authenticated,service_role; ALTER TABLE posts ENABLE ROW LEVEL SECURITY; CREATE POLICY legacy_all ON posts FOR ALL USING(true) WITH CHECK(true);")
        sql((site/'supabase/migrations/20261026160000_posts_security.sql').read_text())
        for role in ['anon','authenticated']:
            assert sql(f'SET ROLE {role}; SELECT count(*) FROM posts;').stdout.strip().endswith('1')
            for query in ["INSERT INTO posts VALUES(3,'published');", "UPDATE posts SET status='draft' WHERE id=1;", 'DELETE FROM posts WHERE id=1;']:
                assert sql(f'SET ROLE {role};'+query,False).returncode != 0
        sql("SET ROLE service_role; INSERT INTO posts VALUES(3,'draft'); UPDATE posts SET status='published' WHERE id=3; DELETE FROM posts WHERE id=3;")
        sql('CREATE TABLE events(id integer); CREATE TABLE open_positions(id integer); GRANT ALL ON events,open_positions TO anon,authenticated;')
        sql((site/'supabase/migrations/20261026160500_content_write_security.sql').read_text())
        for table in ['events','open_positions']:
            for role in ['anon','authenticated']:
                assert sql(f'SET ROLE {role}; INSERT INTO {table} VALUES(1);',False).returncode != 0
            sql(f'SET ROLE service_role; INSERT INTO {table} VALUES(1);')
        sql((site/'supabase/migrations/20261026161000_public_action_limits.sql').read_text())
        query="SELECT consume_public_action_limit('concurrent',3,3600);"
        with ThreadPoolExecutor(max_workers=8) as pool:
            results=list(pool.map(lambda _:sql('SET ROLE service_role;'+query).stdout.strip().splitlines()[-1],range(12)))
        assert results.count('t') == 3, results
        assert sql('SET ROLE anon;'+query,False).returncode != 0
        sql("UPDATE public_action_limits SET window_start=now()-interval '2 hours';")
        assert sql('SET ROLE service_role;'+query).stdout.strip().endswith('t')
        sql("CREATE SCHEMA storage; CREATE TABLE storage.objects(id integer, bucket_id text); CREATE TABLE storage.buckets(id text, file_size_limit bigint, allowed_mime_types text[]); INSERT INTO storage.buckets(id) VALUES('images'); ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; GRANT USAGE ON SCHEMA storage TO anon,authenticated,service_role; GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon,authenticated,service_role; CREATE POLICY old_write ON storage.objects FOR ALL USING(true) WITH CHECK(true); INSERT INTO storage.objects VALUES(1,'images');")
        sql((site/'supabase/migrations/20261026162000_storage_admin_security.sql').read_text())
        assert sql("SET ROLE authenticated; INSERT INTO storage.objects VALUES(2,'images');",False).returncode != 0
        sql("SET ROLE authenticated; UPDATE storage.objects SET id=2; DELETE FROM storage.objects;")
        assert sql('SELECT count(*) FROM storage.objects;').stdout.strip() == '1'
        sql("SET ROLE service_role; INSERT INTO storage.objects VALUES(2,'images'); DELETE FROM storage.objects WHERE id=2;")
        print('PASS: public reads only published; anon/authenticated writes denied; service_role writes preserved; rate limits atomic and expiring; direct storage writes denied.')
    finally:
        cmd('pg_ctl','-D',root/'data','stop','-m','immediate')
