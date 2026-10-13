# Adozione Design System SFT — primo incremento
13 ottobre 2026. Stato: implementato e verificato in locale, non pubblicato.

## Risultato
Homepage, navigazione pubblica, footer e banner cookie adottano la libreria @sft/design-system 1.1.1. Il sito mantiene Tailwind 3; il kit fornisce un foglio di stile compilato con utility circoscritte alle aree .sft-root. I font continuano a essere caricati da next/font/local.

La homepage mantiene fetch server degli eventi e revalidate a 60 secondi. Gli eventi visualizzati provengono dal sito; non sono dati dimostrativi del catalogo. Link, lingua persistente, rifiuto/accettazione cookie e tracciamento delle CTA/navigation mantengono le integrazioni esistenti.

## Cambiamenti
- Header con marchio completo, link attivo, cambio lingua e menu mobile richiudibile con Escape. Il menu è una navigazione espandibile, non una finestra modale.
- Hero editoriale nella libreria condivisa, con pannello bordeaux separato dalla fotografia e un solo h1.
- Galleria con le sette fotografie esistenti, controlli avanti/indietro e swipe. Scorrimento automatico ogni cinque secondi, con pausa e rispetto della preferenza di movimento ridotto; rimossa la didascalia sopra la foto.
- Schede barca con immagini separate dai testi, eventi su superfici chiare e CTA del team.
- Footer con marchio, recapito, social e privacy; rimosso il link Terms of Service che puntava solo a #. Copyright con anno corrente.
- Banner cookie con pulsanti condivisi, mantenendo le chiavi di consenso e PostHog.
- La lingua del documento si aggiorna al cambio IT/EN.
- Package installato da vendor/sft-design-system-1.1.1.tgz; versione registrata nel package.json e bun.lock. Nessun aggiornamento intenzionale delle dipendenze preesistenti.

## Libreria comune
Aggiunti styles.next.css senza font-face e senza utility globali fuori da .sft-root, ingresso identity senza use client per BrandLockup ed EditorialHero e verifica automatica dell'isolamento in build. Corretto Button outline affinché il testo resti leggibile su superfici inverse.

I contenuti in portal richiedono un contenitore .sft-root dedicato. Questa adozione non usa nuovi controlli in portal. Evitare di mettere il tema sul body durante la migrazione graduale. Gli stili delle composizioni specifiche del sito sono in app/design-system.css; varianti e primitive comuni rimangono nel kit.

## Verifiche
- Build Next con generazione delle pagine e TypeScript: superata.
- 36 test del sito, 11 suite: superati.
- 29 test della libreria: superati.
- Isolamento del CSS, assenza font-face nell'adattatore e ingresso statico senza direttiva client: verificati.
- git diff --check e controllo TypeScript separato: superati.
- Browser sulla build compilata: desktop a 1280 px, mobile a 390 e 320 px; nessun overflow orizzontale nei controlli eseguiti.
- IT/EN, cambio foto, rifiuto cookie, menu mobile/Escape verificati; h1 unico e Kelson effettivo osservati.
- Navigazione verso Team, Blog e Career verificata sulla build locale; pagine interne mantengono i layout precedenti fuori dal tema.
- Screenshot iniziale desktop e screenshot finali desktop/mobile salvati in previews.

La suite di baseline aveva quattro errori nel RecruitingPopup perché presumeva una data precedente alla scadenza. I test ora fissano esplicitamente la data; il comportamento e la scadenza del componente non sono stati cambiati. Non sono state eseguite nuove prove di invio form o operazioni sui dati reali.

## Restano nel piano
Pagine interne, moduli pubblici, login, area amministrativa, CRM, telemetria e app. Il popup recruiting resta un componente precedente e attualmente non compare dopo la sua scadenza; la sua migrazione visuale sarà parte del lotto dei flussi pubblici. Esiste un'incoerenza precedente fra scadenza del popup e alcune traduzioni del recruiting: va risolta con una data confermata, non dedotta durante un intervento grafico.

Non è stata effettuata una certificazione completa di accessibilità né una misurazione comparativa LCP/CLS. Non sono stati eseguiti commit, push o deployment. I materiali blog non tracciati già presenti sono preservati.

## Revisione
Avviare la build con bun run start --port 5181 e aprire http://localhost:5181/.
La consegna corrente serve per rivedere homepage e navigazione prima della migrazione delle pagine interne.

## Correzioni richieste alla navbar e alla homepage

Marchio della navbar con due righe di pari larghezza, peso 800 e colore #822433. Navbar con bordo arrotondato. Seconda sezione a fondo #822433, titoli e introduzione bianchi. Verifica browser: righe del marchio entrambe 156 px su desktop; nessun overflow a 320 px. Build e 36 test superati.


## Revisione visiva 1.1.2

SFT nella sezione finale bianco sul rosso. Navbar e card senza contorno netto, con ombre condivise nel kit. La navbar passa da 96 a 68 px di altezza dopo lo scroll (mobile 80 a 64 px), si avvicina al bordo superiore e torna estesa in cima o con menu aperto. Transizioni disattivate con movimento ridotto. Verificati desktop e mobile a 320 px, senza overflow; build sito e kit riuscite, 37 test sito e 29 test kit passati.


## Marchio e intestazione — 1.1.3

Navbar con il solo simbolo rosso, mantenendo il comportamento compatto allo scroll. Il marchio a due righe, di pari larghezza e peso, è trasferito nel footer. Rimossa la dicitura università / SuMoth dalla hero in entrambe le lingue; il componente EditorialHero ora ammette una sopradescrizione facoltativa senza lasciare elementi vuoti.
