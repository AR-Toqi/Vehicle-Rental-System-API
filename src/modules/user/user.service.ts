import { pool } from "../../config/db"


interface UserDetails {
   name: string;
   email: string;
   phone: string;
}
const getAllUsers = async () => {
   const result = await pool.query('SELECT id, name, email, phone, role, created_at FROM users')
   return result;
};

const getUserById = async (id: string) => {
   const result = await pool.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1', [id])
   return result;
};

const updateUserById = async (id: string, payload: UserDetails) => {
   const {name, email, phone} = payload
   const result = await pool.query('UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *', [name, email, phone, id])
   return result;
};

const deleteUserById = async (id: string) => {
   const result = await pool.query('SELECT id FROM bookings WHERE customer_id = $1 AND status = $2',
      [id, 'active']);

      if (result.rows.length > 0) {
         throw { status: 400, message: 'Cannot delete user with active bookings' };
      }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);
   return true;
};

export const userService = {
   getAllUsers,
   getUserById,
   updateUserById,
   deleteUserById
}