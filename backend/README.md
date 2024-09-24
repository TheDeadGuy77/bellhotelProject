<h1>BellHotel</h1>
Questa repository contiene il codice del backend del progetto BellHotel. 
Dentro la cartella vi è la parte di lavoro incentrata sulle API, ossia:
</br></br>
<ul>
<li>Sviluppo</li>
<li>Testing (con cartella coverage)</li>
<li>Documentazione</li>
</ul>

<h1>Come avviare il progetto</h1>

Il backend è live all'indirizzo: https://backend-production-08dc.up.railway.app . Qui è possibile solo eseguire le richieste agli API endpoint e visualizzare la documentazione.

Se il backend dovesse essere offline, è possibile eseguire il progetto in locale seguendo questi passi:

1) Clonare il progetto
2) Eseguire ```cd backend``` per entrare nella cartella di backend
3) Definire un file ```.env``` nel quale definire le seguenti variabili d'ambiente:
   </br></br>
   ```
   mongodb_uri=""
   PORT=""
   ```
5) Eseguire ```npm install``` per installare le librerie del progetto
6) Eseguire ```npm start``` per avviare il programma localmente

Per visualizzare la documentazione in locale è necessario sostituire al nome dell'host ```localhost:${port}``` nel file ```./app.ts```. Sarà poi possibile eseguire i test delle API mediante software come Postman. 
