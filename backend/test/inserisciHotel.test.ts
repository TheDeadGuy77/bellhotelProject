import request from 'supertest';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app';
import { deleteHotelTest, deleteUtenteTest, generaHotelTest, generaStanzaTest, generaUtenteTest } from '../scripts';
import { response } from 'express';

dotenv.config();

let connection;
let IDutente: string;
let IDgestore: string;
let IDhotel: string;
let idHotelDaEliminare:string;


beforeAll(async () =>{
    mongoose.set('strictQuery',true);
    connection = await mongoose.connect(process.env.mongodb_uri || "");
    IDgestore = <string> (<unknown> await generaUtenteTest('emailGestore@gmail.com','Password123!','gestore'));
    IDutente = <string> (<unknown> await generaUtenteTest('email@gmail.com','Password123!','cliente'));
    IDhotel =   <string> (<unknown> await generaHotelTest(IDgestore,'nome','provincia',3));
});
afterAll(async () =>{
    await deleteHotelTest(IDhotel);
    await deleteUtenteTest(IDutente);
    await deleteUtenteTest(IDgestore);
    mongoose.connection.close(true);
});

describe('Testing di inserimento hotel',() =>{

    test('ID gestore non valido', async () =>{
        const response = await request(app)
        .post('/api/inserisciHotel')
        .set('Accept','application/json')
        .send({
            IDgestore: 'Not valid _id',
            nome: 'TestHotel',
            numeroStelle: 4,
            provincia: 'provincia'
        })
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});
    });

    test('Utente non trovato', async () =>{
        const response = await request(app)
        .post('/api/inserisciHotel')
        .set('Accept','application/json')
        .send({
            IDgestore: '000000000000000000000000',
            nome: 'TestHotel',
            numeroStelle: 4,
            provincia: 'provincia'
        })
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({message: 'Not Found'});

    });

    test('ID non gestore', async () =>{
        const response = await request(app)
        .post('/api/inserisciHotel')
        .set('Accept','application/json')
        .send({
            IDgestore: IDutente,
            nome: 'TestHotel',
            numeroStelle: 4,
            provincia: 'provincia'
        })
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});
    });
    
    test('Numero stelle non valido', async () => {
        const response = await request(app)
        .post('/api/inserisciHotel')
        .set('Accept','application/json')
        .send({
            IDgestore: IDgestore,
            nome: 'TestHotel',
            numeroStelle: 6,
            provincia: 'provincia'
        })
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Bad Request'});
    });

    test('Hotel inserito', async () => {
        const response = await request(app)
        .post('/api/inserisciHotel')
        .set('Accept','application/json')
        .send({
            IDgestore: IDgestore,
            nome: 'TestHotel',
            numeroStelle: 4,
            provincia: 'provincia'
        })
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({message: 'Created'});
        await deleteHotelTest(response.body._id);

        const response2 = await request(app)
        .post('/api/inserisciHotel')
        .set('Accept','application/json')
        .send({
            IDgestore: IDgestore,
            nome: 'TestHotelGiàPresente',
            numeroStelle: 4,
            provincia: 'provincia'
        })
        expect(response2.statusCode).toBe(201);
        expect(response2.body).toEqual({message: 'Created'});
        idHotelDaEliminare = response2.body._id;
    });

    test('Hotel con stesso nome già presente', async () =>{
        const response = await request(app)
        .post('/api/inserisciHotel')
        .set('Accept','application/json')
        .send({
            IDgestore: IDgestore,
            nome: 'TestHotelGiàPresente',
            numeroStelle: 4,
            provincia: 'provincia'
        })
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({message: 'Conflict'});
        await deleteHotelTest(idHotelDaEliminare);

    });
});
