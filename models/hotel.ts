import moongose,  { Schema } from "mongoose"

//Interface for "hotel" object Typescript
export interface hotel{
    _id: Schema.Types.ObjectId,
    provincia: string,
    nome: string,
    numeroStelle: number,
    IDgestore: Schema.Types.ObjectId
}
//MongoDB schema for hotel
const hotelSchema = new Schema<hotel>({
    provincia:{
        type: String,
        required: true
    },
    nome:{
        type: String,
        required: true
    },
    numeroStelle:{
        type: Number,
        required: true
    },
    IDgestore:{
        type: moongose.Schema.Types.ObjectId,
        required:true
    }
},{collection: 'Hotel'})
export default moongose.model<hotel>("Hotel",hotelSchema);