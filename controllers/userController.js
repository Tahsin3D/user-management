import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import randomstring from "randomstring";

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

// For Email verification
const sendVerifyMail = async (name, email, verificationCode) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "tahsin3194@gmail.com",
        pass: "mxoz gnxc bttt kxya",
      },
    });

    const mailOptions = {
      from: "tahsin3194@gmail.com",
      to: email,
      subject: "For Verification Mail",
      html:
        "<p>Hi " +
        name +
        "! Your verification code is " +
        verificationCode +
        "</p>",
    };

    await User.findOneAndUpdate(
      { email },
      { $set: { token: verificationCode } }
    );
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent: ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const loadVerifyEmailPage = async (req, res) => {
  try {
    res.render("email-verification");
  } catch (error) {
    console.log(error);
  }
};

const verifyMail = async (req, res) => {
  try {
    const { code, email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      if (user.token === code) {
        await User.findByIdAndUpdate(
          { _id: user._id },
          { $set: { is_verified: true } , $unset: {token: ""}},
          { new: true }
        );
        res.redirect("/login");
      } else {
        res.render("email-verification", { message: "Code is incorrect" });
      }
    } else {
      res.render("email-verification", { message: "Code is incorrect" });
    }
  } catch (error) {
    console.log(error);
  }
};

// For Sign Up
const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};

const insertUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const { filename } = req.file;

    const hashedPassword = await hashPassword(password);

    const user = new User({
      name: name,
      email: email,
      mobile: phone,
      image: filename,
      password: hashedPassword,
      is_admin: false,
      is_verified: false,
    });

    const userData = await user.save();

    if (userData) {
      const verificationCode = Math.floor(10000000 + Math.random() * 90000000);
      sendVerifyMail(name, email, verificationCode);
      res.redirect("/emailVerification");
    } else {
      res.render("registration", { message: "Registration Unsuccessful." });
    }
  } catch (error) {
    console.log(error);
  }
};

// For Sign In
const loadSignIn = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
};

const verifySignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        if (user.is_verified) {
          req.session.user_id = user._id;
          return res.redirect("/home");
        } else {
          return res.render("login", { message: "Verify your email" });
        }
      } else {
        return res.render("login", {
          message: "Email or password is incorrect",
        });
      }
    } else {
      return res.render("login", { message: "User does not exist" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Home

const loadHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error);
  }
};

// Forgot Password

const loadForgotPassword = async (req, res) => {
  try {
    res.render("forgotPassword");
  } catch (error) {
    console.log(error);
  }
};

const sendForgotMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "tahsin3194@gmail.com",
        pass: "mxoz gnxc bttt kxya",
      },
    });
    const mailOptions = {
      from: "tahsin3194@gmail.com",
      to: email,
      subject: "For Resetting Password",
      html:
        "<p>Hi " +
        name +
        '! Please click here to reset your password: <a href="http://localhost:3000/resetPassword?token=' +
        token +
        '">Reset Password</a></p>',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent: ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const forgetVerify = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.render("forgotPassword", { message: "Email does not exist!" });
  if (!user.is_verified)
    return res.render("forgotPassword", {
      message: "Please varify your email first.",
    });

  const randomString = randomstring.generate();
  const updatedUser = await User.findOneAndUpdate(
    { email },
    { $set: { token: randomString } },
    { new: true }
  );

  if (updatedUser) {
    sendForgotMail(updatedUser.name, updatedUser.email, updatedUser.token);
    return res.render("login", { message: "Please check your mail." });
  } else {
    console.log("User not Updated");
    return res.render("forgotPassword");
  }
};

const loadResetPassword = async (req, res) => {
  try {
    res.render("resetPassword");
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  const token = req.query.token;
  const { password } = req.body;

  const hashedPassword = await hashPassword(password);

  const user = await User.findOne({ token });

  if (!user) return res.redirect("/signup");

  await User.findByIdAndUpdate(
    { _id: user._id },
    { $set: { password: hashedPassword } }
  );
  return res.redirect("/login");
};

export {
  loadRegister,
  loadSignIn,
  loadHome,
  loadForgotPassword,
  loadResetPassword,
  verifySignIn,
  insertUser,
  verifyMail,
  forgetVerify,
  resetPassword,
  loadVerifyEmailPage,
};
