import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

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
    });

    const userData = await user.save();

    if (userData) {
      res.render("registration", { message: "Registration successful." });
    } else {
      res.render("registration", { message: "Registration Unsuccessful." });
    }
  } catch (error) {
    console.log(error);
  }
};

export { loadRegister, insertUser };
