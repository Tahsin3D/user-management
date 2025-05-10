import { User } from "../models/userModel.js";

export const checkUserExists = async (req, res, next) => {
  console.log(req.body);
  const alreadyExistsEmail = await User.findOne({ email: req.body.email });
  if (alreadyExistsEmail) {
    return res.render("registration", { message: "Email already exists" });
  } else {
    next();
  }
};
