import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import validator from "validator";
import generateToken from "../utils/generateToken";
import { IUser } from "../utils/definition";
import Token from "../models/tokenModel";
import crypto from "crypto";
import { sendResetMail, sendVerifyMail } from "../utils/sendMail";
import generatePassword from "../utils/generateRandomPassword";

// @desc: Auth user / set token
// route: POST /api/users/auth
// access: Public
const authUser = asyncHandler(async (req: any, res: any) => {
  // Token auth
  const { token } = req.body;
  if (token) {
    try {
      const tokenDoc = await Token.findOne({ token }).populate("userId"); // Get user id from token
      if (tokenDoc && tokenDoc.userId) {
        const user = (await User.findById(tokenDoc.userId)) as IUser;
        // If user exist and is not verified
        if (user && !user.isVerified) {
          // Set is verified to true
          await User.updateOne(
            { _id: user._id },
            { $set: { isVerified: true } }
          );
          // Delete token from collection
          await Token.deleteMany({ userId: user._id });
          // Generate JWT token and set cookie
          generateToken(res, user._id);
          // Return user data
          res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
          });
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  } else {
    // Email:Password auth
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please enter email and password");
    }

    const user = (await User.findOne({ email })) as IUser;

    if (user && (await user.matchPassword(password))) {
      if (user.isVerified) {
        generateToken(res, user._id); // JWT Token
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
        });
      } else {
        res.status(401);
        throw new Error("Email address has not been verified");
      }
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
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

  // Password Validation: 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    res.status(400);
    throw new Error("Password requirements were not met");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    console.error(
      `Attempt to register with already registered email: ${email}`
    );
    // Send generic message to avoid leaking information about registered emails
    res.status(200).json({
      message:
        "Registration request received. If the email provided is valid, you will receive a confirmation link.",
    });
    return;
  } else {
    const isVerified = false; //User not verified by default

    // Try to create user
    try {
      const user = await User.create({
        name,
        email,
        password,
        isVerified,
      });

      if (!user) {
        console.error("Error creating user");
        res.status(500);
        throw new Error("Internal Server Error");
      }

      // Create email verification token
      const token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await token.save();

      // Send verification mail
      const link = `http://localhost:3000/login/${token.token}`;
      await sendVerifyMail(email, link);

      return res.status(200).json({
        message:
          "Registration request received. If the email provided is valid, you will receive a confirmation link.",
      });
    } catch (error) {
      console.error(`Error during user registration: ${error}`);
      res.status(500);
      throw new Error("Internal Server Error");
    }
  }
});

// @desc: OAuth
// route: POST /api/users/oauth
// access: Public
const oAuth = asyncHandler(async (req, res) => {
  const { name, email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // If OAuth user exists
      if (!user.isVerified) {
        await User.updateOne({ _id: user._id }, { $set: { isVerified: true } });
      }
      if (!user.imageUrl) {
        await User.updateOne(
          { _id: user._id },
          { $set: { imageUrl: googlePhotoUrl } }
        );
      }
      generateToken(res, user._id); // JWT Token
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: googlePhotoUrl,
      });
    } else {
      // If OAuth user does not exist
      const password = generatePassword(); // Generate random password
      const isVerified = true; // no verification needed for OAuth users
      const imageUrl = googlePhotoUrl; // Google profile picture
      const user = await User.create({
        name,
        email,
        password,
        isVerified,
        imageUrl,
      });

      if (!user) {
        console.error("Error creating user");
        res.status(500);
        throw new Error("Internal Server Error");
      }
      
      generateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      });
    }
  } catch (error) {
    console.error(`Error during user registration: ${error}`);
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

// @desc: Logout user
// route: POST /api/users/logout
// access: Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(0),
  });

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
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
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
  const user = (await User.findOne({ email })) as IUser;
  // Create email verification token
  const token = new Token({
    userId: user._id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  await token.save();

  // Send reset link to mail
  const link = `http://localhost:3000/resetpassword/${token.token}`;
  await sendResetMail(email, link);

  return res.status(200).json({
    message: "If the email provided is valid, you will receive a reset link.",
  });
});

// @desc: Forgot Password Update
// route: POST /api/users/passwordupdate
// access: Public
const forgotPasswordUpdate = asyncHandler(async (req: any, res: any) => {
  // Token based Forgot Password Reset
  const { token } = req.body;
  if (token) {
    try {
      const tokenDoc = await Token.findOne({ token }).populate("userId");
      if (tokenDoc && tokenDoc.userId) {
        const user = (await User.findById(tokenDoc.userId)) as IUser;
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
      } else {
        res.status(400);
        throw new Error("Invalid token");
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

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  resetPassword,
  forgotPasswordUpdate,
  oAuth,
};
