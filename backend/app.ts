//Dependencies
import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import deleteRouter from './routes/eliminaAccount';
import authRouter from './routes/autenticazione';
import ricercaRouter from './routes/ricerca';
import prenotazioneRouter from './routes/prenotazione';
import inserisciStanza from './routes/inserisciStanza';
import inserisciHotel from './routes/inserisciHotel';
import getIDsrouter from './routes/getIDs';

dotenv.config();
//const port = process.env.PORT || 8080;

//Created app instance and router
const app: Express = express();


// Middleware to parse form data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRouter);
app.use('/api', deleteRouter);
app.use('/api', ricercaRouter);
app.use('/api', prenotazioneRouter);
app.use('/api', inserisciHotel);
app.use('/api', inserisciStanza);
app.use('/api', getIDsrouter);

export default app;