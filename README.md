# Sapienza Foiling Team — sito web

Sito del team velico universitario della Sapienza Università di Roma, dedicato alla progettazione di imbarcazioni foiling sostenibili e alla partecipazione alla SuMoth Challenge.

- **Sito pubblico:** [sapienzafoilingteam.com](https://sapienzafoilingteam.com/)
- **Repository:** [sapienzafoilingteam/sapienzafoilingteam](https://github.com/sapienzafoilingteam/sapienzafoilingteam)
- **Contatto:** [sapienzafoilingteam@gmail.com](mailto:sapienzafoilingteam@gmail.com)

Il progetto comprende pagine istituzionali in italiano e inglese, blog, eventi, posizioni aperte, raccolta «Il tuo nome sulle ali» e un’area amministrativa. Il modulo SFT Day gestisce prenotazioni di gruppo, biglietti personali con QR e PDF, email e controllo ingressi. I pagamenti vengono verificati manualmente dal team.

## Indice

- [Requisiti](#requisiti)
- [Installazione e avvio](#installazione-e-avvio)
- [Configurazione](#configurazione)
- [Utilizzo](#utilizzo)
- [Architettura](#architettura)
- [Sviluppo](#sviluppo)
- [Test e verifiche](#test-e-verifiche)
- [Build e distribuzione](#build-e-distribuzione)
- [Troubleshooting](#troubleshooting)
- [Contributi](#contributi)
- [Documentazione e licenza](#documentazione-e-licenza)

## Requisiti

- **Node.js >= 22**, come dichiarato in `package.json`.
- **Bun 1.4.4**, versione indicata in `packageManager` e usata in CI per il lockfile `bun.lock`, l’installazione e la patch di sicurezza in `patches/`.
- **Git**.
- Un ambiente **Supabase di sviluppo** con schema, funzioni, bucket e credenziali appropriati. Il repository non offre una modalità completa con dati simulati.

Per i soli test SQL servono anche Python 3 e i binari server PostgreSQL. Il test PDF richiede gli strumenti Poppler (`pdftotext`, `pdffonts`, `pdftoppm`). Questi strumenti non servono per avviare normalmente il sito.

## Installazione e avvio

```bash
git clone https://github.com/sapienzafoilingteam/sapienzafoilingteam.git
cd sapienzafoilingteam
bun install --frozen-lockfile
```

L’installazione usa l’archivio versionato `vendor/sft-design-system-1.1.3.tgz` e applica la patch `patches/braces@3.0.3.patch`. Conservare entrambi nel checkout; un’installazione con un altro gestore non garantisce l’applicazione della patch Bun.

Creare `.env.local` nella radice con almeno:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-development-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-development-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-development-service-role-key
```

Sostituire i segnaposto con le credenziali del proprio ambiente e completare le integrazioni necessarie come descritto sotto. Il client amministrativo Supabase è utilizzato anche per leggere contenuti pubblici sul server: la service role è richiesta anche senza accedere all’admin.

```bash
bun run dev
```

Aprire [localhost:3000](http://localhost:3000). Per cambiare porta: `bun run dev --port 3001`. Dopo modifiche alle variabili d’ambiente riavviare il server.

## Configurazione

### Variabili d’ambiente

Le variabili `NEXT_PUBLIC_*` sono accessibili al browser. Tutte le altre della tabella devono restare sul server. Non commettere `.env.local`, credenziali o URL personali dei biglietti.

| Variabile | Funzione e necessità |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del progetto Supabase; obbligatoria. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chiave pubblica Supabase per client browser e sessioni; obbligatoria. |
| `SUPABASE_SERVICE_ROLE_KEY` | Accesso server a dati, Storage e RPC; obbligatoria. Non usare il prefisso `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Chiave del progetto PostHog per analytics. Il provider viene inizializzato nel browser: configurarla per usare l’integrazione; non esiste un interruttore d’ambiente dedicato per disabilitarla. |
| `NEXT_PUBLIC_POSTHOG_HOST` | Endpoint PostHog del proprio progetto, ad esempio `https://eu.posthog.com`. |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Necessarie ai moduli che inviano notifiche allo staff tramite Telegram (`presentation` e `signature`). |
| `SFT_DAY_PAYPAL_URL` | Link HTTPS PayPal; senza un valore valido il metodo è disabilitato. Compatibile con `TEAM_DAY_PAYPAL_URL`. |
| `SFT_DAY_REVOLUT_URL` | Link HTTPS Revolut; precede `TEAM_DAY_REVOLUT_URL` e il valore predefinito nel codice. |
| `SFT_DAY_BANK_IBAN`, `SFT_DAY_BANK_ACCOUNT_HOLDER` | Coordinate per bonifico; precedono le equivalenti `TEAM_DAY_*` e i valori predefiniti nel codice. L’IBAN viene validato. |
| `SFT_PUBLIC_URL` | Origine dei link ai biglietti; obbligatoria per inviare email. Usare HTTPS in produzione; HTTP è ammesso solo per localhost/127.0.0.1 in sviluppo. |
| `RESEND_API_KEY`, `SFT_TICKET_EMAIL_FROM` | Invio email dei biglietti tramite Resend; il mittente deve appartenere a un dominio verificato. |
| `CRON_SECRET` | Segreto Bearer per il recupero email tramite `POST /api/sft-day/emails`; richiesto se si usa questo endpoint. |
| `SFT_LOCAL_PREVIEW=1` | Opzionale: usa `.next-local-preview` come directory di build separata. Usare lo stesso valore per build e avvio. |

Gli esempi per le email sono in [docs/admin/sft-day.env.example](docs/admin/sft-day.env.example). I valori predefiniti Revolut e bonifico sono in `app/lib/team-day-config.ts`: verificarli prima di usare un ambiente di prova, perché puntano alla raccolta reale del team.

PostHog parte con acquisizione disattivata in attesa del consenso e rispetta Do Not Track. Il layout include anche Vercel Analytics e Speed Insights. Le pagine personali dei biglietti sono gestite separatamente, senza il layout pubblico.

### Database, Storage e migrazioni

Il sito usa le tabelle editoriali `posts`, `events`, `open_positions`, il bucket Storage `images`, le tabelle `team_day_*` e le RPC per prenotazioni, email, ingressi e limiti antiabuso.

**Le migrazioni sono incrementali: non costituiscono una baseline completa del database.** Per un nuovo ambiente ottenere dai manutentori uno schema iniziale compatibile e dati di prova privi di informazioni personali. `supabase/config.toml` configura servizi locali, ma non rende il progetto avviabile da zero con tutte le tabelle; inoltre fa riferimento a un `seed.sql` non presente.

Prima di applicare SQL confrontare schema e storia delle migrazioni, predisporre un backup e usare un ambiente di sviluppo. Evitare `db push` o reset indiscriminati verso il progetto remoto.

- [Admin e bozze](docs/admin/README.md): stato degli articoli e gestione media.
- [Ordine delle migrazioni SFT Day](docs/admin/sft-day-migrations.md): dipendenze iniziali del flusso prenotazioni.
- `supabase/migrations/`: elenco completo, incluse le successive restrizioni su contenuti, Storage, limiti antiabuso e `20261027100000_team_day_delete_archived_participant.sql` per eliminare partecipanti archiviati.

Le guide operative contengono anche resoconti storici: per stabilire cosa manca in un ambiente verificare il database effettivo e tutti i file di migrazione.

Per servire immagini da un altro progetto Supabase aggiornare `images.remotePatterns` in `next.config.ts`, che attualmente autorizza il dominio Storage del progetto del sito.

### Accesso amministrativo

Il login usa Supabase Auth. Un amministratore deve avere `app_metadata.role = 'admin'`, assegnato tramite strumenti amministrativi affidabili; avere solo un account autenticato non basta. Non è presente una pagina pubblica di registrazione account; la configurazione Supabase locale disabilita le nuove iscrizioni.

`proxy.ts` aggiorna i cookie e protegge `/admin` e `/login`; layout e azioni amministrative verificano ulteriormente l’utente sul server. Le operazioni privilegiate usano la service role dopo i controlli applicativi.

## Utilizzo

| Percorso | Contenuto |
| --- | --- |
| `/` | Home, presentazione e sezioni eventi. |
| `/team`, `/boat`, `/sponsor`, `/contact` | Team, imbarcazioni, sponsor e contatti. |
| `/blog`, `/blog/[id]` | Articoli pubblicati; le bozze non sono esposte nel blog pubblico. |
| `/career` | Posizioni aperte. |
| `/name-on-wings` | Raccolta «Il tuo nome sulle ali». |
| `/sft-day` | Prenotazioni, conferma e accesso ai biglietti personali. |
| `/sft-day/tickets/[code]` | Biglietto personale; aggiungere `/pdf` per il PDF. |
| `/login` | Accesso amministratori. |
| `/admin`, `/admin/drafts` | Gestione articoli pubblicati e bozze. |
| `/admin/events`, `/admin/positions`, `/admin/media` | Eventi, posizioni e media. |
| `/admin/sft-day` | Prenotazioni, pagamenti, email, archivio e controllo QR. |
| `/privacy-policy` | Informativa privacy pubblica. |

`/team-day` e `/admin/team-day` reindirizzano ai corrispondenti percorsi SFT Day. La lingua italiana è predefinita; il selettore conserva la scelta IT/EN in `localStorage`, senza prefissi di lingua negli URL.

### SFT Day

La configurazione attuale riguarda l’8 novembre 2026, con quota di 15 € a persona e chiusura prenotazioni definita in `app/lib/team-day-config.ts`. Sono ammesse prenotazioni da 1 a 10 persone. Prenotazione, partecipanti, biglietti e lavori email vengono creati nella stessa transazione; i tentativi ripetuti con lo stesso identificatore sono gestiti senza duplicare la prenotazione.

PayPal e Revolut sono link esterni; bonifico e contanti prevedono anch’essi conferma manuale. Il clic su un link o il ritorno sul sito non conferma un incasso. L’admin aggiorna lo stato dopo la verifica.

Un errore email non annulla la prenotazione. L’admin può recuperare invii in sospeso; per automatizzarli occorre configurare un pianificatore esterno che chiami `POST /api/sft-day/emails` con intestazione `Authorization: Bearer <CRON_SECRET>`. Il repository non configura tale pianificatore. Lo stato email `sent` indica accettazione dal provider, non consegna nella casella.

Per procedure, reinvii, QR, archiviazione e gestione ingressi leggere [SFT Day: biglietti e ingressi](docs/admin/sft-day-tickets.md). Chi possiede il link personale può visualizzare il biglietto: non inserirlo in issue o screenshot pubblici.

## Architettura

Applicazione **Next.js 16.4.3** con App Router, **React 19**, **TypeScript**, **Tailwind CSS 3.4** e design system SFT distribuito come pacchetto locale. Usa Framer Motion e Lucide per animazioni e icone, Supabase per PostgreSQL/Auth/Storage, `pdf-lib` e `qrcode` per i biglietti, ZXing per la scansione QR, Resend via HTTP per le email e Telegram per alcune notifiche.

```text
app/
├── page.tsx, layout.tsx       Home, layout e provider globali
├── team/, boat/, sponsor/…   Pagine pubbliche e componenti delle sezioni
├── blog/                     Elenco articoli e dettaglio per ID
├── admin/                    Pagine di gestione protette
├── actions/                  Server Actions pubbliche e amministrative
├── api/                      Logout e recupero email SFT Day
├── lib/                      Accesso dati, sicurezza, biglietti, PDF ed email
│   └── db/                   Letture e scritture editoriali
├── components/               Componenti condivisi
├── context/, translations/   Stato lingua e testi IT/EN
├── sft-day/, team-day/        Route pubbliche e implementazione evento
└── __tests__/                Test Jest
proxy.ts                      Sessioni e protezione percorsi admin
public/                       Asset statici e marchio
supabase/                     Configurazione locale e migrazioni incrementali
scripts/                      Verifiche SQL e PDF
tests/security/               Regressione patch braces
vendor/, patches/             Design system e patch dipendenze
docs/                         Guide operative, audit e note di design
.github/                      Workflow audit e configurazione Dependabot
```

Le pagine server leggono i contenuti tramite `app/lib/db/`; i componenti client gestiscono interazioni e lingua. Le Server Actions validano gli input e coordinano accesso dati e invalidazione delle pagine. `supabase.ts` è il client browser, `supabase-server.ts` gestisce sessioni e autorizzazione, `supabase-admin.ts` è riservato al server. Le RPC PostgreSQL gestiscono le operazioni atomiche dell’evento. Il PDF viene generato sul server con font locali.

## Sviluppo

| Comando | Effetto |
| --- | --- |
| `bun run dev` | Server di sviluppo con Turbopack. |
| `bun run build` | Build di produzione. |
| `bun run start` | Avvio della build esistente. |
| `bun run test` | Jest; la configurazione attuale raccoglie anche la coverage. |
| `bun run test:watch` | Jest in modalità watch. |
| `bun run test:coverage` | Coverage esplicita in `coverage/`, con report testo e LCOV. |
| `bun run lint` | Script presente ma attualmente non funzionante; vedere troubleshooting. |
| `bunx tsc --noEmit` | Verifica TypeScript. |

Usare `bun run test` per eseguire Jest: `bun test` invoca invece il test runner nativo Bun.

Per modificare il sito:

- Affiancare i testi italiano/inglese nei file di `app/translations/`.
- Aggiornare roster e sponsor rispettivamente in `app/team/roster.ts` e `app/sponsor/sponsors.ts`; i contenuti editoriali vengono gestiti dall’admin.
- Riutilizzare componenti e stili del design system; `app/layout.tsx` importa gli stili del pacchetto e gli adattamenti in `app/design-system.css`.
- Per aggiornare `@sft/design-system`, versionare il nuovo archivio in `vendor/` e aggiornare dipendenza e lockfile insieme.
- Seguire [AGENTS.md](AGENTS.md). Prima di modificare codice Next.js leggere le guide pertinenti in `node_modules/next/dist/docs/`, distribuite con la versione installata.

## Test e verifiche

Verifiche applicative principali:

```bash
bunx tsc --noEmit
bun run test --runInBand --coverage=false
node --test tests/security/braces-depth.test.cjs
bun run build
```

Test mirati:

```bash
bun run test app/__tests__/admin --runInBand --coverage=false
bun run test app/__tests__/team-day --runInBand --coverage=false
```

Le suite coprono componenti pubblici, autorizzazione e gestione contenuti/media, registrazioni, pagamenti, biglietti, email e interazioni admin. I test Jest usano simulazioni delle dipendenze dove necessario: non provano incassi, consegna email o comportamento del database remoto.

Verifiche aggiuntive da eseguire quando pertinenti:

| Comando | Prerequisiti e limiti |
| --- | --- |
| `python3 scripts/test-team-day-db.py` | PostgreSQL locale temporaneo; binari individuati tramite `SFT_POSTGRES_BIN`, Homebrew o PATH. Verifica migrazioni e integrità del flusso evento. Alcune prove dipendono dalla data di chiusura delle prenotazioni. |
| `python3 scripts/test-security-db.py` | PostgreSQL locale temporaneo; lo script usa attualmente il percorso fisso `/opt/homebrew/opt/postgresql@17/bin`. Verifica RLS, privilegi e limiti atomici. |
| `bun --conditions=react-server scripts/test-team-day-pdf.ts` | Richiede Poppler; verifica PDF e decodifica QR dal rendering. Riscrive l’esempio versionato in `docs/admin/examples/sft-day-ticket-example.pdf`: controllare il diff dopo l’esecuzione. |

La CI versionata in [.github/workflows/security.yml](.github/workflows/security.yml) esegue installazione con lockfile congelato, test della patch braces, `bun audit --audit-level=moderate` e suite Jest su push/PR verso `main` e ogni lunedì. TypeScript e build non sono inclusi in questo workflow: eseguirli prima di proporre una modifica. Il workflow [.github/workflows/dependabot-auto-merge.yml](.github/workflows/dependabot-auto-merge.yml) gestisce i controlli e l’auto-merge degli aggiornamenti Dependabot compatibili.

## Build e distribuzione

Per provare una build locale:

```bash
bun run build
bun run start
```

La build e il rendering delle pagine basate sui dati richiedono un ambiente Supabase configurato e raggiungibile. Se serve verificare il bundler alternativo disponibile in Next.js, usare `bun run build --webpack`.

Il sito usa Vercel per la distribuzione. Nel progetto di hosting configurare credenziali e integrazioni per l’ambiente corretto, Node.js compatibile con `engines`, installazione Bun con lockfile congelato e build Next.js. Le variabili `NEXT_PUBLIC_*` entrano nel bundle durante la build: cambiarle richiede una nuova build.

Le migrazioni database e l’eventuale pianificatore email richiedono operazioni separate. Prima della pubblicazione verificare anche dominio, origine dei link biglietto, mittente Resend, domini immagini, login admin e flussi interessati in un ambiente di prova. Il codice include controlli antiabuso che, su Vercel, usano l’IP inoltrato dalla piattaforma; un hosting diverso richiede una revisione di questo comportamento.

## Troubleshooting

| Sintomo | Controllo o intervento |
| --- | --- |
| `bun install --frozen-lockfile` fallisce | Verificare coerenza tra `package.json` e `bun.lock`, presenza dell’archivio design system e della patch braces; per aggiornamenti intenzionali rigenerare e revisionare il lockfile. |
| Errore «Supabase admin… richieste» o URL Supabase non valido | Impostare le tre variabili Supabase in `.env.local` e riavviare il server. Anche le letture pubbliche server usano la service role. |
| Tabelle, colonne o RPC mancanti | Verificare schema di base e migrazioni applicate al progetto corretto; consultare le guide admin. Non risolvere con un reset remoto. |
| Immagini Storage rifiutate da Next Image | Aggiungere il dominio del proprio progetto a `images.remotePatterns` in `next.config.ts`. |
| Accesso admin reindirizzato al login | Controllare sessione, credenziali e `app_metadata.role = 'admin'`; il ruolo deve essere assegnato sul lato amministrativo. |
| Moduli con «Invio non disponibile» | Verificare RPC dei limiti antiabuso e configurazione Telegram per i moduli che lo usano; controllare i log server senza pubblicare dati personali. |
| SFT Day chiuso o metodo pagamento disabilitato | Controllare data limite in `team-day-config.ts` e validità di URL/IBAN configurati. I pagamenti restano a verifica manuale. |
| Prenotazione presente ma email assente | Verificare configurazione Resend, origine pubblica, stato coda e pannello provider; usare il recupero admin. Un lavoro `review` richiede riconciliazione dell’esito prima di un nuovo invio. |
| Fotocamera QR non disponibile | Consentire l’accesso alla fotocamera e usare HTTPS o localhost; controllare anche le autorizzazioni del dispositivo. |
| `bun run lint` segnala una directory `lint` inesistente | Lo script invoca `next lint`, rimosso in Next.js 16. È necessario migrare lo script alla CLI ESLint e `.eslintrc.json` al formato flat compatibile con ESLint 9; la build non sostituisce il lint. |
| Avviso hydration con `vsc-initialized` sul body | Provare senza estensioni: questo caso è documentato per Video Speed Controller nella guida admin. Altri avvisi richiedono diagnosi separata. |

## Contributi

1. Aprire un’issue per bug o proposte; i modelli sono in `.github/ISSUE_TEMPLATE/`.
2. Creare un branch dedicato da `main`, ad esempio `codex/descrizione-modifica` per interventi svolti con Codex. Chi non ha accesso in scrittura può usare un fork.
3. Limitare la modifica al problema affrontato, mantenere entrambi i testi IT/EN e aggiornare le guide interessate.
4. Eseguire verifiche TypeScript, test pertinenti e build; riportare nella PR i risultati e gli eventuali impedimenti, compreso lo stato del lint.
5. Aprire una pull request verso `main`, descrivendo comportamento, verifiche e migrazioni o configurazioni necessarie. Non includere segreti, dati dei partecipanti o link personali dei biglietti.

Segnalare vulnerabilità secondo [SECURITY.md](SECURITY.md).

## Documentazione e licenza

- [Admin, bozze e media](docs/admin/README.md)
- [SFT Day: biglietti, email e ingressi](docs/admin/sft-day-tickets.md)
- [Migrazioni SFT Day](docs/admin/sft-day-migrations.md)
- [Audit e interventi documentati](docs/audit/README.md)
- [Analisi di sicurezza del 26 ottobre 2026](docs/security/security-audit-2026-10-26.md) e [note di remediation](docs/security/remediation-2026-10-26.md)
- [Privacy nel repository](privacy.md) e [informativa pubblica](https://sapienzafoilingteam.com/privacy-policy)

Gli audit e i resoconti sotto `docs/` descrivono lo stato alle rispettive date: non attestano da soli la configurazione o la sicurezza attuale di produzione.

Il codice è distribuito con [licenza MIT](LICENSE).
