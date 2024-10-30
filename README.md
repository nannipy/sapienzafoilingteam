# Sapienza Sailing Team - Homepage

Questa è la homepage del sito **Sapienza Sailing Team**, sviluppata con **Next.js** e **TypeScript**. La pagina presenta il team, i prossimi eventi, e fornisce un collegamento ai profili social per seguire le attività del team. È inclusa anche una sezione di call to action per incentivare nuovi membri a entrare nel team.

## Funzionalità Principali

- **Sezione Hero**: immagine di sfondo a schermo intero con il nome e il motto del team.
- **Prossimi Eventi**: lista degli eventi in programma, con dettagli come data, luogo e immagine.
- **Sezione Social Media**: collegamenti ai profili social del team.
- **Call to Action**: invito a unirsi al team con collegamento alla pagina dei contatti.

## Struttura del Codice

Il componente `Home` contiene le seguenti sezioni principali:

1. **Head Section**: definisce i metadati per i motori di ricerca e per i social network, ottimizzando la condivisione della pagina.
2. **Sezione Hero**: visualizza il titolo del team e un breve motto, con un'immagine di sfondo a tutto schermo.
3. **Prossimi Eventi**: mostra una lista di eventi in programma, con titolo, data, luogo e immagine. Ogni evento è cliccabile e apre un link in una nuova scheda.
4. **Social Media Section**: icone dei social media con collegamenti ai profili del team.
5. **Call to Action**: invita i visitatori a unirsi al team con un pulsante che reindirizza alla pagina di contatto.

## Installazione

1. **Clona il repository**
   ```bash
   git clone https://github.com/tuo-username/sapienza-sailing-team.git
   cd sapienza-sailing-team

2.	**Installa le dipendenze**
    ```bash
    npm install
    ```
3.	**Avvia il server di sviluppo**
    ```bash
    npm run dev
    ```

4.	**Accedi al sito**
Apri il browser e vai all’indirizzo http://localhost:3000 per visualizzare la homepage.

Dipendenze Principali

	•	Next.js: framework React per lo sviluppo di applicazioni web.
	•	React: libreria JavaScript per la creazione di interfacce utente.
	•	TypeScript: linguaggio che aggiunge tipizzazione statica a JavaScript.
	•	lucide-react: pacchetto di icone React.
	•	next/image: componente di Next.js per l’ottimizzazione delle immagini.

Utilizzo

Modifica degli Eventi

Per aggiornare gli eventi futuri:

	1.	Trova l’array upcomingEvents nel componente Home.
	2.	Aggiungi o modifica gli oggetti evento con le proprietà:
	•	title: nome dell’evento
	•	date: data dell’evento
	•	location: luogo dell’evento
	•	image: percorso dell’immagine
	•	link: URL per ulteriori dettagli sull’evento.

Metadati

La sezione <Head> contiene metadati per ottimizzare il SEO e la condivisione sui social media:

	•	og:title: nome del team.
	•	og:description: descrizione sintetica del team.
	•	og:image: URL di un’immagine rappresentativa.
	•	twitter:card: tipo di anteprima per Twitter.

Navigazione

Il pulsante di call to action reindirizza alla pagina /contact per contattare il team. Assicurati che esista una pagina /contact nell’applicazione per evitare errori.

Contributi

	1.	Fai un fork del repository.
	2.	Crea un nuovo branch per le modifiche.

    ```bash
    git checkout -b nome-branch
    ```

3.	**Effettua le modifiche e fai commit.**
    ```bash
    git commit -m "Descrizione delle modifiche"
    ```

4.	**Manda una pull request per la revisione.**

Licenza

Distribuito con una licenza MIT. Vedi il file LICENSE per maggiori dettagli.

Questo README descrive l'obiettivo, le funzionalità e le modalità di modifica del progetto, inclusa la gestione degli eventi e dei metadati, fornendo una guida chiara per l'installazione e la contribuzione.