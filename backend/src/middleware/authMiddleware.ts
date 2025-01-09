import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import { JwtPayload } from '../utils/definition';
// extend the JwtPayload interface to include type for userId


const protect = asyncHandler(async (req: any, res: any, next: any) => {
    let token = req.cookies.jwt;

    if(token) {
        try {
            if(!process.env.JWT_SECRET) {
                console.error('JWT_SECRET is missing from .env file');
                res.status(500);
                throw new Error('Internal Server Error');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch(err: any) {
            res.status(401);
            throw new Error(err.message || 'Not authorized'); // invalid token
        }
    } else {
        res.status(401);
        throw new Error('Not authorized'); // no token
    }
});

export { protect };