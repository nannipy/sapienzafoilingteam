# Security Audit — Sapienza Foiling Team

Data: 26 ottobre 2026
Scope: codice in `app/`, `supabase/migrations`, `next.config.ts`, `proxy.ts`, configurazione Supabase, dipendenze, header e configurazione di produzione (verifiche read-only).
Metodo: analisi statica del codice + verifiche read-only in produzione con la chiave `anon` pubblica (nessuna scrittura, nessun dato modificato) + `bun audit`.

---

## Executive summary

Il sito ha diverse buone pratiche già implementate (service role isolata lato server, escaping di biglietti/email, RLS sulle tabelle SFT Day, token dei biglietti non tracciabili). Tuttavia sono presenti **tre problemi critici**:

1. **La tabella `posts` è scrivibile da chiunque** con la chiave `anon` pubblica (RLS permissiva su INSERT/UPDATE, probabilmente anche DELETE). Chiunque può pubblicare, modificare o cancellare articoli del blog.
2. **Nessuna separazione dei ruoli**: tutte le server action admin controllano solo “utente autenticato”, non “admin”. Qualsiasi account creato è amministratore totale (dati personali SFT Day inclusi). Mitigato dal fatto che in produzione il signup Supabase è disabilitato.
3. **Dipendenze vulnerabili**: `next@16.3.8` (RCE critica Image Optimization + DoS Server Actions) e `dompurify@3.4.15` (bypass XSS). Patch disponibili.

A questi si aggiungono header di sicurezza assenti, server action pubbliche senza validazione/rate limit, abuso del flusso email e configurazione auth debole.

---

## Criticità

### C1 — RLS permissiva su `posts`: scrittura anonima del blog (CRITICO, live)

**Evidenza** (produzione, chiave anon):
- `INSERT /rest/v1/posts` → errore `23505 duplicate key` riusando un ID esistente = il controllo RLS INSERT è passato.
- `PATCH /rest/v1/posts?id=eq.<id reale>` con cambio ID → `23505 duplicate key` = la riga reale è raggiungibile in UPDATE con ruolo `anon`.
- `DELETE /rest/v1/posts?id=eq.<uuid inesistente>` → `204` invece di `401/42501`: esiste una policy DELETE.
- Controllo positivo: `SELECT` delle bozze è correttamente bloccato dalla policy restrittiva.

**Impatto**: defacement del blog, pubblicazione di contenuti malevoli/phishing con dominio del team, cancellazione di tutti gli articoli, SEO poisoning. La sanitizzazione DOMPurify riduce l’XSS, non il defacement.

**Fix immediato (SQL editor Supabase)**:
```sql
-- 1) Ispezionare le policy esistenti
select schemaname, tablename, policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' and tablename = 'posts';

-- 2) Rimuovere ogni scrittura per anon/authenticated
drop policy if exists "<nome_policy_insert>" on public.posts;
drop policy if exists "<nome_policy_update>" on public.posts;
drop policy if exists "<nome_policy_delete>" on public.posts;

revoke insert, update, delete on public.posts from anon, authenticated;

-- 3) Lettura pubblica solo degli articoli pubblicati
create policy "posts_public_read_published"
on public.posts for select to anon, authenticated
using (status = 'published');
```
Il sito scrive tramite `service_role` (`app/lib/db/articles.ts`), che bypassa la RLS: revocare i permessi non rompe l’admin.

**Verifica dopo il fix**: ripetere i probe `INSERT`/`PATCH` con la chiave anon e attendersi `401/42501`.

---

### C2 — Nessuna autorizzazione per ruolo: “autenticato” = amministratore (CRITICO/HIGH)

`requireAuth()` in `app/lib/supabase-server.ts` verifica solo che esista un utente. Tutte le server action admin usano solo quello:
- `app/actions/articles.ts`, `events.ts`, `positions.ts`, `media.ts`
- `app/actions/team-day-admin.ts` (pagamenti, check-in, archivio, reinvio email, PII prenotazioni)
- `app/admin/layout.tsx` (accesso all’intera area admin)
- `proxy.ts` protegge `/admin` ma non verifica alcun ruolo.

In produzione `GET /auth/v1/settings` riporta `disable_signup: true`, quindi oggi non è possibile auto-registrarsi: il rischio è limitato agli account creati manualmente. Resta il problema di fondo: un ex membro o un account creato per errore ha accesso completo a prenotazioni, email, allergie e biglietti.

**Fix**:
1. Aggiungere un claim `app_metadata.role = 'admin'` e una funzione `requireAdmin()`:
```ts
export async function requireAdmin() {
  const user = await verifySession();
  if (!user || user.app_metadata?.role !== 'admin') redirect('/login');
  return user;
}
```
2. Sostituire `requireAuth()` con `requireAdmin()` in tutte le action admin e nel layout `/admin`.
3. In `proxy.ts`, dopo `getUser()`, verificare `user.app_metadata.role === 'admin'` per `/admin`.
4. Applicare lo stesso controllo alle policy storage se si mantiene l’upload dal browser.
5. Documentare la procedura di creazione/revoca account.

---

### C3 — Dipendenze con vulnerabilità note (CRITICO/HIGH)

`bun audit` (26/10/2026):
- `next@16.3.8` — **critica** GHSA-2464-fhr4-w9xw (RCE Image Optimization con SVG; patch 16.4.1) e GHSA-673q-mjm6-r5xr; **alta** GHSA-p3m5-59mp-jv5r (DoS Server Actions; patch 16.4.1).
- `dompurify@3.4.15` — **critica** GHSA-cg2g-xh64-v4q7, **alta** GHSA-mrv2-3pqr-j5jr, più altre.
- Dev-only: `postcss-selector-parser`, `zod` (via eslint), moderate/high ma non raggiungibili in produzione.

**Fix**:
```bash
bun add next@^16.4.3 dompurify@^3.4.17
bun update
bun audit --audit-level=high
```
Aggiungere un override per forzare `dompurify >= 3.4.17` anche nelle dipendenze transitive (`isomorphic-dompurify`, `posthog-js`). Il workflow `.github/workflows/security.yml` è buono ma al momento fallirebbe su queste advisory: va aggiornato insieme alle dipendenze.

---

## Problemi alti

### H1 — Header di sicurezza assenti sulla produzione
Risposta reale di `https://www.sapienzafoilingteam.com/`:
```
strict-transport-security: max-age=63072000   ✅ (solo Vercel)
x-powered-by: Next.js                          ❌ info disclosure
```
Mancano: `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP. Il login e l’admin sono incorniciabili (clickjacking), e non c’è difesa in profondità contro XSS.

**Fix** in `next.config.ts`:
```ts
poweredByHeader: false,
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(), payment=()' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      // CSP: costruirla con nonce/hash per gli script inline (posthog, Umami, Vercel)
      { key: 'Content-Security-Policy', value: "default-src 'self'; ...; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
    ],
  }];
}
```
Nota: `camera=(self)` serve per lo scanner QR admin. Le route biglietto hanno già una CSP propria e restrittiva (buona pratica).

### H2 — Server action pubbliche senza validazione, honeypot o rate limit
`app/actions/signature.ts` e `app/actions/presentation.ts`:
- nessuna validazione di lunghezza/tipo lato server;
- nessun honeypot o rate limit;
- input utente interpolato nel messaggio Telegram con `parse_mode: 'Markdown'` → **Markdown injection**: un attaccante può inviare link cliccabili/testo formattato contraffatto allo staff, oltre a spam e consumo quota;
- `fetch` non controlla `response.ok`: errori Telegram riportati come successo;
- chat ID personale hardcoded (`5901269690`);
- `PresentationForm` non è nemmeno usato, ma l’action resta invocabile.

**Fix**: validare con lo stesso approccio di `team-day-validation.ts`, rimuovere `parse_mode` (o usare `MarkdownV2` con escaping), aggiungere rate limit per IP, verificare `response.ok`, spostare i chat ID in env, rimuovere l’action morta.

### H3 — Abuso del flusso prenotazioni/email
`app/actions/team-day.ts`:
- `x-forwarded-for.split(',')[0]` è il primo valore, potenzialmente controllato dal client: il rate limit DB (100/h) è aggirabile;
- nessun CAPTCHA (solo honeypot `website`);
- la registrazione invia email a indirizzi arbitrari senza verifica: **email bombing** verso terzi tramite il dominio Resend, consumo quota e danno alla reputazione del mittente.

**Fix**: usare `x-real-ip` (impostato da Vercel) o l’ultimo IP della catena; rate limit per email/dominio oltre che per IP; CAPTCHA (Turnstile) sul form pubblico; considerare verifica email prima dell’invio del biglietto.

### H4 — Postura di autenticazione debole
- Il lockout è **solo client-side** (`app/login/page.tsx`): bypassabile; l’unica protezione reale è il rate limit Supabase (30/5min/IP).
- `minimum_password_length = 6`, nessun requisito di complessità, MFA disabilitata, `enable_confirmations = false`, nessun timeout di sessione (`supabase/config.toml`).
- `app/api/auth/login/route.ts` restituisce `error.message` di Supabase e non è usato da nessuna pagina: superficie inutile.
- `console.error("Real Supabase Error:", signInError)` in produzione.
- La pagina login non usa `redirectTo`.

**Fix**: rimuovere l’API route morta; non loggare/restituire errori grezzi; abilitare MFA TOTP per gli admin; password min 12 + requisiti; timeout sessione; rate limit server-side (Vercel WAF o Upstash) e valutare Turnstile sul login; onorare `redirectTo` solo con path interni.

### H5 — Upload media: SVG e validazione solo client-side
`app/admin/media/page.tsx` e `app/components/ArticleAdmin.tsx` caricano **direttamente dal browser** sul bucket pubblico `images`, con `anon key` + sessione. Sono accettati `image/svg+xml` (config locale e allowlist UI). Un SVG può contenere script (XSS sul dominio storage se aperto direttamente) e amplia la superficie legata alla CVE di Next Image. Il controllo tipo/dimensione è solo client-side.

**Fix**: rimuovere `image/svg+xml` (o sanitizzarlo server-side); validare MIME e dimensione anche lato server; preferire upload tramite server action con `requireAdmin()` + service role, così le policy storage non dipendono dal browser; verificare che `storage.objects` consenta INSERT/UPDATE/DELETE solo agli admin.

---

## Problemi medi

| # | Problema | Dettaglio / Fix |
|---|---|---|
| M1 | Nessuna validazione runtime nelle action admin eventi/posizioni/articoli | `createEventAction`, `updateEventAction`, `createPositionAction`, `articlePayload` non limitano lunghezze/URL. Aggiungere schema (zod o validatori esistenti) e limiti. |
| M2 | Nessun audit log delle azioni admin | Chi cambia un pagamento, archivia, cancella un articolo non è tracciato (solo i check-in hanno `checked_in_by`). Aggiungere tabella `admin_audit_log`. |
| M3 | `X-Powered-By` | `poweredByHeader: false`. |
| M4 | Umami caricato senza consenso | `app/layout.tsx` carica lo script Umami sempre; PostHog rispetta l’opt-out. Per GDPR, caricare Umami solo dopo consenso o rimuoverlo. |
| M5 | Analytics con URL completi | `PostHogPageview` invia `window.location` con query string; escludere parametri sensibili (le route biglietto sono già fuori dal layout). |
| M6 | Rate limit assente sulle route biglietto | UUID casuali rendono l’enumerazione impraticabile, ma un rate limit per IP è difesa in profondità. |
| M7 | `x-forwarded-for` non attendibile | Vedi H3. |
| M8 | `posts` senza limiti di lunghezza | `title`/`content` possono essere enorme (DoS rendering/storage). Aggiungere limiti. |
| M9 | Header `access-control-allow-origin: *` su pagine statiche/404 | Verificare che non si applichi a risposte con dati; non è credenziale, ma da restringere. |

---

## Problemi bassi / best practice

- `.DS_Store` presenti nel working tree (`public/`, root): non tracciati e esclusi da `.vercelignore`, ma aggiungerli a `.gitignore`/pulizia locale.
- Repo GitHub **pubblico**: nessun segreto trovato nella storia, ma `docs/` espone dettagli operativi e screenshot admin. Il PDF di esempio è marcato “ESEMPIO · NON VALIDO” (verificato con `pdftotext`), nessun biglietto reale.
- `robots.ts` non esclude `/login`; le route biglietto hanno già `noindex` e header dedicati.
- HSTS senza `includeSubDomains; preload` (valutare).
- Reverse tabnabbing: i `target="_blank"` controllati hanno `rel="noopener noreferrer"`; mantenerlo come regola.
- CI: buon `bun audit` + patch `braces` con test; mancano CodeQL/Semgrep e Dependabot per le GitHub Actions.
- `PresentationForm` è codice morto (l’action resta comunque esposta).
- `proxy.ts` esegue `getUser()` su ogni richiesta (anche asset e pagine pubbliche): limitare il matcher a `/admin` e `/login` per ridurre latenza e carico Supabase.
- `NEXT_PUBLIC_*` non contiene segreti: corretto. `SUPABASE_SERVICE_ROLE_KEY` è usata solo in file `server-only`. Buono.

---

## Controlli positivi già presenti

- `service_role` isolata in `app/lib/supabase-admin.ts` con `server-only`; data layer server-only.
- RLS e revoke corretti su tutte le tabelle `team_day_*` (verificato: `401` con anon).
- Biglietti: codice UUIDv4 opaco, QR `sft:<uuid>`, `Referrer-Policy: no-referrer`, `Cache-Control: no-store`, `X-Robots-Tag: noindex`, CSP restrittiva, escaping HTML, QR solo data URL locale.
- Email: escaping dei dati, idempotency key Resend, lease DB, backoff, nessun PII nei log.
- Cron `/api/sft-day/emails` protetto con `timingSafeEqual` e `CRON_SECRET`.
- `getArticle`/`getArticles` filtrano le bozze; verifica live: bozze non leggibili con anon.
- `getTeamDayPaymentUrl` valida host/protocollo; `getTeamDayBankDetails` verifica checksum IBAN.
- `validateTeamDayInput` robusto (lunghezze, control char, honeypot, UUID, numero partecipanti).
- Validazione sessione con `getUser()` (non `getSession()`).
- Nessun segreto tracciato in git; `.env*` ignorato.
- Workflow di sicurezza con audit dipendenze e test della patch `braces`.

---

## Piano di remediation prioritizzato

**Oggi**
1. Chiudere la scrittura anonima su `posts` (C1) e verificare con i probe.
2. Aggiornare `next` e `dompurify` (C3).
3. Revocare/ruotare eventuali account non necessari; confermare `disable_signup: true` in produzione.

**Questa settimana**
4. Introdurre `requireAdmin()` + claim `app_metadata.role` e applicarlo a tutte le action/layout/proxy (C2).
5. Aggiungere header di sicurezza e CSP (H1).
6. Validare/limitare le server action pubbliche e sistemare Telegram (H2).
7. Rate limit + CAPTCHA e IP attendibile sulle prenotazioni (H3).
8. Rafforzare auth: MFA, password, rimozione API login morta (H4).

**Questo mese**
9. Storage: niente SVG, upload server-side, policy storage admin-only (H5).
10. Validazione runtime e audit log admin (M1/M2).
11. Consenso analytics/Umami e pulizia URL (M4/M5).
12. CodeQL/Semgrep + Dependabot; rieseguire `bun audit` in CI.

---

## Appendice — probe read-only eseguiti in produzione

Tutti i test hanno usato la chiave `anon` pubblica e non hanno modificato dati (le scritture sono fallite su vincoli di unicità/CHECK):
- `GET /auth/v1/settings` → `disable_signup: true`, `mailer_autoconfirm: false`.
- `GET /rest/v1/posts?status=eq.draft` → `[]` (bozze protette).
- `POST /rest/v1/posts` con PK esistente → `23505` (RLS INSERT permissiva).
- `PATCH /rest/v1/posts?id=<reale>` con ID duplicato → `23505` (RLS UPDATE permissiva su righe reali).
- `DELETE /rest/v1/posts?id=<inesistente>` → `204` (policy DELETE presente).
- `GET /rest/v1/team_day_*` → `401 permission denied` (corretto).
- `POST` su `events`/`open_positions` → `42501` (scrittura anon bloccata); `PATCH` su riga reale eventi → nessuna modifica.
- Upload anon su `images` → `403 RLS` (corretto; l’upload autenticato resta da verificare).
- Header produzione: HSTS presente; CSP/XFO/XCTO/Referrer-Policy/Permissions-Policy assenti; `X-Powered-By: Next.js`.
