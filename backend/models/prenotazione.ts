import mongoose,  { Schema } from "mongoose"


//Interface for "prenotazione" object Typescript
export interface prenotazione{
    _id: Schema.Types.ObjectId,
    numeroPersone: number,
    IDhotel: Schema.Types.ObjectId,
    IDstanza: Schema.Types.ObjectId,
    inizioSoggiorno: Date,
    fineSoggiorno: Date,
    IDutente: Schema.Types.ObjectId
}
//MongoDB schema for utente
const prenotazioneSchema = new Schema<prenotazione>({
    numeroPersone:{
        type: Number,
        required: true
    },
    IDhotel:{
        type: moongose.Schema.Types.ObjectId,
        required: true
    },
    IDstanza:{
        type: moongose.Schema.Types.ObjectId,
        required: true
    },
    inizioSoggiorno:{
        type: Date,
        required: true
    },
    fineSoggiorno:{
        type: Date,
        required: true
    },
    IDutente:{
        type: moongose.Schema.Types.ObjectId,
        required: true,
        ref: 'Utente'
    }
},{collection: 'Prenotazione'})
export default moongose.model<prenotazione>('Prenotazione',prenotazioneSchema);
