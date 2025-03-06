import asyncHandler from 'express-async-handler';
import Token from '../models/tokenModel';
import { generateTokens, clearTokens } from '../utils/generateToken';

export const refreshToken = asyncHandler(async (req: any, res: any) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error('Not authorized, no refresh token');
  }

  try {
    const tokenDoc = await Token.findOne({ 
      token: refreshToken,
      type: 'refresh'
    }).lean();

    if (!tokenDoc || tokenDoc.expiresAt.getTime() <= Date.now()) {
      clearTokens(res);
      
      // Delete expired token
      if (tokenDoc) {
        await Token.deleteOne({ _id: tokenDoc._id });
      }

      res.status(401);
      throw new Error('Not authorized, token expired');
    }

    // Generate new tokens
    await generateTokens(res, tokenDoc.userId.toString());
    res.status(200).json({ message: 'Token refreshed' });
    
  } catch (error: any) {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }
}); 