//Dependencies
import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import deleteRouter from './routes/eliminaAccount';
import authRouter from './routes/autenticazione';
import ricercaRouter from './routes/ricerca';
import prenotazioneRouter from './routes/prenotazione';
import inserisciHS from './routes/inserisciHotelsStanze';

dotenv.config();
//const port = process.env.PORT || 8080;

//Created app instance and router
const app: Express = express();


// Middleware to parse form data
app.use(cors({origin: 'https://provasite.netlify.app'}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRouter);
app.use('/api', deleteRouter);
app.use('/api', ricercaRouter);
app.use('/api', prenotazioneRouter);
app.use('/api', inserisciHS);

export default app;
