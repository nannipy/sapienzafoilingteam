# SFT Day: prenotazioni, biglietti e ingressi

Il flusso è implementato sul sito in `/sft-day` e `/admin/sft-day`. Le migrazioni sono state applicate dall’utente; il servizio email richiede le configurazioni indicate sotto. Il codice non è stato pubblicato durante questa attività.

## Dati e conferma

Una prenotazione contiene da 1 a 10 partecipanti. Nome, cognome, email del referente e presa visione privacy sono obbligatori; email personali degli accompagnatori e note alimentari restano facoltative. I biglietti dei partecipanti senza email personale vengono inviati all’email del referente come messaggi individuali. Ogni persona ha un biglietto e un codice UUID casuale proprio; il QR contiene solo `sft:<codice>`, senza nomi, email o identificatori di prenotazione.

La conferma della prenotazione non attesta il pagamento. La quota resta 15 € per persona, fissata sul server e nel database; una prenotazione di due persone totalizza 30 €. Contanti, bonifico, Revolut e PayPal mantengono la verifica manuale già prevista. I link online non impostano automaticamente il totale: chi paga deve usare il totale della prenotazione, indicato nella schermata.

Il salvataggio avviene con `register_team_day_booking`: prenotazione, partecipanti, biglietti e lavori email sono nella stessa transazione. La richiesta ha un UUID persistente nella sessione del browser e un confronto dei dati: un tentativo ripetuto restituisce la stessa prenotazione, un payload diverso con lo stesso UUID viene rifiutato. L’email del referente rimane univoca secondo la regola esistente. La vecchia RPC `register_team_day` resta compatibile e genera anch’essa il biglietto, per consentire il passaggio tra versioni del sito.

## Migrazione

Applicare in ordine sul progetto Supabase **del sito**, riferimento locale `caldljublqwsgsafcxun`:

1. `20261026120000_team_day_registrations.sql`
2. `20261026123000_team_day_bank_transfer.sql`
3. `20261026130000_team_day_optional_email_allergies.sql`
4. `20261026140000_team_day_tickets.sql`
5. `20261026150000_team_day_archive_and_scan_status.sql` (archivio persone + stato pagamento nel controllo ingressi)

Prima controllare la storia delle migrazioni e lo schema remoto: non rieseguire quelle già applicate. Se lo schema esiste ma manca la storia, ricostruirla coerentemente prima del push. Conservare un backup secondo la procedura del progetto. La quarta migrazione è additiva: conserva ID, codici prenotazione, pagamenti e prova privacy; crea un partecipante e un biglietto per ogni prenotazione preesistente e accoda le email disponibili. Non modifica le tabelle degli eventi editoriali: `team_day_events` rappresenta l’evento prenotabile, separato dalle schede pubblicate nel calendario editoriale. La quinta migrazione aggiunge `archived_at`/`archived_by`, estende `control_team_day_ticket` con stato pagamento, metodo, importo e ID prenotazione, e sostituisce `list_team_day_bookings` con il filtro archiviati. Va applicata prima di usare archivio e nuovo controllo ingressi.

Tabelle con RLS e nessun accesso per `anon`/`authenticated`. Solo il server con `service_role` può chiamare le RPC. Ogni azione admin richiede la sessione con `requireAuth`, come le altre sezioni del sito. Il controllo ingressi usa un lock sulla riga del biglietto, filtra l’evento e registra data e operatore. Due operatori contemporanei non possono ammettere due volte lo stesso biglietto. Non annullare un ingresso già registrato: il codice resta `used`, preservando il controllo dei duplicati.

**Stato della verifica (26 ottobre 2026):** l’utente conferma di aver applicato tutte le migrazioni. Controllo remoto in sola lettura riuscito: `list_team_day_bookings` risponde con righe e conteggio nel formato previsto; `control_team_day_ticket` con azione `verify` riconosce correttamente un codice casuale come `not_found`. Nessuna prenotazione o ingresso di prova è stato creato. Le prove di concorrenza restano quelle eseguite sul PostgreSQL locale. La storia CLI delle migrazioni non è stata riletta.

Nell’ambiente locale risultano assenti `RESEND_API_KEY`, `SFT_TICKET_EMAIL_FROM`, `SFT_PUBLIC_URL` e `CRON_SECRET`. Le variabili di produzione Vercel non sono state verificate: il collegamento non è autorizzato al team del progetto.

## Email recuperabili

Configurare `RESEND_API_KEY`, `SFT_TICKET_EMAIL_FROM` con dominio mittente verificato e `SFT_PUBLIC_URL` HTTPS. Ogni biglietto ha un lavoro iniziale univoco; contiene dettagli evento, nome, QR PNG incorporato, biglietto PDF personale allegato e link per scaricarlo. La richiesta esatta al provider viene salvata prima dell’invio. Un errore del servizio non annulla la prenotazione.

Gli invii sono protetti da lease nel database e da una chiave Resend `sft-ticket/<id lavoro>`. Un tentativo ripetuto riutilizza esattamente corpo e chiave. Il recupero applica attese crescenti e salta i biglietti annullati (stato terminale `suppressed`). Gli amministratori possono usare «Invia / reinvia email» o «Recupera email in sospeso»; un reinvio volontario dopo un invio concluso crea un nuovo lavoro e non è consentito entro un minuto. Una richiesta incerta oltre 23 ore diventa `review`: occorre riconciliare l’esito nel provider prima di autorizzare un nuovo invio, perché [Resend conserva le chiavi per 24 ore](https://resend.com/changelog/idempotency-keys). Per evitare duplicati, la UI non forza i lavori `review`.

Lo stato `sent` significa accettato dal servizio, non consegnato nella casella: consegna e rimbalzi vanno verificati nel provider. Le pagine biglietto sono documenti HTML/CSS autonomi con testo bilingue, per evitare il layout pubblico e i relativi tracker; sono private senza analytics, con cache disabilitata, noindex e no-referrer. Le regioni di conferma/admin contenenti codici e dati personali bloccano l’autocapture PostHog. Chi possiede un link al biglietto può visualizzarlo: trattarlo come un documento personale.

Per il recupero automatico configurare un pianificatore esterno che chiami `POST /api/sft-day/emails` con `Authorization: Bearer <CRON_SECRET>` (consigliato ogni cinque minuti). Il pianificatore non è configurato da questo cambiamento. Senza pianificatore restano il tentativo alla prenotazione e il recupero admin. Non usare il segreto in URL. La coda elabora fino a 20 lavori per richiesta.

## PDF con QR code

Ogni partecipante riceve un normale biglietto PDF in formato A5, con nome, evento, data, luogo, codice personale e QR vettoriale. Il PDF si scarica dalla conferma, dalla pagina del biglietto e dall’admin; è anche allegato alla singola email. Si può mostrare dal telefono oppure stampare. Non sono richiesti Wallet, account Apple/Google, certificati o chiavi di firma.

Il QR mantiene il codice personale già gestito dal database; il controllo ingressi e gli stati valido/utilizzato/annullato restano gli stessi. Il PDF scaricato riporta lo stato attuale del biglietto, mentre la verifica all’ingresso controlla sempre il database, anche quando viene mostrata una vecchia stampa. Nessuna nuova migrazione è necessaria per sostituire i pass con PDF.

Le sole variabili esterne per inviare le email sono elencate in [sft-day.env.example](./sft-day.env.example). Il font Geist già presente nel progetto viene incorporato nel PDF e incluso nei file distribuiti sul server.

Esempio dimostrativo, non valido per l’ingresso: [biglietto PDF](./examples/sft-day-ticket-example.pdf).

## Gestione operativa

L’admin cerca nome, email, codice prenotazione o codice biglietto su tutte le prenotazioni, con pagine da 50 record e riepiloghi sul risultato completo. Su mobile il controllo ingressi è in cima alla pagina con fotocamera a tutta larghezza e «Registra ingresso» ben separato; le prenotazioni sono schede espandibili invece di una tabella orizzontale.

Ogni prenotazione mostra i partecipanti, note alimentari, stato dei singoli biglietti, email e ingresso. Per ogni biglietto «Mostra QR» apre il QR personale con download, «Scarica QR», «Scarica PDF» e link al biglietto; il codice si copia con un tocco. L’elenco mostra per ogni persona i tre stati **Prenotato → Pagato → Entrato**, il codice biglietto e il metodo di pagamento della prenotazione. Il pulsante «Archivia persona» rimuove la persona dall’elenco e blocca il suo QR; «Mostra archiviati» la riporta in vista e consente il ripristino. Per un ingresso:

1. Avviare «Scansiona QR» da browser HTTPS con permesso fotocamera, oppure inserire il codice.
2. «Verifica» identifica la persona e mostra nome e cognome, stato del pagamento (pagato / da pagare, con importo e metodo), stato d’ingresso (entrato / non ancora entrato) e i tre stati Prenotato → Pagato → Entrato.
3. Se il pagamento è ancora da verificare, «Segna come pagato» aggiorna subito la prenotazione; l’avviso ricorda di incassare la quota. Verificare la persona e premere «Registra ingresso» per l’ammissione.
4. Un nuovo tentativo sullo stesso codice mostra l’ingresso già registrato e l’orario; non ammettere di nuovo.
5. Una persona archiviata restituisce «Persona archiviata» e non può essere ammessa. Il ripristino avviene dall’elenco con «Mostra archiviati».

## Prove e limiti

- `npx jest app/__tests__/team-day --runInBand --coverage=false`: azioni, validazione, interazioni, errori/ripetizioni, invii con provider simulato.
- `python3 scripts/test-team-day-db.py`: upgrade di dati esistenti, atomicità, gruppi, codici distinti, accessi concorrenti, revoca permessi pubblici, lease email e finestra idempotenza, ricerca e paginazione oltre 1000 record.
- `bun --conditions=react-server scripts/test-team-day-pdf.ts`: PDF personale a una pagina, nomi accentati/lunghi, stato annullato e decodifica del QR dal PDF realmente renderizzato.
- `npx tsc --noEmit` e `bun run build --webpack`: controlli finali superati. La build Turbopack iniziale è passata; una ripetizione dopo le modifiche ha incontrato un errore locale di avvio processi/porte. La verifica finale completa usa Webpack senza modificare il comando build del progetto.
- Verifica corrente PDF: 60 test del flusso SFT Day passati, incluso allegato PDF e comandi di download; build Webpack e TypeScript superati. Il QR è stato decodificato dal PDF renderizzato anche con un nome di 160 lettere larghe.
- Revisione indipendente statica completata; corretti anche ricerca incompleta, note degli accompagnatori, autocapture e recupero invii annullati. Analisi e revisione hanno aperto circa 45 risorse e usato circa 25 ricerche (stime); il controllo renderizzato è stato eseguito dall’autore, non dal revisore.
- Browser locale: locandina visibile subito, layout desktop e mobile 390 px, passaggio dati/riepilogo di due persone con totale 30 €. Nessuna prenotazione di prova inviata al database remoto.

Prima dell’uso reale: pubblicare questa versione del sito; configurare provider email e segreti; verificare una prenotazione reale di gruppo, ricezione email con PDF allegato, apertura e stampa del PDF e scansione fisica dall’admin autenticato. Questi controlli non sono sostituiti dai test locali. Non è stato verificato il flusso browser → Supabase remoto → casella email con PDF → ingresso reale.
