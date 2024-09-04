
import express from 'express';
import Utente from '../models/Utente';
import Hotel from '../models/hotel';
import Stanza from '../models/stanza';
import mongoose from 'mongoose';

const inserisciHotel = express.Router();

inserisciHotel.post('/inserisciHotel', async (req,res)=>{
    let id_utente = req.body.IDgestore;
    if(!mongoose.isValidObjectId(id_utente)){
        res.status(400).json({message: "Bad Request"});
        return;
    }
    let utente = await Utente.findOne({_id: id_utente});
    if(!utente){
        res.status(404).json({message: "Not Found"});
        return;
    }
    else{
        if(utente.tipoAccount != "gestore" || (req.body.numeroStelle <1 ||  req.body.numeroStelle>5)){
            res.status(400).json({message: "Bad Request"});
            return;
        }
        let hotel = await Hotel.findOne({nome: req.body.nome});
        if(!hotel){
            let newHotel = new Hotel({
                IDgestore: id_utente,
                nome: req.body.nome,
                numeroStelle: req.body.numeroStelle,
                provincia: req.body.provincia
            });
            await newHotel.save();
            res.status(201).json({message: "Created"});
        }
        else{
            res.status(409).json({message: "Conflict"});
            return;
        }
    }


});

export default inserisciHotel;
