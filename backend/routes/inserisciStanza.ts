import express from 'express';
import Utente from '../models/Utente';
import Hotel from '../models/hotel';
import Stanza from '../models/stanza';
import mongoose from 'mongoose';

const inserisciStanza = express.Router();

inserisciStanza.post('/inserisciStanza',async (req,res)=>{
    let id_utente = req.body.IDutente;
    let id_hotel = req.body.IDhotel;
    if(!mongoose.isValidObjectId(id_utente) || !mongoose.isValidObjectId(id_hotel)){
        res.status(400).json({message: 'Bad Request'});
        return;
    }
    
    let utente = await Utente.findOne({_id: id_utente});
    let hotel = await Hotel.findOne({_id: id_hotel});
    
    if(!utente || !hotel){
        res.status(404).json({message: 'Not Found'});
        return;
    }
    if(utente.tipoAccount != 'gestore'){
        res.status(400).json({message: 'Bad Request'});
        return;
    }
    let newStanza = new Stanza({
        reserved: false,
        numeroPostiLetto: req.body.numeroPostiLetto,
        hotelAppartenenza: hotel._id
    });
    await newStanza.save();
    res.status(201).json({message: 'Created'});
    return;
});
export default inserisciStanza;