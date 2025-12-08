import e, { Request, Response } from 'express';
import { bookingService } from './bookings.service';



export const createBooking = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const customer_id = req.user!.id;
    const booking = await bookingService.createBooking({ ...payload, customer_id });
    res.status(201).json({ 
      success: true,
      message: 'Booking created successfully',
      data: booking.rows[0]
     });
  } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
};

 const listBookings = async (req: Request, res: Response) => {
  try {
    const requester = { id: req.user!.id, role: req.user!.role };
    const bookings = await bookingService.listBookings(requester);
    res.status(200).json({ 
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings
     });
  } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
};

 const update = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id || '0', 10);
    const requester = { id: req.user!.id, role: req.user!.role };

    if (requester.role === 'customer') {
      const booking = await bookingService.cancelBooking(bookingId);
      res.status(200).json({
        success: true,
        message: 'Booking retrieved successfully',
        data: booking
      })
    } else if (requester.role === 'admin') {
      const booking = await bookingService.markReturned(bookingId);
      res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        data: booking
      })
    }else {
        throw { status: 403, message: 'Forbidden' };
    }

}catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
};


export const bookingController = {
    createBooking,
    listBookings,
    update
}
