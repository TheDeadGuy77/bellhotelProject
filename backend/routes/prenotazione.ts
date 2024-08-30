import express from 'express';
import Hotel from '../models/hotel';
import Stanza from '../models/stanza';
import Prenotazione from '../models/prenotazione'
import mongoose from 'mongoose';


const prenotazioneRouter = express.Router();
//nel body arriva scelta dell'hotel. Dentro vi è _id hotel e campo part per identificare caso di scelta hotel o scelta stanza

prenotazioneRouter.post('/prenotazione', async (req,res)=>{
    if(req.body.part == 'hotel'){
        let hotelChoice = req.body._id;
        if(!mongoose.isValidObjectId(hotelChoice)){
            res.status(400).json({message: "Bad Request"});
            return;
        }      
        let hotels = await Hotel.findOne({_id: hotelChoice}); 
        if(!hotels){
            res.status(404).json({message: `Not Found`});
            return;
        }
        else{
            let stanze = await Stanza.find({hotelAppartenenza: hotelChoice});
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
                    message: "Not found"
                });
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
prenotazioneRouter.delete('/eliminaPrenotazione',async(req,res)=>{
    let prenotazioneChoice = req.body._id;

    if(!mongoose.isValidObjectId(prenotazioneChoice)){
        res.status(400).json({message: "Bad Request"});
        return;
    }
    let prenotazione = await Prenotazione.findOne({_id: prenotazioneChoice});
    if(!prenotazione){
        res.status(404).json({message: "Not Found"});
        return;
    }
    else{
        await Prenotazione.deleteOne({_id: prenotazioneChoice}); 
        res.status(200).json({message: "OK"});
        let filter = {_id: prenotazione.IDstanza};
        let update = {reserved: false};
        await Stanza.updateOne(filter, {$set: update});
    }
});
prenotazioneRouter.patch('/modificaPrenotazione',async(req,res)=>{
    let id_prenotazione = req.body._id;
    if(!mongoose.isValidObjectId(id_prenotazione)){
        res.status(400).json({message: "Bad Request"});
        return;
    }
    else{
        let prenotaz = await Prenotazione.findOne({_id: id_prenotazione});
        if(!prenotaz){
            res.status(404).json({message: "Not Found"});
            return;
        }
        else{
            if(prenotaz.inizioSoggiorno == req.body.inizioSoggiorno  || prenotaz.fineSoggiorno == req.body.fineSoggiorno){
                res.status(409).json({message: "Conflict"});
                return;
            }
            let filter = {_id: id_prenotazione};
            let update = {inizioSoggiorno : req.body.inizioSoggiorno, fineSoggiorno: req.body.fineSoggiorno};
            await Prenotazione.updateOne(filter, {$set: update});
            let p = await Prenotazione.findOne({_id: id_prenotazione});
            if(p){
                res.status(200).json({
                    message: "OK",
                    numeroPersone: p.numeroPersone,
                    inizioSoggiorno: p.inizioSoggiorno,
                    fineSoggiorno: p.fineSoggiorno
                });
            }
            else{
                res.status(404).json({message: "Not Found"});
                return;
            }
        }
    }
});
export default prenotazioneRouter;
