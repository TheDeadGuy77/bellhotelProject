import express from 'express';
import Utente from '../models/Utente';
import Prenotazione from '../models/prenotazione';
import Hotel from  '../models/hotel';
import Stanza from '../models/stanza';

const deleteRouter = express.Router();

deleteRouter.delete('/eliminaAccount', async (req,res)=>{

    // Check user existence
    let user = await Utente.findOne({email: req.body.email});
    if(!user){
        res.status(404).json({message: "Utente non trovato nel database"});
        return;
    }
    else{
        if(req.body.password != user.password){
            res.status(400).json({message: "Bad Request"});
            return;
        }
    }
    // Delete user from database -- client scenario
    if(user.tipoAccount == 'cliente'){
        
        Prenotazione.deleteMany({IDutente: user._id});
        await Utente.deleteOne({_id: user._id});
        res.status(204).json({message: "No Content"});
        
    }
    // Delete user from database -- gestore scenario 
    else{
        let hotels = await Hotel.find({IDgestore: user._id});
        if(!hotels){
            res.status(404).json({message: `Non sono presenti hotel di ${user.email} nel database.`});
        }
        else{
            //Delete every room with specific id hotel; then delete the hotel itself
            await Promise.all(hotels.map(async (hotel:any)=>{
                await Stanza.deleteMany({hotelAppartenenza: hotel._id});
                await Hotel.deleteOne({_id: hotel._id});
            }));
            await Utente.deleteOne({_id: user._id});
            res.status(204).json({message: "No Content"});
        }
    }
    });
export default deleteRouter;
// controllare per sicurezza ma dovrebbe andare. Unico dettaglio: mandando un 204 con message non arriva nulla su postman
