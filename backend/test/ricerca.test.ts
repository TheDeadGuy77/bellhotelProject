import request from 'supertest';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app';
import { deleteHotelTest, deleteStanzaTest, deleteUtenteTest, generaHotelTest, generaStanzaTest, generaUtenteTest } from '../scripts';


dotenv.config();
let connection;
let IDgestore: string;
let IDhotel: string;
let IDstanza: string;
let provinciaEsistente: string;
let provinciaNonEsistente: string;
let numeroPersone: number;
let numeroPersoneNonCorrispondente: number;

beforeAll(async () =>{
    mongoose.set('strictQuery',true);
    connection = await mongoose.connect(process.env.mongodb_uri || "");
    IDgestore = <string> (<unknown> await generaUtenteTest('emailGestore@gmail.com','Password123!','gestore'));
    provinciaEsistente = 'ProvinciaTest';
    provinciaNonEsistente = 'ProvinciaNonEsistenteTest';
    numeroPersone = 4;
    numeroPersoneNonCorrispondente = 99999999;
    IDhotel = <string> (<unknown> await generaHotelTest(IDgestore,'nome',provinciaEsistente,3));
    IDstanza = <string> (<unknown> await generaStanzaTest(IDhotel,numeroPersone,false));
});
afterAll(async () =>{
    await deleteHotelTest(IDhotel);
    await deleteUtenteTest(IDgestore);
    await deleteStanzaTest(IDstanza);
    mongoose.connection.close(true);
});

describe('Testing ricerca', () => {
    
    test('Hotel non trovati, provincia non esistente ', async () =>{
        const response = await request(app)
        .get('/api/ricerca?provincia='+ provinciaNonEsistente + '&numeroPersone='+ numeroPersone.toString())
        .set('Accept','application/json')

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({message: 'Not Found'});
    });

    test('Hotel non trovati, numero di persone non corrisponde a nessuna capienza delle stanze ', async () =>{
        const response = await request(app)
        .get('/api/ricerca?provincia='+ provinciaEsistente + '&numeroPersone='+ numeroPersoneNonCorrispondente.toString())
        .set('Accept','application/json')

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({message: 'Not Found'});
    });

    test('Ricerca ha prodotto risultati', async () =>{
        const response = await request(app)
        .get('/api/ricerca?provincia='+ provinciaEsistente + '&numeroPersone='+ numeroPersone.toString())
        .set('Accept','application/json')

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            message: 'OK',
            hotels: expect.any([])
        }));
    });
});