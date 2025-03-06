import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import validator from "validator";
import { generateTokens } from "../utils/generateToken";
import { IUser } from "../utils/definition";
import Token from "../models/tokenModel";
import crypto from "crypto";
import { sendResetMail, sendVerifyMail } from "../utils/sendMail";
import { clearTokens } from "../utils/generateToken";
import { CustomRequest } from "../utils/definition";

// Helper function to ensure string type for user._id
const ensureString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value && typeof value === 'object' && 'toString' in value) {
    return value.toString();
  }
  throw new Error('Invalid ID format');
};

// @desc: Auth user / set token
// route: POST /api/users/auth
// access: Public
const authUser = asyncHandler(async (req: any, res: any) => {
  const { email, password, token, isVerification } = req.body;

  if (token && isVerification) {
    // Handle verification token login
    const verificationToken = await Token.findOne({ token, type: 'verification' });
    if (!verificationToken) {
      res.status(401);
      throw new Error('Invalid or expired verification link. Please request a new one.');
    }

    const user = await User.findById(verificationToken.userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.isVerified) {
      // Clean up any remaining verification tokens
      await Token.deleteMany({ userId: user._id, type: 'verification' });
      res.status(400);
      throw new Error('Email is already verified. Please login.');
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    // Delete all verification tokens for this user
    await Token.deleteMany({ userId: user._id, type: 'verification' });

    // Generate tokens and send response
    await generateTokens(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified
    });
    return;
  }

  // Regular login flow
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error('Email address has not been verified');
    }
    await generateTokens(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc: Register a new user
// route: POST /api/users
// access: Public
const registerUser = asyncHandler(async (req: any, res: any) => {
  const { name, email, password } = req.body;

  // Check for required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  // Email validation
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email");
  }

  // Check if user exists with this email
  const userExists = await User.findOne({ email });
  if (userExists) {
    // Only show specific message if user exists with OAuth
    if (userExists.provider === 'google') {
      res.status(400);
      throw new Error("Please use 'Sign in with Google'");
    }
    
    // Keep existing generic message for local auth users
    // console.error(
    //   `Attempt to register with already registered email: ${email}`
    // );
    res.status(200).json({
      message: [
        "Please check your email for a verification link.",
      ]
    });
    return;
  }

  const isVerified = false; // User not verified by default

  // Try to create user
  try {
    const user = await User.create({
      name,
      email,
      password,
      isVerified,
      provider: 'local'
    });

    if (!user) {
      console.error("Error creating user");
      res.status(500);
      throw new Error("Internal Server Error");
    }

    // Create email verification token ONLY (no refresh token)
    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
      type: 'verification'
    });
    await token.save();

    // Send verification mail
    const link = `http://localhost:3000/login/${token.token}`;
    await sendVerifyMail(email, link);

    // Don't generate refresh token here - user isn't logged in yet
    return res.status(200).json({
      message: [
        "If the email provided is valid, you will receive a confirmation link."
      ]
    });
  } catch (error) {
    console.error(`Error during user registration: ${error}`);
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

// @desc: OAuth
// route: POST /api/users/oauth
// access: Public
const oAuth = asyncHandler(async (req, res) => {
  const { name, email, googleId, googlePhotoUrl } = req.body;
  
  try {
    // First check if user exists with this email but with local provider
    const localUser = await User.findOne({ email, provider: 'local' });
    if (localUser) {
      res.status(400);
      throw new Error('This email is already registered. Please use email/password to login.');
    }

    let user = await User.findOne({ 
      $or: [
        { email, provider: 'google' },
        { providerId: googleId, provider: 'google' }
      ]
    });

    if (user) {
      // Update existing OAuth user
      user = await User.findByIdAndUpdate(
        user._id,
        { 
          imageUrl: googlePhotoUrl,
          isVerified: true
        },
        { new: true }
      );
    } else {
      // Create new OAuth user
      user = await User.create({
        name,
        email,
        imageUrl: googlePhotoUrl,
        isVerified: true,
        provider: 'google',
        providerId: googleId
      });
    }

    if (!user) {
      res.status(500);
      throw new Error("Error processing OAuth user");
    }

    await generateTokens(res, ensureString(user._id));
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      provider: user.provider
    });
  } catch (error: any) {
    res.status(error.status || 500);
    throw new Error(error.message || "Internal Server Error");
  }
});

// @desc: Logout user
// route: POST /api/users/logout
// access: Public
const logoutUser = asyncHandler(async (req: CustomRequest, res: any) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, no user found');
  }
  
  // Delete refresh token from database
  await Token.deleteMany({ userId: req.user._id, type: 'refresh' });
  clearTokens(res);
  res.status(200).json({ message: "User logged out" });
});

// @desc: Get user profile
// route: GET /api/users/profile
// access: Private
const getUserProfile = asyncHandler(async (req: any, res: any) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    imageUrl: req.user.imageUrl,
  };
  res.status(200).json(user);
});

// @desc: Update user profile
// route: PUT /api/users/profile
// access: Private
const updateUserProfile = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Only allow local users to change email/password
    if (user.provider === 'google') {
      if (req.body.email || req.body.password) {
        res.status(400);
        throw new Error("Google login users cannot change their email or password");
      }
      // Only allow name changes for OAuth users
      user.name = req.body.name || user.name;
    } else {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      imageUrl: user.imageUrl,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc: Reset Password
// route: POST /api/users/resetpassword
// access: Public
const resetPassword = asyncHandler(async (req: any, res: any) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });
  
  // Prevent OAuth users from using password reset
  if (user && user.provider === 'google') {
    res.status(400);
    throw new Error("This email is registered with Google login. Please use 'Sign in with Google'");
  }

  // Create email verification token
  if (user) {
    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
      type: 'reset'
    });
    await token.save();

    // Send reset link to mail
    const link = `http://localhost:3000/resetpassword/${token.token}`;
    await sendResetMail(email, link);
  }

  return res.status(200).json({
    message: "If the email provided is valid, you will receive a reset link.",
  });
});

// @desc: Forgot Password Update
// route: POST /api/users/passwordupdate
// access: Public
const forgotPasswordUpdate = asyncHandler(async (req: any, res: any) => {
  const { token } = req.body;
  if (token) {
    try {
      const tokenDoc = await Token.findOne({ token }).populate("userId");
      if (tokenDoc && tokenDoc.userId) {
        const user = (await User.findById(tokenDoc.userId)) as IUser;
        
        // Add OAuth check
        if (user && user.provider === 'google') {
          res.status(400);
          throw new Error("Google login users cannot change their password");
        }

        if (user) {
          // Delete token from collection
          await Token.deleteMany({ userId: user._id });

          if (req.body.password) {
            user.password = req.body.password;
          }

          const updatedUser = await user.save();

          res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            message: "Password updated successfully",
          });
        } else {
          res.status(400);
          throw new Error("Invalid token");
        }
      }
    } catch (err: any) {
      res.status(400);
      throw new Error("Invalid token");
    }
  } else {
    res.status(400);
    throw new Error("Invalid token");
  }
});

const resendVerification = asyncHandler(async (req: any, res: any) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  // Check for existing verification token and its creation time
  const existingToken = await Token.findOne({ 
    userId: user._id, 
    type: 'verification' 
  });

  if (existingToken) {
    // Convert MongoDB date to timestamp
    const tokenCreationTime = new Date(existingToken.createdAt).getTime();
    const timeSinceLastEmail = Date.now() - tokenCreationTime;
    const cooldownPeriod = 60 * 1000; // 60 seconds in milliseconds
    
    if (timeSinceLastEmail < cooldownPeriod) {
      const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastEmail) / 1000);
      res.status(429); // Too Many Requests
      throw new Error(`Please wait ${remainingTime} seconds before requesting another verification email`);
    }

    // Delete old token if cooldown period has passed
    await Token.deleteMany({ userId: user._id, type: 'verification' });
  }

  // Create new verification token
  const token = new Token({
    userId: user._id,
    token: crypto.randomBytes(16).toString("hex"),
    type: 'verification',
    createdAt: new Date()
  });
  await token.save();

  // Send verification mail
  const link = `http://localhost:3000/login/${token.token}`;
  await sendVerifyMail(email, link);

  res.status(200).json({ message: 'Verification email sent' });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  resetPassword,
  forgotPasswordUpdate,
  oAuth,
  resendVerification,
};
