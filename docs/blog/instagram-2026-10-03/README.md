# Aggiornamento blog da Instagram — 3 ottobre 2026

Fonte: https://www.instagram.com/sapienzafoilingteam/

Raccolta completa dei 42 post visibili sul profilo: 28 post con immagini e 14 reel esclusi. Sono state controllate tutte le slide dei caroselli. Nei caroselli misti sono state raccolte esclusivamente le immagini statiche: 88 immagini, conservando l'ordine e la numerazione originali. Una cattura accidentale della slide video 7 di Dc_-pzyES0T è stata esclusa dalle immagini utilizzate.

Reel esclusi: DdUWAyAxAVt, DdR6R33x3Mn, DdPXNo0R_uI, DdMtXB0RL4N, DdKL6Wexg9P, DdJh4pulYKv, DdHaMPloKMa, DdFBLUAx9vF, DdCZcMVRG0k, DZkB7bwI1Tv, DYkoqHyIDlh, DXzJuYzjUs1, DRcIfaDCM9-, DJuPPHVI8-g.

Slide video escluse dai caroselli: Dc_-pzyES0T (7), DU0iMAniFrF (1), DTlCzACCJpN (4), DPg8xgICPHA (4 e 9), DHgtiTyomOb (3 e 4), DGgTTa6IqWX (2), DFnDxIuoNqt (3, 4 e 5).

20 articoli nuovi in italiano e inglese; 8 articoli precedenti integrati con galleria e fonte, mantenendo ID e date. Corretto il riferimento a quattro giorni nel precedente articolo sul Rome Foil Festival: le date 16–18 maggio corrispondono a tre giorni. Gli articoli sulla brochure e il precedente vlog 2025 sono preservati.

Il riepilogo Garda 2026 annuncia il futuro vlog integrale senza copiare o incorporare i video di Instagram. Il recruiting riporta la scadenza originale del 12 ottobre 2026; gli eventi passati sono raccontati come archivio, senza inviti di prenotazione attuali.

- `manifest.json`: fonte, data e corrispondenza tra slide e catture locali.
- `articles.json`: contenuti editoriali pronti per la pubblicazione.
- `posts-before.json` e `posts-immediately-before.json`: backup prima delle modifiche.
- `posts-after.json` e `published.json`: verifica e collegamenti degli articoli pubblicati.
- Immagini WebP: `public/blog/instagram/`, con copie pubbliche nel bucket `images`, cartella `blog/instagram/2026-10-03/`.

Le modifiche riguardano i contenuti nel database e nello storage; non richiedono modifiche ai componenti del sito. Il blog e i dettagli degli articoli hanno una cache con rinnovo ogni ora.

## Verifica del sito e correzione necessaria

La pubblicazione dei contenuti ha fatto emergere un errore preesistente nei dettagli generati a richiesta: il caricamento di `jsdom` falliva nel runtime Vercel per una dipendenza ESM (`@exodus/bytes`). La pagina principale ha invece aggiornato correttamente la propria cache.

È stata fissata `jsdom` alla versione `26.1.0` in `package.json` e nel lockfile, conservando DOMPurify e la sanificazione dei contenuti. Si tratta di un vincolo di compatibilità da rivalutare quando il tracing delle dipendenze ESM nel runtime Vercel sarà compatibile. Riferimento: https://github.com/jsdom/html-encoding-sniffer/issues/25.

Verifiche: installazione pulita con lockfile, TypeScript, 24 test, compilazione locale e Vercel, mantenimento delle 88 immagini in entrambe le lingue dopo la sanificazione, rimozione di script e attributi non sicuri. Il rilascio è stato controllato prima di assegnargli il dominio: articolo 200, URL inesistente 404.

Rilascio pubblico: `dpl_Afq7uFp2M3NZ8TRwPMES2XmzebaN`, https://sapienzafoilingteam-fmatz1e6m-nannipy-projects.vercel.app. Rilascio precedente per eventuale rollback: `dpl_8jETHJBdAzf8PMnZehjD42yGsADT`, https://sapienzafoilingteam-ou8f5qaws-nannipy-projects.vercel.app.

Tutti i 28 dettagli pubblicati sono stati verificati sul dominio pubblico; il blog contiene i relativi collegamenti. Controllati nel browser il blog, l'articolo sul Garda, la galleria e il cambio italiano/inglese. Le catture `blog-published.jpg` e `garda-published.jpg` documentano il risultato.
