import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import { pool } from '../../config/db';
interface UserDetails{
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: 'admin' | 'customer'
}
const signup = async ({name, email, password, phone, role = 'customer'}: UserDetails) =>{
    const hashedPass = await bcrypt.hash(password, 10)
    const userRegister = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`, [name, email, hashedPass, phone, role])
    return userRegister
}



export const authService = {
    signup
}