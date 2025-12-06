import express, { Request, Response } from 'express';
import initDB from './config/db';
import config from './config/index';
import { userRoutes } from './modules/user/user.routes';
import { authRoutes } from './modules/auth/auth.routes';

export const app = express();


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Parse JSON requests
app.use(express.json());

// DB Initialization
initDB()


// User Operations
app.use('/api/v1/user', userRoutes);

app.use('/api/v1/auth', authRoutes);