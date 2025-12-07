import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import { pool } from '../../config/db';
import config from '../../config/index'

interface UserDetails{
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: 'admin' | 'customer'
}

interface SigninCredentials{
    email: string;
    password: string;
}

const signup = async ({name, email, password, phone, role = 'customer'}: UserDetails) =>{
    const hashedPass = await bcrypt.hash(password, 10)
    const userRegister = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`, [name, email, hashedPass, phone, role])
    return userRegister
}

const signin = async ({email, password}: SigninCredentials) =>{
    const userLogin = await pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLocaleLowerCase()]);

    if (userLogin.rows.length === 0){
        throw { 
            status: 401, 
            message: 'User not found!' 
        }
    }

    const matchPass = await bcrypt.compare(password, userLogin.rows[0].password);

    if (!matchPass){
        throw { 
            status: 401, 
            message: 'Invalid Credentials!' 
        }
    }

    const jwtPayload = {
        id: userLogin.rows[0].id,
        name: userLogin.rows[0].name,
        email: userLogin.rows[0].email,
        role: userLogin.rows[0].role
    }

   const jwtSecrete = config.jwtSecrete

    const token = jwt.sign(jwtPayload, jwtSecrete as string, {expiresIn: '7d'})

    return {token, userLogin:{
        id: userLogin.rows[0].id,
        name: userLogin.rows[0].name,
        email: userLogin.rows[0].email,
        role: userLogin.rows[0].role,
        phone: userLogin.rows[0].phone
    }};
}

export const authService = {
    signup,
    signin
}