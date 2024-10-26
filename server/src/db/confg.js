import mongoose from 'mongoose';
import { db_name, db_url } from '../variables.js';

const db = `${db_url}/${db_name}`;

async function db_connect(options ={}){
    try {
        const connectionInstance = await mongoose.connect(db, options);
        console.log('==== DB Connected ====');
        console.log(`DB_HOST: ${connectionInstance.connection.host}`);

        mongoose.connection.on('error', (error)=> {
            console.log('==== DB Connection Lost ====');
        })
    } catch (error) {
        console.log('==== DB Connection Faild ====', error.toString());
    }
};

export default db_connect;