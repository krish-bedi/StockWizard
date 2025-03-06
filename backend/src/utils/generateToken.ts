import jwt from 'jsonwebtoken';
import Token from '../models/tokenModel';
import crypto from 'crypto';

const generateTokens = async (res: any, userId: string) => {
    if(!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        console.error('JWT secrets missing from .env file');
        return res.status(500).json({message: 'Internal Server Error'});
    }

    // Generate access token (15 minutes)
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15m'
    });

    // Generate new refresh token (14 days)
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const REFRESH_TOKEN_DURATION = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

    // Delete any existing refresh tokens for this user
    await Token.deleteMany({ userId, type: 'refresh' });

    // Save new refresh token
    await Token.create({
        userId,
        token: refreshToken,
        type: 'refresh',
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_DURATION)
    });

    // Set cookies
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/',
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.COOKIE_DOMAIN,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_DURATION,
        path: '/',
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.COOKIE_DOMAIN,
    });
};

// Export both ways for compatibility
export { generateTokens };
export default generateTokens;

export const clearTokens = (res: any) => {
    res.cookie('accessToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.COOKIE_DOMAIN,
        expires: new Date(0)
    });

    res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.COOKIE_DOMAIN,
        expires: new Date(0)
    });
};