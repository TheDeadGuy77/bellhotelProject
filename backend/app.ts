//Dependencies
import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import deleteRouter from './routes/eliminaAccount';
import authRouter from './routes/autenticazione';
import ricercaRouter from './routes/ricerca';
import prenotazioneRouter from './routes/prenotazione';
import inserisciHS from './routes/inserisciHotelsStanze';
import getIDsrouter from './routes/getIDs';
import inserisciStanza from './routes/inserisciStanza';
import inserisciHotel from './routes/inserisciHotel';
//import swaggerUI from 'swagger-ui-express';
//import swaggerDoc from '../swagger.json';

dotenv.config();
//const port = process.env.PORT || 8080;

//Created app instance and router
const app: Express = express();

//API documentation
/*
swaggerDoc['host'] = `https://bellhotelproject-production.up.railway.app/`;

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(
    swaggerDoc,
    {
        customSiteTitle: 'Documentazione',
        customCss: ''
    }
));
*/


// Middleware to parse form data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRouter);
app.use('/api', deleteRouter);
app.use('/api', ricercaRouter);
app.use('/api', prenotazioneRouter);
app.use('/api',getIDsrouter);
app.use('/api', inserisciHotel);
app.use('/api', inserisciStanza);

export default app;
