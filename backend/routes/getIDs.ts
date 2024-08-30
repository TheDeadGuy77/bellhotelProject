import express from 'express';
import Hotel from '../models/hotel';
import Prenotazione from '../models/prenotazione'
import Utente from '../models/Utente'
import mongoose from 'mongoose';

const getIDsrouter = express.Router();

getIDsrouter.get('/getIDs/:IDutente', async (req,res)=>{
    
    const IDutente = req.params.IDutente;

    if(!mongoose.isValidObjectId(IDutente)){
        res.status(400).json({message: "Bad Request"});
        return;
    }
    let utente = await Utente.findOne({_id: IDutente});
    if(!utente){
        res.status(404).json({message: 'Not Found'});
    } 
    else{

        if(utente.tipoAccount == 'cliente'){
            //
            let prenotazioniUtente: {_id: any; inizioSoggiorno: any; fineSoggiorno:any}[] = [];
            let prenotazioni = await Prenotazione.find({IDutente: IDutente});
            await Promise.all(prenotazioni.map(async (prenotazione:any)=>{
                    prenotazioniUtente.push({_id: prenotazione._id, inizioSoggiorno: prenotazione.inizioSoggiorno, fineSoggiorno: prenotazione.fineSoggiorno});
            }));
            if(prenotazioniUtente.length > 0){
                res.status(201).json({
                    prenotazioniUtente: prenotazioniUtente
                });
            }
            else{
                res.status(404).json({
                    message: "Not found"
                });
            }
        }
        else if(utente.tipoAccount == 'gestore'){
            //
            let hotelsGestore: {_id: any; nomeHotel: any}[] = [];
            let hotels = await Hotel.find({IDgestore: IDutente}); // controllare nomi
            await Promise.all(hotels.map(async (hotel:any)=>{
                    hotelsGestore.push({_id: hotel._id, nomeHotel: hotel.nome});
            }));
            if(hotelsGestore.length > 0){
                res.status(201).json({
                    hotelsGestore: hotelsGestore
                });
            }
            else{
                res.status(404).json({
                    message: "Not found"
                });
            }
        }
    }
});

export default getIDsrouter;