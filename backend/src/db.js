import pkg from 'pg';
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg; 

const pool= new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: parseInt(process.env.DB_PORT)// Convert port to number
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Export the query function
export const query = async (text, params) => {
    try {
        return await pool.query(text, params);
    } catch (err) {
        throw new Error(`Database query error: ${err.message}`);
    }
};

// Export pool for direct access if needed
export default pool;

