import { Request, Response } from "express";
import { userService } from "./user.service";
import { parse } from "dotenv";


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
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const user = await userService.getUserById(id as string);
        return res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user.rows[0]
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
};


const updateUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const payload = req.body
        const user = await userService.updateUserById(id as string, payload);
        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user.rows[0]
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
};


const deleteUserById = async (req: Request, res: Response) => {
    try {
        const id = (req.params.id);
        await userService.deleteUserById(id as string);
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
};

export const userController = {
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}