import { Request, Response } from "express";
import { userService } from "./user.service";


const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users.rows[0]
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
}

export const userController = {
    getAllUsers
}