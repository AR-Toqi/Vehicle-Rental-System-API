import { Request, Response } from "express"
import { vehicleService } from "./vehicles.service"

const createVehicle = async (req:Request, res: Response)=>{
    try {
        const payload = req.body
        const result = await vehicleService.createVehicle(payload)
        res.status(201).json({
            success: true,
            message: 'Vehicle created successfully',
            data: {
                ...result.rows[0],
                daily_rent_price: Number(result.rows[0].daily_rent_price)
            }
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
        
    }
};

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await vehicleService.getAllVehicles();
        return res.status(200).json({
            success: true,
            message: 'Vehicles retrieved successfully',
            data: vehicles.rows
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
};

const getVehicleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const vehicle = await vehicleService.getVehicleById(id as string);

        if (vehicle.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            })
        } else {
            res.status(200).json({
            success: true,
            message: 'Vehicle retrieved successfully',
            data: vehicle.rows[0]
         }
         )
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
};

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const payload = req.body
        const result = await vehicleService.updateVehicle(id as string, payload);
        res.status(200).json({
            success: true,
            message: 'Vehicle updated successfully',
            data: {
                ...result.rows[0],
                daily_rent_price: Number(result.rows[0].daily_rent_price)
            }
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
};

// const deleteVehicle

export const vehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle
}