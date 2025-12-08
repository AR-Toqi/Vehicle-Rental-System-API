import { pool } from "../../config/db";


interface VehicleDetails{
    vehicle_name: string;
    type: 'car' | 'bike' | 'van' | 'SUV';
    registration_number: string;
    daily_rent_price: number;
    availability_status: boolean;
}
const createVehicle = async (payload: VehicleDetails) => {
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload
    const result = await pool.query(`INSERT INTO vehicles 
        (vehicle_name,type, registration_number, daily_rent_price, availability_status)
        VALUES ($1,$2,$3,$4,$5) RETURNING *`, 
        [vehicle_name, type, registration_number, daily_rent_price, availability_status])
    
    return {
        ...result,
        daily_rent_price: Number(result.rows[0].daily_rent_price)
    }
};

const getAllVehicles = async () => {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY id DESC');
    return result;
};

const getVehicleById = async (id: string) => {
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result;
};

const updateVehicle = async (id: string, payload: VehicleDetails) => {
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload
    const result = await pool.query(`UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`, 
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, id])
    
    return {
        ...result,
        daily_rent_price: Number(result.rows[0].daily_rent_price)
    }
};

const deleteVehicle = async (id: string) => {
    const result = await pool.query('SELECT id FROM bookings WHERE customer_id = $1 AND status = $2',
      [id, 'active']);

      if (result.rows.length > 0) {
         throw { status: 400, message: 'Cannot delete vehicle with active bookings' };
      }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);
   return true;
}
    


export const vehicleService = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
}