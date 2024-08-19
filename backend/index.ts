import app from './app';
import mongoose from 'mongoose';


//import dotenv from 'dotenv';

const port = process.env.PORT || 8080;
const mongodb_uri = process.env.mongodb_uri || "";
console.log(mongodb_uri)

mongoose.set('strictQuery', true);
mongoose.connect(mongodb_uri).then(() => {
        app.listen(port, () => {
                console.log(`Server listening on port ${port}`);
        });
        console.log("Successfuly connected to database");
}).catch((error) => console.error(error));
