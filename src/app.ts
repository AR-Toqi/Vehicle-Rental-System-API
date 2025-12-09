import express, { Request, Response } from 'express';
import initDB from './config/db';
import { userRoutes } from './modules/user/user.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { vehicleRoutes } from './modules/vehicles/vehicles.routes';
import { bookingRoutes } from './modules/bookings/booking.routes';

export const app = express();


// Parse JSON requests
app.use(express.json());

// DB Initialization
initDB()

// Default route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Operations
app.use('/api/v1/user', userRoutes);

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/vehicles', vehicleRoutes);

app.use('/api/v1/bookings', bookingRoutes)