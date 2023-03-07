import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const PG_URI = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: PG_URI,
});


export const query = (text, params?, callback?) => {
    console.log('Executed query: ', text);
    return pool.query(text, params, callback);
};