import express from 'express';
import { bookingController } from './bookings.controller';
import auth from '../../middleware/authMiddleware';



const router = express.Router();

router.post('/', auth('admin', 'customer'),bookingController.createBooking);
router.get('/', auth('admin'), bookingController.listBookings);
router.get('/:bookingId', auth('customer'), bookingController.listBookings);
router.put('/:bookingId', auth('admin'), bookingController.update);
router.put('/:bookingId', auth('customer'), bookingController.update);


export const bookingRoutes = router;