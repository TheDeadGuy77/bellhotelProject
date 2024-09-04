import request from 'supertest';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app';
import { deleteHotelTest, deletePrenotazioneTest, deleteStanzaTest, deleteUtenteTest, generaHotelTest, generaPrenotazioneTest, generaStanzaTest, generaUtenteTest } from '../scripts';


dotenv.config();
let connection;
let IDcliente: string;
let IDgestore: string;
let IDhotel: string;
let IDhotelNoStanze: string;
let IDstanza: string;
let IDprenotazione: string;
let dataInizioSoggiorno: Date;
let dataFineSoggiorno: Date;

beforeAll(async () =>{
    mongoose.set('strictQuery',true);
    dataInizioSoggiorno = new Date();
    dataFineSoggiorno = new Date();
    connection = await mongoose.connect(process.env.mongodb_uri || "");
    IDgestore = <string> (<unknown> await generaUtenteTest('emailGestore@gmail.com','Password123!','gestore'));
    IDcliente = <string> (<unknown> await generaUtenteTest('email@gmail.com','Password123!','cliente'));
    IDhotel = <string> (<unknown> await generaHotelTest(IDgestore,'nome','provincia',3));
    IDhotelNoStanze = <string> (<unknown> await generaHotelTest(IDgestore,'nome','provincia',3));
    IDstanza = <string> (<unknown> await generaStanzaTest(IDhotel,3,false));
    IDprenotazione = <string> (<unknown> await generaPrenotazioneTest(IDcliente,3,IDhotel,IDstanza,dataInizioSoggiorno,dataFineSoggiorno));

});
afterAll(async () =>{
    await deleteHotelTest(IDhotel);
    await deleteHotelTest(IDhotelNoStanze);
    await deleteUtenteTest(IDcliente);
    await deleteUtenteTest(IDgestore);
    await deleteStanzaTest(IDstanza);
    await deletePrenotazioneTest(IDprenotazione);
    mongoose.connection.close(true);

});

describe('Testing prenotazione', () =>{
    
    test('ID utente non valido', async () => {
        const response = await request(app)
        .post('/api/prenotazione')
        .set('Accept','application/json')
        .send({
            numeroPersone: 3,
            _id: IDhotel,
            IDstanza: IDstanza,
            inizioSoggiorno: '2024-06-23',
            fineSoggiorno: '2024-06-27',
            IDutente: 'ID non valido',
            part: 'hotel',
            provincia: 'provincia',
            nome: 'nome',
            numeroStelle: 4,
            reserved: false
            
        })
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});
    });

    test('ID utente non esistente', async () => {
        const response = await request(app)
        .post('/api/prenotazione')
        .set('Accept','application/json')
        .send({
            numeroPersone: 3,
            _id: IDhotel,
            IDstanza: IDstanza,
            inizioSoggiorno: dataInizioSoggiorno,
            fineSoggiorno: dataFineSoggiorno,
            IDutente: '000000000000000000000000',
            part: 'hotel',
            provincia: 'provincia',
            nome: 'nome',
            numeroStelle: 4,
            reserved: false
            
        })
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({message: 'Not Found'});
    });

    test('ID utente non cliente', async () => {
        const response = await request(app)
        .post('/api/prenotazione')
        .set('Accept','application/json')
        .send({
            numeroPersone: 3,
            _id: IDhotel,
            IDstanza: IDstanza,
            inizioSoggiorno: dataInizioSoggiorno,
            fineSoggiorno: dataFineSoggiorno,
            IDutente: IDgestore,
            part: 'hotel',
            provincia: 'provincia',
            nome: 'nome',
            numeroStelle: 4,
            reserved: false
            
        })
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});
    });
    
    test('ID hotel non valido', async () => {
        const response = await request(app)
        .post('/api/prenotazione')
        .set('Accept','application/json')
        .send({
            numeroPersone: 3,
            _id: 'Not valid _id',
            IDstanza: IDstanza,
            inizioSoggiorno: dataInizioSoggiorno,
            fineSoggiorno: dataFineSoggiorno,
            IDutente: IDcliente,
            part: 'hotel',
            provincia: 'provincia',
            nome: 'nome',
            numeroStelle: 4,
            reserved: false
            
        })
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});
    });

    test('Numero persone non valido', async () => {
        const response = await request(app)
        .post('/api/prenotazione')
        .set('Accept','application/json')
        .send({
            numeroPersone: 0,
            _id: IDhotel,
            IDstanza: IDstanza,
            inizioSoggiorno: dataInizioSoggiorno,
            fineSoggiorno: dataFineSoggiorno,
            IDutente: IDcliente,
            part: 'hotel',
            provincia: 'provincia',
            nome: 'nome',
            numeroStelle: 4,
            reserved: false
            
        })
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});

    });

    test('Hotel non trovato', async () => {
        const response = await request(app)
        .post('/api/prenotazione')
        .set('Accept','application/json')
        .send({
            numeroPersone: 3,
            _id: '000000000000000000000000',
            IDstanza: IDstanza,
            inizioSoggiorno: dataInizioSoggiorno,
            fineSoggiorno: dataFineSoggiorno,
            IDutente: IDcliente,
            part: 'hotel',
            provincia: 'provincia',
            nome: 'nome',
            numeroStelle: 4,
            reserved: false
            
        })
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});
    });

    test('Stanze non trovate', async () => {
        const response = await request(app)
        .post('/api/prenotazione')
        .set('Accept','application/json')
        .send({
            numeroPersone: 3,
            _id: IDhotelNoStanze,
            IDstanza: IDstanza,
            inizioSoggiorno: dataInizioSoggiorno,
            fineSoggiorno: dataFineSoggiorno,
            IDutente: IDcliente,
            part: 'hotel',
            reserved: false
            
        })
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({message: 'Not Found'});
    });

    test('Stanze trovate', async () => {
        const response = await request(app)
        .post('/api/prenotazione')
        .set('Accept','application/json')
        .send({
            numeroPersone: 3,
            _id: IDhotel,
            IDstanza: IDstanza,
            inizioSoggiorno: dataInizioSoggiorno,
            fineSoggiorno: dataFineSoggiorno,
            IDutente: IDcliente,
            part: 'hotel',
            provincia: 'provincia',
            nome: 'nome',
            numeroStelle: 4,
            reserved: false
            
        })
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'OK',
            stanze: expect.any(Array)
        });
    });

    test('Prenotazione creata', async () => {
        const response = await request(app)
        .post('/api/prenotazione')
        .set('Accept','application/json')
        .send({
            numeroPersone: 3,
            IDhotel: IDhotel,
            IDstanza: IDstanza,
            inizioSoggiorno: dataInizioSoggiorno,
            fineSoggiorno: dataFineSoggiorno,
            IDutente: IDcliente,
            part: 'stanza',
            provincia: 'provincia',
            nome: 'nome',
            numeroStelle: 4,
            reserved: false
            
        })
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            numeroPersone: 3,
            inizioSoggiorno: dataInizioSoggiorno,
            fineSoggiorno: dataFineSoggiorno
        
        });
    });

});

