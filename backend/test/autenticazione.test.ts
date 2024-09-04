import request from 'supertest';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app';
import {deleteUtenteTest} from '../scripts'

dotenv.config();
let connection;

beforeAll(async () =>{
    mongoose.set('strictQuery',true);
    connection = await mongoose.connect(process.env.mongodb_uri || "");
});
afterAll(async () =>{
    mongoose.connection.close(true);
});

describe('Testing delle APi di autenticazione',()=>{

    test('Email non valida', async() => {
        const response = await request(app)
        .post('/api/signUp')
        .set('Accept','application/json')
        .send({
            email: 'email not valid',
            password: 'PasswordValida1!',
            tipoAccount: 'cliente'
        })

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({message: 'Bad Request'});

    });
    
    test('Password non valida', async() => {
        const response = await request(app)
        .post('/api/signUp')
        .set('Accept','application/json')
        .send({
            email: 'test@gmail.com',
            password: 'psw not valid',
            tipoAccount: 'cliente'
        })

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({message: 'Bad Request'});

    });

    test('Tipo account non valido', async() => {
        const response = await request(app)
        .post('/api/signUp')
        .set('Accept','application/json')
        .send({
            email: 'test@gmail.com',
            password: 'PasswordValida1!',
            tipoAccount: 'tipo non valido'
        })

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({message: 'Bad Request'});
        
    });

    test('signUp', async() => {
        const response = await request(app)
        .post('/api/signUp')
        .set('Accept','application/json')
        .send({
            email: 'test@gmail.com',
            password: 'PasswordValida1!',
            tipoAccount: 'cliente'
        })
        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual(expect.objectContaining({

            message: 'Created',
            _id: expect.any(String),
            email: expect.any(String),
            tipoAccount: 'cliente'
        }));
    });

    test('Utente già registrato', async() => {
        const response = await request(app)
        .post('/api/signUp')
        .set('Accept','application/json')
        .send({
            email: 'test@gmail.com',
            password: 'PasswordValida1!',
            tipoAccount: 'cliente'
        })
        expect(response.statusCode).toBe(409)
        expect(response.body).toEqual({message: 'Conflict'});

    });
    
    test('Utente non registrato', async() => {
        const response = await request(app)
        .post('/api/login')
        .set('Accept','application/json')
        .send({
            email: 'test2@gmail.com',
            password: 'PasswordValida1!'
        })
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({message: 'Not Found'});

    });
    
    test('Password errata', async() => {
        const response = await request(app)
        .post('/api/login')
        .set('Accept','application/json')
        .send({
            email: 'test@gmail.com',
            password: 'PswNotCorrect1?'
        })
        expect(response.statusCode).toBe(403)
        expect(response.body).toEqual({message: 'Forbidden'});

    });

    test('Login', async() => {
        const response = await request(app)
        .post('/api/login')
        .set('Accept','application/json')
        .send({
            email: 'test@gmail.com',
            password: 'PasswordValida1!'
        })

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(expect.objectContaining({
            
            message: 'OK',
            _id: expect.any(String),
            email: expect.any(String),
            tipoAccount: expect.any(String)
        }));
        await deleteUtenteTest(response.body._id);

    });
});