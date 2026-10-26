# Migrazioni SFT Day: ordine di applicazione

Cartella: `supabase/migrations/` del sito `02_Software/Sito_Web/sapienza-foiling-team`.

Per il flusso prenotazioni, partecipanti, biglietti PDF, email e ingressi servono, in questo ordine:

1. **`20261026120000_team_day_registrations.sql`** — tabella prenotazioni, codici, pagamenti, privacy, RLS e prima funzione di registrazione.
2. **`20261026123000_team_day_bank_transfer.sql`** — aggiunge il bonifico ai metodi di pagamento accettati.
3. **`20261026130000_team_day_optional_email_allergies.sql`** — rende facoltativa l’email, salva le note alimentari e aggiorna la funzione di registrazione.
4. **`20261026140000_team_day_tickets.sql`** — relazioni evento/prenotazione/partecipante/biglietto, gruppi, generazione e recupero email, QR personali, ricerca admin e controllo ingressi atomico; conserva le prenotazioni precedenti creando i relativi biglietti.
5. **`20261026150000_team_day_archive_and_scan_status.sql`** — archivio delle persone, filtro archiviati nella ricerca admin e stato pagamento/metodo/importo restituiti dal controllo QR.

Il PDF viene creato dal sito a partire dai dati del biglietto: **non richiede migrazioni aggiuntive**, né certificati Wallet.

Applicare ogni migrazione una sola volta e saltare quelle già registrate nella storia del database. Non eseguire direttamente la quinta se la quarta non è presente. Se le tabelle esistono ma la storia delle migrazioni è vuota, verificare lo schema e allineare la storia prima di procedere.

Nella stessa cartella esiste anche `20261006120000_article_drafts.sql`: riguarda le bozze del blog, non il sistema prenotazioni. Con il normale deploy di tutte le migrazioni del repository, l’ordine cronologico completo è questa migrazione del blog seguita dalle cinque sopra; non eseguirla se risulta già applicata.

Le quattro migrazioni dell’evento sono state provate su PostgreSQL locale con dati esistenti. Il 26 ottobre 2026 l’utente conferma di averle applicate al remoto; la verifica in sola lettura delle nuove funzioni ricerca prenotazioni e verifica biglietti è riuscita. Non sono state create prenotazioni o registrati ingressi durante questo controllo. La quinta migrazione è nuova: va applicata prima di usare archivio e riepilogo pagamento nella scansione.
