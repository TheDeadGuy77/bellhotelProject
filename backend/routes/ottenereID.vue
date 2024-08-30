import express from 'express';
import Utente from '../models/Utente';
import Hotel from '../models/hotel';
import Stanza from '../models/stanza';
import Prenotazione from '../models/prenotazione'
import mongoose from 'mongoose';

const ottieni = express.Router();

ottieni.get('/ottieniID', async(req,res)=>{
  let user = req.body._id;
  let pren = 
  if(!mongoose.isValidObjectId(hotelChoice)){
    res.status(400).json({message: "Bad Request"});
    return;
  }

  if(req.body.tipoAccount != 'gestore' && req.body.tipoAccount != 'cliente'){
    res.status(400).json({message: "Bad Request"})
    return;
  }

  if(req.body.tipoAccount == 'cliente'){
    const prenotazioni: {_id:any; inizioSoggiorno:any; fineSoggiorno:any}[] = [];
    await Prenotazione.findOne({_id:
      if(
  else if(req.body.tipoAccount == 'gestore({
    

