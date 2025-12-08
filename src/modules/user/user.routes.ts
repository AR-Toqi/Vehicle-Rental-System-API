import express from 'express';
import { userController } from './user.controller';
import auth from '../../middleware/authMiddleware';


const router = express.Router();

router.get('/', auth('admin'), userController.getAllUsers);
router.get('/:userId', auth('admin', 'customer'), userController.getUserById);
router.put('/:userId', auth('admin', 'customer'),userController.updateUserById);
router.delete('/:userId', auth('admin'), userController.deleteUserById);



export const userRoutes = router;