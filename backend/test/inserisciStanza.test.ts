import request from 'supertest';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app';
import { deleteHotelTest, deleteStanzaTest, deleteUtenteTest, generaHotelTest, generaStanzaTest, generaUtenteTest } from '../scripts';

dotenv.config();
let connection;
let IDcliente: string;
let IDgestore: string;
let IDhotel: string;


beforeAll(async () =>{
    mongoose.set('strictQuery',true);
    connection = await mongoose.connect(process.env.mongodb_uri || "");
    IDgestore = <string> (<unknown> await generaUtenteTest('emailGestore@gmail.com','Password123!','gestore'));
    IDcliente = <string> (<unknown> await generaUtenteTest('email@gmail.com','Password123!','cliente'));
    IDhotel =   <string> (<unknown> await generaHotelTest(IDgestore,'nome','provincia',3));
   
});
afterAll(async () =>{
    await deleteHotelTest(IDhotel);
    await deleteUtenteTest(IDcliente);
    await deleteUtenteTest(IDgestore);
    mongoose.connection.close(true);
});

describe('Testing di inserimento stanze',() => {

    test('ID gestore non valido', async () =>{
        const response = await request(app)
        .post('/api/inserisciStanza')
        .set('Accept','application/json')
        .send({
            IDutente: 'Not valid _id',
            IDhotel: IDhotel,
            numeroPostiLetto: 4
        })
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});
    });

    test('ID hotel non valido', async () =>{
        const response = await request(app)
        .post('/api/inserisciStanza')
        .set('Accept','application/json')
        .send({
            IDutente: IDgestore,
            IDhotel: 'Not valid _id',
            numeroPostiLetto: 4
        })
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});
    });

    test('Gestore non trovato', async () =>{
        const response = await request(app)
        .post('/api/inserisciStanza')
        .set('Accept','application/json')
        .send({
            IDutente: '000000000000000000000000',
            Idhotel: IDhotel,
            numeroPostiLetto: 4
        })
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({message: 'Not Found'});
    });

    test('Hotel non trovato', async () =>{
        const response = await request(app)
        .post('/api/inserisciStanza')
        .set('Accept','application/json')
        .send({
            IDutente: IDgestore,
            IDhotel: '000000000000000000000000',
            numeroPostiLetto: 4
        })
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({message: 'Not Found'});
    });

    test('Utente non gestore', async () =>{
        const response = await request(app)
        .post('/api/inserisciStanza')
        .set('Accept','application/json')
        .send({
            IDutente: IDcliente,
            IDhotel: IDhotel,
            numeroPostiLetto: 4
        })
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});
    });

    test('Stanza inserita',async () => {
        const response = await request(app)
        .post('/api/inserisciStanza')
        .set('Accept','application/json')
        .send({
            IDutente: IDgestore,
            IDhotel: IDhotel,
            numeroPostiLetto: 4
        })
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({message: 'Created'});
    });

});