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

    //* booking table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
            user_id INTEGER NOT NULL REFERENCES users(id),
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
            status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT check_dates CHECK (rent_end_date > rent_start_date)
        )`
    
    );

    console.log('Database connected');

}

export default initDB