import { Pool } from 'pg';
import config from './index';


// DB
export const pool = new Pool({
    connectionString: config.connectionString
});

const initDB = async () => {

    //* user table
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

    //* vehicles table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(255) NOT NULL,
            type Text NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
            registration_number VARCHAR(100) NOT NULL UNIQUE,
            daily_rent_price INTEGER NOT NULL CHECK (daily_rent_price > 0),
            availability_status TEXt NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'booked')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    
    );

    console.log('Database connected');

}

export default initDB