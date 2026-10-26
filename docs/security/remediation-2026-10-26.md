# Correzioni sicurezza — 26 ottobre 2026

## Già applicato in produzione

- `posts`: RLS abilitata, policy legacy rimosse (inclusa `ADMIN FOR ALL TO public USING(true) WITH CHECK(true)`), privilegi pubblici revocati. `anon` e `authenticated` hanno solo SELECT sui pubblicati; `service_role` mantiene CRUD. Verifica REST live: POST con payload vuoto e PATCH/DELETE su UUID inesistente restituiscono tutti `401`, codice `42501`. Nessun articolo modificato. Migrazione riproducibile: `20261026160000_posts_security.sql`.
- Eventi e posizioni: privilegi REST di scrittura revocati a PUBLIC/anon/authenticated, CRUD server preservato (`20261026160500_content_write_security.sql`). Verifica live: GET 200; INSERT/PATCH/DELETE anon 401/42501. Per PATCH/DELETE si è usato il filtro impossibile `id=is.null`; nessuna riga modificata.
- L'account `sapienzafoilingteam@gmail.com`, indicato dall'utente, ha `app_metadata.role = admin`, verificato tramite Supabase Admin API. Nessun altro account promosso.

- Rate limit DB condiviso: migrazione `20261026161000_public_action_limits.sql` applicata. Verifica live: anon riceve `401/42501`; service_role ottiene `true` al primo tentativo e `false` al successivo su una chiave casuale di test. Nessuna notifica o prenotazione generata.

## Patch locali da rilasciare

- `requireAdmin()` in tutte le action amministrative e nel layout; proxy con ruolo verificato e matcher limitato a `/admin/:path*` e `/login`. I test rifiutano utenti senza ruolo e con ruolo solo in `user_metadata`.
- Next.js ed eslint-config-next `16.4.3`; DOMPurify `3.4.17`, anche tramite override delle dipendenze transitive.
- Header anti-clickjacking, nosniff, referrer policy, permissions policy (camera consentita allo scanner sullo stesso origin), COOP; rimosso X-Powered-By. CSP di base su object/base/frame/form: **non è una CSP completa sugli script con nonce/hash**.
- Server action Telegram: controlli runtime, limiti di lunghezza ed enum, rate limit DB condiviso, testo senza parse_mode, nessun destinatario personale hardcoded, controllo HTTP e risposta Telegram, timeout. La configurazione mancante produce errore invece di falso successo. Nessun messaggio reale inviato durante le verifiche.
- Prenotazioni: HMAC di IP Vercel attendibile (`x-vercel-forwarded-for`), massimo 10 tentativi/IP/ora e 3 per destinatario/ora. Il database contiene chiavi HMAC, non IP/email. Il limite è atomico tra istanze; indisponibilità RPC blocca l'azione. In locale si usa una chiave comune di sviluppo. I tentativi comprendono i retry: non è una verifica di proprietà dell'email.
- Upload/spostamenti/eliminazioni/cartelle media passano dalle action server con `requireAdmin()`. Massimo 4 MiB, MIME consentiti, firma PDF e formato immagine tramite sharp; SVG respinti anche se dichiarati PNG. Migrazione storage blocca tutte le scritture dirette dei ruoli pubblici sul bucket images. Il limite Next del body include l'overhead multipart (5 MiB).
- Eventi/posizioni: campi consentiti, limiti, tipi, date, requisiti e URL HTTPS o percorsi locali. Articoli: titolo 300, contenuti 100000 per lingua, alt 500, URL 2048. `id`, `created_at` e campi imprevisti non vengono propagati dalle mutation.
- Rimossa route API login inutilizzata; rimossi log grezzi degli errori login. Config locale: signup disabilitato, password minima 12, sessione massima 24h/inattività 8h. **La modifica di config.toml non cambia il progetto hosted**.
- Umami rimosso dal layout; pageview PostHog senza query string e senza pagine admin/login. L'opt-out esistente rimane attivo.

## Ordine di rilascio

1. Conservare il ruolo admin dell'account autorizzato. Non usare un'allowlist di email nel codice e non leggere `user_metadata` per autorizzare.
2. La migrazione `20261026161000_public_action_limits.sql` è già applicata; eseguirla anche negli altri ambienti prima del codice: se la RPC non esiste, le action pubbliche falliscono chiuse.
3. Rilasciare codice e lockfile verificati, preservando il lavoro SFT Day preesistente nel checkout. Nessun commit/push effettuato da questo intervento.
4. Applicare `20261026162000_storage_admin_security.sql` dopo il rilascio delle nuove action media. Applicarla prima interromperebbe gli upload del vecchio frontend.
5. Aggiornare la sessione dell'admin (logout/login) per il claim nei JWT. Provare login, salvataggio bozza, pubblicazione, upload e operazioni cartelle, prenotazione, pagamento/check-in e reinvio con destinatari di test esplicitamente autorizzati.
6. Verificare header pubblici, diniego action con account senza ruolo e storage REST con JWT autenticato. Le verifiche REST fatte qui su posts non sostituiscono un percorso completo admin nel browser dopo il deploy.

## Ancora da completare

- Turnstile/CAPTCHA reale: servono configurazione del provider, chiave sito e segreto, widget e verifica server. Il solo rate limit non elimina l'abuso distribuito.
- Verifica della proprietà degli indirizzi email prima di inviare biglietti; il limite per destinatario riduce l'abuso senza provarne il possesso.
- MFA: enrollment/second factor e relativa UI prima di imporre AAL2; password/session timeout/rate limit login da configurare e verificare sul progetto hosted. Non dichiarare MFA attiva solo cambiando config.toml.
- Audit log completo delle mutation admin con operatore. I check-in/archivi già esistenti restano separati.
- CSP script con nonce/hash e verifica compatibilità delle integrazioni.
- Rate limit delle route biglietto e revisione degli URL raccolti automaticamente dagli altri eventi analytics.

## Risultati locali

- Build produzione Next 16.4.3 con webpack: completata, inclusi articoli reali in prerender (accesso rete necessario).
- TypeScript: nessun errore.
- Header HTTP sulla build locale: CSP base, XFO, nosniff, referrer e permissions policy presenti; anon su `/admin` riceve redirect 307 al login.
- Suite mirata: 67 test passati in 9 suite; test contenuto upload: altri 3 passati.
- Audit dipendenze di produzione: nessuna segnalazione (exit 0). Non equivale a una verifica di tutti i pacchetti dev.
- PostgreSQL temporaneo: revoche/RLS, rate limit concorrenti/scadenza e storage verificati.

## Verifiche ripetibili

```sh
python3 scripts/test-security-db.py
bunx jest app/__tests__/admin app/__tests__/team-day/registration.test.ts app/__tests__/team-day/tickets.test.ts --runInBand --coverage=false --testTimeout=30000
bunx tsc --noEmit
bun audit --production --audit-level=high
SFT_LOCAL_PREVIEW=1 bun run build --webpack
```

Il test DB avvia PostgreSQL usa-e-getta solo su socket Unix; non accede alla produzione. Include legacy policy permissive, anon/authenticated/service_role, tentativi concorrenti, scadenza finestre e blocco storage diretto. Due test PDF/email hanno superato il timeout iniziale sotto carico: la riesecuzione separata a 30 secondi è passata (6/6).

## Precisazioni sul report originale

Un DELETE `204` su una riga inesistente non prova una policy DELETE permissiva. Qui la prova è l'ispezione live della policy `ADMIN ALL TO public`, seguita dal diniego `42501` dopo la revoca. Inoltre Vercel documenta che sovrascrive X-Forwarded-For: la possibilità di spoofing dipende dalla catena proxy effettiva. La patch usa esplicitamente l'header Vercel e fallisce se manca, senza assumere affidabile una catena arbitraria.

Fonti delle precisazioni: [header Vercel](https://vercel.com/docs/headers/request-headers), [advisory Next.js](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw), [advisory DOMPurify](https://github.com/cure53/DOMPurify/security/advisories/GHSA-cg2g-xh64-v4q7).
