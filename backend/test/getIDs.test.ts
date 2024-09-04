
import request from 'supertest';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app';
import { deleteHotelTest, deletePrenotazioneTest, deleteUtenteTest, generaHotelTest, generaPrenotazioneTest, generaStanzaTest, generaUtenteTest } from '../scripts';



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

describe('Testing get ID hotel per gestore e get ID prenotazioni per cliente', () =>{

    test('ID cliente non valido', async () =>{
        const response = await request(app)
        .get('/api/getIDs/'+ IDcliente)
        .set('Accept','application/json')

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});

    });

    test('ID gestore non valido', async () =>{
        const response = await request(app)
        .get('/api/getIDs/' + IDgestore)
        .set('Accept','application/json')

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});

    });

    test('Cliente non esiste', async () =>{
        const response = await request(app)
        .get('/api/getIDs' + '000000000000000000000000')
        .set('Accept','application/json')

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({message: 'Not Found'});

    });

    test('Gestore non esiste', async () =>{
        const response = await request(app)
        .get('/api/getIDs/'  + '000000000000000000000000')
        .set('Accept','application/json')

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({message: 'Not Found'});

    });

    test('Prenotazioni cliente', async () =>{
        const response = await request(app)
        .get('/api/getIDs/' + IDcliente)
        .set('Accept','application/json')

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({prenotazioniUtente: expect.any(Array)});

    });

    test('Hotel gestore', async () =>{
        const response = await request(app)
        .get('/api/getIDs/' + IDgestore)
        .set('Accept','application/json')

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({hotelsGestore: expect.any(Array)});

    });

    test('Prenotazioni cliente non esistenti', async () =>{
        const response = await request(app)
        .get('/api/getIDs/IDclienteNoPrenotazioni')
        .set('Accept','application/json')

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({message: 'Not Found'});

    });

    test('Hotel gestore non esistenti', async () =>{
        const response = await request(app)
        .get('/api/getIDs/IDGestoreNoHotel')
        .set('Accept','application/json')

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({message: 'Not Found'});

    });
    





});
