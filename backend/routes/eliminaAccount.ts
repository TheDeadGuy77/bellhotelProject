import express from 'express';
import Utente from '../models/Utente';
import Prenotazione from '../models/prenotazione';
import Hotel from  '../models/hotel';
import Stanza from '../models/stanza';
import { Types } from 'mongoose';

const deleteRouter = express.Router();

deleteRouter.delete('/eliminaAccount', async (req,res)=>{

    
    if(!Types.ObjectId.isValid(req.body.IDutente)){
        res.status(400).json({message: "Bad Request"});
        return;
    }
    let user = await Utente.findOne({_id: req.body.IDutente});
    if(!user){
        res.status(404).json({message: 'Not Found'});
        return;
    }
    // Delete user from database -- client scenario
    if(user.tipoAccount == 'cliente'){
        
        let prenotazioni = await Prenotazione.find({IDutente: user._id});
        if(!prenotazioni){
            res.status(404).json({message: 'Not Found'});
            return;
        }
        else{                         
            await Promise.all(prenotazioni.map(async (prenotazione:any)=>{
                    let filter = {_id: prenotazione.IDstanza};
                    let update = {reserved: false};
                    await Stanza.updateOne(filter, {$set: update});
                    await Prenotazione.deleteOne({_id: prenotazione._id});
            }));
        }
        await Utente.deleteOne({_id: user._id});
        res.status(204).json({message: 'No Content'});
        return;
        
    }
    // Delete user from database -- gestore scenario 
    else{
        let hotels = await Hotel.find({IDgestore: user._id});
        if(!hotels){
            res.status(404).json({message: 'Not Found'});
            return;
        }
        else{
            //Delete every room with specific id hotel; then delete the hotel itself
            await Promise.all(hotels.map(async (hotel:any)=>{
                await Stanza.deleteMany({hotelAppartenenza: hotel._id});
                await Hotel.deleteOne({_id: hotel._id});
            }));
            await Utente.deleteOne({_id: user._id});
            res.status(204).json({message: 'No Content'});
            return;
        }
    }
    });
export default deleteRouter;
// controllare per sicurezza ma dovrebbe andare. Unico dettaglio: mandando un 204 con message non arriva nulla su postman