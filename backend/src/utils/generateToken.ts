import jwt from 'jsonwebtoken';

const generateToken = (res: any, userId: any) => {
    if(!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is missing from .env file');
        return res.status(500).json({message: 'Internal Server Error'});
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * (24 * 60 * 60 * 1000) // 7 days
    });
}


export default generateToken;