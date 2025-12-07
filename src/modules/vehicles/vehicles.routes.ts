import express from 'express';
import { vehicleController } from './vehicles.controller';




const router = express.Router();

router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', vehicleController.updateVehicle);
// router.delete('/:id', vehicleController.deleteVehicle);



export const vehicleRoutes = router;