import moongose,  { Schema } from "mongoose"

//Interface for "stanza" object Typescript
export interface stanza{
    _id: Schema.Types.ObjectId,
    reserved: boolean,
    numPostiLetto: Number,
    hotelAppartenenza: Schema.Types.ObjectId
}
//MongoDB schema for stanza
const stanzaSchema = new Schema<stanza>({
    reserved:{
        type: Boolean,
        required: true
    },
    numPostiLetto:{
        type: Number,
        required: true
    },
    hotelAppartenenza:{
        type: moongose.Schema.Types.ObjectId,
        required: true,
        ref: 'Hotel'
    }
},{collection: 'Stanza'})
export default moongose.model<stanza>('Stanza',stanzaSchema);