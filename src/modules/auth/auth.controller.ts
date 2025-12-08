import { Request, Response } from "express";
import { authService } from "./auth.service";


const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await authService.signup({
      name,
      email,
      password,
      phone,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const signin = async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        
        const result = await authService.signin({ email, password })
        res.status(200).json({
            success: true,
            message: 'User loggedin successfully',
            data: result
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
    signup,
    signin
}