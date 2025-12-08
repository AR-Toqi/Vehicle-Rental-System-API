import {Request, Response, NextFunction } from "express"
import config from '../config/index';
import  jwt, { JwtPayload } from 'jsonwebtoken';



const auth = (...roles: ('admin' | 'customer')[]) => {
    return async( req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if(!authHeader || !authHeader.startsWith('Bearer ')){
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            const token = authHeader.split(' ')[1];

            const decoded = jwt.verify(token as string, config.jwtSecrete as string) as JwtPayload;
            req.user = decoded;
            console.log(decoded);

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'unauthorized!!!'
                })
            }
            next();
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
};


export default auth;