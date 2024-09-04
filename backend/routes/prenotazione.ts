import express from 'express';
import Hotel from '../models/hotel';
import Stanza from '../models/stanza';
import Prenotazione from '../models/prenotazione'
import mongoose from 'mongoose';
import Utente from '../models/Utente';


const prenotazioneRouter = express.Router();
//nel body arriva scelta dell'hotel. Dentro vi è _id hotel e campo part per identificare caso di scelta hotel o scelta stanza

prenotazioneRouter.post('/prenotazione', async (req,res)=>{
    if(req.body.part == 'hotel'){
        
        if(!mongoose.isValidObjectId(req.body.IDutente)){
            res.status(400).json({message: "Bad Request"});
            return;
        }
        let user = await Utente.findOne({_id: req.body.IDutente});
        if(!user){
            res.status(404).json({message: "Not Found"});
            return;
        }
        let hotelChoice = req.body._id;
        if(!mongoose.isValidObjectId(hotelChoice) || req.body.numeroPersone < 1 || user.tipoAccount != "cliente"){
            res.status(400).json({message: "Bad Request"});
            return;
        }      
        let hotels = await Hotel.findOne({_id: hotelChoice}); 
        if(!hotels){
            res.status(404).json({message: `Not Found`});
            return;
        }
        else{
            let stanze = await Stanza.find({hotelAppartenenza: hotelChoice, reserved: false});
            console.log(stanze);
            let availableStanze: {_id: any; numeroPostiLetto: any;}[] = [];
            await Promise.all(stanze.map(async (stanza:any)=>{
                if(stanza.reserved == false){
                    availableStanze.push({_id: stanza._id, numeroPostiLetto: stanza.numeroPostiLetto});
                }
            }));
            if(availableStanze.length > 0){
                res.status(200).json({
                    message: "OK",
                    stanze: availableStanze
                });
            }
            else{
                res.status(404).json({
                    message: "Not Found"
                });
                return;
            }
        }
    }
    else if(req.body.part == 'stanza'){
        let newPrenotazione = new Prenotazione({
            numeroPersone: req.body.numeroPersone,
            IDhotel: req.body.IDhotel,
            IDstanza : req.body.IDstanza,
            inizioSoggiorno: req.body.inizioSoggiorno,
            fineSoggiorno: req.body.fineSoggiorno,
            IDutente: req.body.IDutente
        });
        newPrenotazione = await newPrenotazione.save();
        
        let filter = {_id: req.body.IDstanza};
        let update = {reserved: true};
        await Stanza.updateOne(filter, {$set: update});
        
        res.status(201).json({
            numeroPersone: newPrenotazione.numeroPersone,
            inizioSoggiorno: newPrenotazione.inizioSoggiorno,
            fineSoggiorno: newPrenotazione.fineSoggiorno
        });
        
    }
});

export default prenotazioneRouter;