# Team Day — 8 novembre 2026

Modulo pubblico: `/team-day`. Prenotazioni riservate agli amministratori: `/admin/team-day`.
Quota fissa: 15 € per persona. Una registrazione per email; per modifiche il partecipante contatta il team. Il modulo mostra un codice dopo il salvataggio: non invia email o messaggi Telegram.

## Attivazione

Prima di pubblicare applicare sul progetto Supabase del sito le migrazioni `supabase/migrations/20261026120000_team_day_registrations.sql` e `supabase/migrations/20261026123000_team_day_bank_transfer.sql`, in questo ordine. La nuova tabella ha RLS e non concede accesso a `anon` o `authenticated`; letture e modifiche passano dalle azioni server con la chiave service role. Le azioni admin verificano la sessione come il resto dell'area admin. La migrazione è stata verificata su PostgreSQL temporaneo locale, non applicata al database remoto.

Senza ulteriori configurazioni è selezionabile solo «Contanti all’evento». Per attivare i pagamenti online configurare sul server e ricompilare/ridistribuire:

- `TEAM_DAY_PAYPAL_URL`: link HTTPS dell'evento su paypal.com o paypal.me.
- `TEAM_DAY_REVOLUT_URL`: link HTTPS dell'evento su revolut.me, checkout.revolut.com o pay.revolut.com.
- `TEAM_DAY_BANK_IBAN` e `TEAM_DAY_BANK_ACCOUNT_HOLDER`: IBAN e intestatario del bonifico. Lasciarli vuoti fino alla consegna delle coordinate reali: il bonifico compare disattivato, senza dati fittizi. Con entrambi configurati e checksum IBAN valido, la conferma mostra le coordinate e la causale `SFT DAY <codice prenotazione>`.

I link devono corrispondere alla quota di 15 €: il sito non imposta l'importo sul portale esterno. Non vengono riutilizzati account di altre raccolte. Il modulo salva sempre lo stato `pending`; il rientro dal link non dimostra il pagamento. L'amministratore verifica l'incasso e usa «Segna come pagato»; può ripristinare lo stato in caso di errore. L'integrazione è tramite link con verifica manuale, non tramite API/webhook PayPal o Revolut Pay.

Le prenotazioni si chiudono alla fine dell'8 novembre, fuso Europe/Rome. Retry dello stesso invio non creano doppioni; la quota e lo stato iniziale sono fissati nel database. Soglia antiabuso: 100 salvataggi per ora e IP (memorizzato solo come hash con chiave), compatibile con un Wi-Fi condiviso. Non è un limite di capienza.

## Da completare per l'evento

Locandina originale aggiunta: `public/events/sft-team-day-2026-11-08.png`. Inizio confermato dall'organizzatore: domenica 8 novembre 2026 alle 12:00, Aeroporto dell'Urbe, Via Salaria 825, Roma. La grafica originale riporta 12.00am; la pagina riporta mezzogiorno come confermato. Eventuale capienza ancora da comunicare. Dopo attivazione del database e pubblicazione verificare una prenotazione reale, l'elenco admin e la registrazione del pagamento. Nessun incasso online è verificato dai test locali.

## Test del flusso di pagamento

Eseguire `npx jest app/__tests__/team-day --runInBand --coverage=false` per i test di azioni server e interazioni del modulo. I link e le coordinate usati nei test sono esempi fittizi; il database Supabase e le azioni server sono simulati dove necessario. Sono coperti PayPal e Revolut (link solo dopo salvataggio, stato non confermato anche dopo il clic), bonifico (coordinate e causale), metodi disabilitati, errori e retry senza perdita dei dati, invio doppio e verifica admin.

Eseguire `python3 scripts/test-team-day-db.py` per applicare entrambe le migrazioni su PostgreSQL temporaneo locale e verificare i quattro metodi con quota fissa e stato iniziale pending, concorrenza, duplicati, accesso pubblico negato e passaggio paid/pending autorizzato. Il database temporaneo viene fermato e rimosso al termine; richiede binari PostgreSQL server, configurabili con `SFT_POSTGRES_BIN`. I test SQL del flusso aperto vanno eseguiti prima della chiusura delle prenotazioni dell'evento.

Questi test non eseguono incassi né verificano API o webhook dei fornitori. Una prova reale richiederà i link ufficiali e le coordinate effettive.
