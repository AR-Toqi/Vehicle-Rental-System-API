import express from 'express';
import { vehicleController } from './vehicles.controller';
import auth from '../../middleware/authMiddleware';




const router = express.Router();

router.post('/', auth('admin'), vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', auth('admin'), vehicleController.updateVehicle);
router.delete('/:id', auth('admin'), vehicleController.deleteVehicle);



export const vehicleRoutes = router;