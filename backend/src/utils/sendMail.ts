import nodemailer from "nodemailer";
import User from "../models/userModel";

const sendVerifyMail = async (email: any, link: any) => {
  const user = await User.findOne({ email });
  const username = user ? user.name : "user";
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // Send email
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender email
      to: email, // receiver
      subject: "StockWizard Account Verification",
      text: "Welcome",
      html: `
                <div>
                <h1>Hi ${username},</h1>
                <h4>
                <p> Welcome to StockWizard </p>
                <p> Click the following link to verify your email address. </p>
                </h4>
                <br />
                <h3> <a href=${link}>Click here to activate your account</a> </h3>
                <br />
                <br />
                <h4>
                <p><i> This link expires in 7 days. </i></p>
                <p> <b> If you do not recognize this registration request, then kindly ignore this email </b> </p>
                </h4>
                </div>
            `, // mail body
    });
  } catch (err: any) {
    console.log("Email verification error: ", err.message);
  }
};

const sendResetMail = async (email: any, link: any) => {
  const user = await User.findOne({ email });
  const username = user ? user.name : "user";
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // Send email
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender email
      to: email, // receiver
      subject: "StockWizard Password Reset",
      text: "Password Reset",
      html: `
                <div>
                <h1>Hi ${username},</h1>
                <h4>
                <p> A password reset link has been requested for this email </p>
                <p> Click the following link to reset your password </p>
                </h4>
                <br />
                <h3> <a href=${link}>Click here to reset your password</a> </h3>
                <br />
                <br />
                <h4>
                <p><i> This link expires in 7 days. </i></p>
                <p> <b> If you did not make this request, then kindly ignore this email </b> </p>
                </h4>
                </div>
            `, // mail body
    });
  } catch (err: any) {
    console.log("Email verification error: ", err.message);
  }
};

export { sendVerifyMail, sendResetMail };
