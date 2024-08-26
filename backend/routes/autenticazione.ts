import express from 'express';
//import {Types} from 'mongoose';
import Utente from '../models/Utente';
import mongoose from 'mongoose';

const authRouter = express.Router();

//add new user
authRouter.post('/signUp',async (req,res)=>{
     //request validation
     if(!(validateEmail(req.body.email) && validatePsw(req.body.password))){
         res.status(400).json({message: "Bad Request"});
         return;
     }
    //account type validation
     if(req.body.tipoAccount != 'gestore' && req.body.tipoAccount != 'cliente'){
         res.status(400).json({message: "Bad Request"})
     }
    //check for email address in database(maybe the email is already present)
    let utente = await Utente.findOne({email: req.body.email});
    if(utente){
        res.status(409).json({message: "Conflict"});
        return;
    }
    //create a new user
    let newUtente = new Utente({
        email: req.body.email,
        password: req.body.password,
        tipoAccount: req.body.tipoAccount

    });
    newUtente = await newUtente.save();
    res.status(201).json({
        message: "Created",
        _id : newUtente._id,
        email: newUtente.email,
        tipoAccount: newUtente.tipoAccount
    });

});
//login
authRouter.post('/login', async (req,res)=>{
    let utente = await Utente.findOne({email: req.body.email, password: req.body.password, tipoAccount: req.body.tipoAccount});
    if(!utente){
        res.status(404).json({message: "Not Found"});
        return;
    }
    if(utente.password != req.body.password){
        res.status(403).json({message: "Forbidden"}); 
        return;
    }
    // return user
    res.status(200).json({
        message: "OK",
        _id : utente._id,
        email: utente.email,
        tipoAccount: utente.tipoAccount
    });
});
authRouter.get('/getAll', async (req,res)=>{ // solo per testing. DA ELIMINARE
    let utente = await Utente.find();
    res.status(200).json({
        message: utente
    })
})

//functions to check valid email/password

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(text:string){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}
//password valid when its length >=8 and it has at least 1 upper-case letter, one lower-case letter and one special char (*%&$@#!?^)
// https://stackoverflow.com/a/59116316
function validatePsw(text:string){
    var re = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[%&#!@\*\^]).{8,})$/;
    return re.test(text);
}
// TODO: provare a mettere una GetAll per stampare tutti gli utenti
export default authRouter;
