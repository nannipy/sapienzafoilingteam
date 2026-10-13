# Pagina Team

Pagina `/team` ridisegnata secondo lo stile adottato nella homepage: Kelson per i titoli, rosso principale, card senza bordo e ombre morbide. Guida generale su fondo chiaro; sette reparti su fondo rosso, ognuno con una breve descrizione del proprio lavoro in italiano e inglese. Link di sezione accessibili con margine di scorrimento per la navbar fissa. Italiano e inglese.

## Persone e fotografie

`app/team/roster.ts` contiene una sola voce per persona, riutilizzata nei diversi ruoli. Gli abbinamenti sono stati confermati dall'utente. Mario e Riccardo restano con il solo nome fornito.

Per aggiungere una foto, salvarla in `public/images/team/` e impostare il campo `photo` della persona con il relativo percorso pubblico (ad esempio `/images/team/stella.jpg`). Il componente `PersonCard` sostituisce automaticamente le iniziali con la foto in tutti i ruoli della stessa persona. I ritratti sono compatti e quadrati, di 112 px su desktop e 80 px su mobile, affiancati al nome. Le iniziali sono decorative e nascoste agli screen reader. Nessuna biografia o corso di studi viene mostrato.

## Verifica

Build di produzione riuscita. 37 test esistenti passati. Verifica nel browser a larghezza desktop e 320 px, in italiano e inglese, senza overflow. Verificato il link diretto a Foil e Social e Comunicazione, con titoli liberi dalla navbar. Anteprima locale, non pubblicata.


## Icone di reparto

Set di sette immagini fornito dall’utente, conservato anche nel design system in `public/brand/departments`. Abbinamenti: attrezzi Cantiere, nodo Management, scafi Scafo, ciclo del materiale Materiali, appendice Foil, circuito Elettronica, fumetto Social e Comunicazione. I JPEG originali sono conservati: contrasto CSS e composizione screen isolano il tratto bianco sul rosso. Icone decorative con testo del reparto adiacente.
