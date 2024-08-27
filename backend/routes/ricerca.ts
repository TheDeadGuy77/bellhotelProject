import express from 'express';
import Hotel from '../models/hotel';
import Stanza from '../models/stanza';

const ricercaRouter = express.Router();

ricercaRouter.get('/ricerca', async (req,res)=>{
    
    let hotels = await Hotel.find({provincia : req.query.provincia});
    if(!hotels){
        res.status(404).json({message: "Not found"});
        return;
    }
    else{
       const availableHotels: { _id: any; hotel: any; numeroStelle: any; }[] = [];
       await Promise.all(hotels.map(async (hotel:any)=>{ // waiting for operations in map function to complete. map iterates over hotels and for each hotel searches for available rooms
            const stanze = await Stanza.find({hotelAppartenenza: hotel._id, reserved: false, numeroPostiLetto: {$eq: parseInt(req.query.numeroPersone)} });
            if(stanze.length > 0){
                availableHotels.push({_id: hotel._id, hotel: hotel.nome, numeroStelle: hotel.numeroStelle});
            }
       }));

       if(availableHotels.length > 0){
            res.status(200).json({
                message: "OK",
                hotels: availableHotels
            });
       }
       else{
            res.status(404).json({message: "Not found"});
       }
    }
});
export default ricercaRouter;
