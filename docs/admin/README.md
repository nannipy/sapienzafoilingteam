# Admin e bozze articoli

Le sezioni `/admin` e `/admin/drafts` condividono lo stesso editor. Una bozza richiede solo il titolo italiano; pubblicare richiede titolo e contenuto in entrambe le lingue. Gli articoli pubblicati possono tornare in bozza tramite “Salva bozza”. Non è previsto un salvataggio automatico.

## Attivazione database

La migrazione `supabase/migrations/20261006120000_article_drafts.sql` è stata applicata dall’utente e la presenza del campo `status` è stata verificata il 6 ottobre 2026. Per altri ambienti, applicarla prima di usare i nuovi pulsanti di salvataggio. La migrazione preserva gli articoli esistenti come pubblicati, introduce lo stato e aggiunge una policy restrittiva che nasconde le bozze agli utenti anonimi, anche in presenza di altre policy permissive. Le regole degli utenti autenticati restano quelle esistenti. Non eseguire un `db push` indiscriminato: questo repository non contiene una baseline completa dello schema remoto.

Il blog mantiene la compatibilità di lettura con gli articoli precedenti alla migrazione. Le scritture con il nuovo stato richiedono la migrazione. Le bozze vengono escluse dal blog, dai metadati, dalla generazione delle pagine e dalla sitemap; gli URL pubblici delle bozze restituiscono 404. Le modifiche invalidano anche la pagina pubblica dell’articolo e la sitemap.

## Verifica

- `npx tsc --noEmit`
- `npx jest app/__tests__/admin --runInBand --coverage=false`
- `npm run build -- --webpack`

Test mirati: salvataggio incompleto, controllo dei campi prima della pubblicazione, passaggio bozza/pubblicato, ritorno in bozza, esclusione delle bozze dai dati pubblici, testo editor conservato durante la modifica del titolo e messaggi di conferma visibili.

Le immagini `admin-desktop.png` e `admin-mobile.png` mostrano i componenti reali con azioni simulate e contenuti di prova locali, senza autenticazione né scritture remote. Rendering verificato a 1280 e 390 pixel; a 390 pixel la pagina non presenta overflow orizzontale. Il percorso temporaneo di anteprima è stato rimosso.

La presenza del campo remoto è stata verificata dopo l’applicazione della migrazione da parte dell’utente. Il ciclo di salvataggio di una bozza reale e la sua esclusione dagli accessi anonimi restano da verificare; al momento del primo controllo non esistevano bozze.

## Esito controlli del 6 ottobre 2026

Build webpack e TypeScript riusciti. I 10 test admin passano, inclusi autenticazione e paginazione dei media. La suite complessiva precedente ha 26 test riusciti e 4 fallimenti preesistenti nel popup recruiting: il test presume una data precedente al 4 ottobre ma non imposta l’orologio. Lint verificato con la configurazione flat temporanea equivalente ai preset Next del progetto, perché la configurazione legacy esistente non è compatibile con ESLint 9.

Dopo l’applicazione della migrazione da parte dell’utente, una lettura del database remoto ha confermato che `posts.status` esiste: 30 articoli pubblicati, 0 bozze e nessuno stato non valido. La lettura anonima restituisce gli stessi 30 articoli pubblicati. Non è stato eseguito un deploy.

Per la build è stata esclusa una vecchia installazione locale di jsdom 30 annidata sotto isomorphic-dompurify; il progetto usa ora jsdom 26.1.0. L'override già presente in `package.json` e il relativo `bun.lock` sono inclusi nella pubblicazione in un commit separato, perché necessari a riprodurre la build riuscita. La vecchia copia locale è conservata in `/private/tmp/sft-stale-jsdom-20261006`.

## Sessione e media

Il layout admin verifica la sessione sul server. In assenza di una sessione valida, indirizza al login; i reindirizzamenti del proxy conservano i cookie aggiornati. Il client riceve l'utente verificato e gestisce il logout.

La lettura dei media passa da un'azione server autenticata, con paginazione, senza aprire nuove policy pubbliche. Le cartelle sono riconosciute dall'assenza di un ID; i file segnaposto sono nascosti nella griglia. Gli errori rimangono visibili con un pulsante per riprovare e le risposte tardive non sostituiscono il contenuto della cartella corrente.

Verificati con la sessione reale il caricamento della radice e della cartella `blog`, incluse le immagini. `media-verificati.png` documenta il risultato. Upload e cancellazione non sono stati eseguiti durante questa verifica.

Il messaggio di hydration sul `body.className` è stato ricondotto all'estensione Video Speed Controller: il browser aggiunge `vsc-initialized` prima dell'hydration. Il browser senza estensione non presenta il messaggio. Disabilitare l'estensione per localhost risolve questa causa; non sono stati nascosti gli avvisi né modificati i font.

## Correzioni sicurezza del 6 ottobre 2026

Next.js ed eslint-config-next sono aggiornati alla 16.3.8; source-map-js è vincolato ad almeno 1.2.2. Questi aggiornamenti correggono GHSA-vcvr-r3jv-pc5j e GHSA-68fv-2mgg-jv7q.

Per GHSA-vfj7-8cjw-p6xm non esiste una release corretta di braces. `patches/braces@3.0.3.patch`, applicata automaticamente da Bun, limita a 100 la profondità del parser (parentesi e graffe) e dei tre percorsi ricorsivi compile/expand/stringify, anche per AST forniti dal chiamante. Gli input troppo profondi producono un errore di validazione prima dell'esaurimento dello stack. I normali glob mantengono il comportamento precedente.

La CI esegue `node --test tests/security/braces-depth.test.cjs` prima dell'audit: 8 test coprono gli input ostili e il comportamento ordinario. L'eccezione audit aggiunta per questo solo advisory è necessaria perché l'audit controlla la versione e non riconosce la patch. Rimuovere patch ed eccezione quando sarà disponibile una release upstream corretta. Le eccezioni preesistenti restano documentate nel workflow.

Verificati installazione pulita con lockfile congelato e applicazione automatica della patch, test di sicurezza e audit con le eccezioni documentate.
