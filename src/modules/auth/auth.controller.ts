import { Request, Response } from "express";
import { authService } from "./auth.service";


const signup = async(req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        if (password.length < 6){
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            })
        }

        const result = await authService.signup({ name, email, password, phone })
        res.status(200).json({
            success: true,
            message: 'User registered successfully',
            data: result.rows[0]
        })
       
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
};


export const authController = {
    signup
}