
import request from 'supertest';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app';
import {deleteHotelTest, deletePrenotazioneTest, deleteUtenteTest, generaHotelTest, generaPrenotazioneTest, generaStanzaTest, generaUtenteTest} from '../scripts'
import Utente from '../models/Utente';


dotenv.config();
let connection;
let IDgestore: string;
let IDGestoreNoHotel: string;
let IDhotel: string;
let IDstanza:string;
let IDcliente: string;
let IDclienteNoPrenotazioni: string;
let IDprenotazione: string;
let dataInizioSoggiorno: Date;
let dataFineSoggiorno: Date;
   
beforeAll(async () =>{
    mongoose.set('strictQuery',true);
    dataInizioSoggiorno = new Date();
    dataFineSoggiorno = new Date();
    connection = await mongoose.connect(process.env.mongodb_uri || "");
    IDgestore = <string> (<unknown> await generaUtenteTest('emailGestore@gmail.com','Password123!','gestore'));
    IDGestoreNoHotel = <string> (<unknown> await generaUtenteTest('emailGestore2@gmail.com','Password123!','gestore'));
    IDcliente = <string> (<unknown> await generaUtenteTest('email@gmail.com','Password123!','cliente'));
    IDclienteNoPrenotazioni = <string> (<unknown> await generaUtenteTest('email2@gmail.com','Password123!','cliente'));
    IDhotel =  <string> (<unknown> await generaHotelTest(IDgestore,'nome','provincia',3));
    IDstanza = <string> (<unknown> await generaStanzaTest(IDhotel,3,false));
    IDprenotazione = <string> (<unknown> await generaPrenotazioneTest(IDcliente,3,IDhotel,IDstanza,dataInizioSoggiorno,dataFineSoggiorno));
});
afterAll(async () =>{
    await deleteHotelTest(IDhotel);
    await deleteUtenteTest(IDcliente);
    await deleteUtenteTest(IDgestore);
    await deletePrenotazioneTest(IDprenotazione);
    await deleteUtenteTest(IDclienteNoPrenotazioni);
    await deleteUtenteTest(IDGestoreNoHotel);
    await deleteUtenteTest(IDgestore);
    mongoose.connection.close(true);
});

describe('Testing API eliminazione account', () => {


    test('ID non valido', async () => {
        const response = await request(app)
        .delete('/api/eliminaAccount')
        .set('Accept','application/json')
        .send({
            IDutente: 'Not valid _id',
            tipoAccount: 'cliente'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({message: 'Bad Request'})
    });

    test('Utente non trovato', async () => {
        const response = await request(app)
        .delete('/api/eliminaAccount')
        .set('Accept','application/json')
        .send({
            IDutente: '000000000000000000000000',
            tipoAccount: 'cliente'
        })
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({message: 'Not Found'})
    });

    test('Eliminazione cliente con prenotazioni', async () => {
        const response = await request(app)
        .delete('/api/eliminaAccount')
        .set('Accept','application/json')
        .send({
            IDutente: IDcliente,
            tipoAccount: 'cliente'
        })
        expect(response.statusCode).toBe(204)
        expect(response.body).toEqual({message: 'No Content'})
    });

    test('Eliminazione cliente senza prenotazioni', async () => {
        const response = await request(app)
        .delete('/api/eliminaAccount')
        .set('Accept','application/json')
        .send({
            IDutente: IDclienteNoPrenotazioni,
            tipoAccount: 'cliente'
        })
        expect(response.statusCode).toBe(204)
        expect(response.body).toEqual({message: 'No Content'})
    });

    test('Eliminazione gestore con hotel', async () => {
        const response = await request(app)
        .delete('/api/eliminaAccount')
        .set('Accept','application/json')
        .send({
            IDutente: IDgestore,
            tipoAccount: 'gestore'
        })
        expect(response.statusCode).toBe(204)
        expect(response.body).toEqual({message: 'No Content'})
    });

    test('Eliminazione gestore senza hotel', async () => {
        const response = await request(app)
        .delete('/api/eliminaAccount')
        .set('Accept','application/json')
        .send({
            IDutente: IDGestoreNoHotel,
            tipoAccount: 'gestore'
        })
        expect(response.statusCode).toBe(204)
        expect(response.body).toEqual({message: 'No Content'})
    });
});
