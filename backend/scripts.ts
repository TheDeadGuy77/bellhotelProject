
import dotenv from 'dotenv';
import Utente, { Utente as UtenteT }  from './models/Utente';
import Prenotazione, { prenotazione as PrenotazioneT }  from './models/prenotazione';
import Hotel, { hotel as HotelT }  from './models/hotel';
import Stanza, { stanza as StanzaT }  from './models/stanza';
import { fail } from 'assert';

dotenv.config();


export async function generaUtenteTest(email: string,password:string,tipoAccount:string,){
    let newUser = new Utente({
        email: email,
        password: password,
        tipoAccount: tipoAccount 
    });
    newUser = await newUser.save();
    return newUser._id;
}

export async function generaHotelTest(IDgestore: string, nome: string, provincia: string, numeroStelle: number){
    let newHotel = new Hotel({
        provincia: provincia,
        nome: nome,
        numeroStelle: numeroStelle,
        IDgestore: IDgestore
    });
    await newHotel.save();
    return newHotel._id;
}

export async function generaStanzaTest(hotelAppartenenza: string, numeroPostiletto: number, reserved: boolean){
    let newStanza = new Stanza({
        hotelAppartenenza: hotelAppartenenza,
        numeroPostiLetto: numeroPostiletto,
        reserved: reserved
    });
    
    await newStanza.save();
    return newStanza._id;
}

export async function generaPrenotazioneTest(IDutente: string,numeroPersone: number, IDhotel: string, IDstanza: string, inizioSoggiorno: Date, fineSoggiorno: Date){
    let newPrenotazione = new Prenotazione({
        numeroPersone: numeroPersone,
        IDhotel: IDhotel,
        IDstanza: IDstanza,
        inizioSoggiorno: inizioSoggiorno,
        fineSoggiorno: fineSoggiorno,
        IDutente: IDutente
    });

    await newPrenotazione.save();
    return newPrenotazione._id;
}

export async function deleteUtenteTest(IDutente: string){
    let utente = Utente.findOne({_id: IDutente});
    if(!utente){
        fail('Impossibile eliminare utente test');
    }
    await Utente.deleteOne({_id: IDutente});
}

export async function deleteHotelTest(IDhotel: string){
    let hotel = Hotel.findOne({_id: IDhotel});
    if(!hotel){
        fail('Impossibile eliminare hotel test');
    }
    await Hotel.deleteOne({_id: IDhotel});
}

export async function deleteStanzaTest(IDstanza: string){
    let stanza = Stanza.findOne({_id: IDstanza});
    if(!stanza){
        fail('Impossibile eliminare stanza test');
    }
    await Stanza.deleteOne({_id: IDstanza});
}

export async function deletePrenotazioneTest(IDprenotazione: string){
    let prenotazione = Prenotazione.findOne({_id: IDprenotazione});
    if(!prenotazione){
        fail('Impossibile eliminare prenotazione test');
    }
    await Prenotazione.deleteOne({_id: IDprenotazione});
}
