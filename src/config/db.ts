import { Pool } from 'pg';
import config from './index';


// DB
export const pool = new Pool({
    connectionString: config.connectionString
});

const initDB = async () => {
    await pool.query(
        `
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL CHECK (char_length(password) >= 6),
            phone VARCHAR(255) NOT NULL,
            role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )`
    );

    console.log('Database connected');

}

export default initDB