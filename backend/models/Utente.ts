import moongose,  { Schema } from "mongoose"

 // enum for the two account types
enum tipologiaAccountEnum{
    cliente = 'cliente',
    gestore = 'gestore'
};
//Interface for "utente" object Typescript
export interface Utente{
    _id: Schema.Types.ObjectId,
    email: string,
    password: string,
    tipoAccount : tipologiaAccountEnum
}
//MongoDB schema for utente
const utente = new Schema<Utente>({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    tipoAccount:{
        type: String,
        required: true,
        enum: ['cliente','gestore']
    }
},
{collection: 'Utente'})
export default moongose.model<Utente>('Utente',utente);