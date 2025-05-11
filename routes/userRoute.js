import express from "express";
import {
  forgetVerify,
  insertUser,
  loadForgotPassword,
  loadHome,
  loadRegister,
  loadResetPassword,
  loadSignIn,
  loadVerifyEmailPage,
  resetPassword,
  verifyMail,
  verifySignIn,
} from "../controllers/userController.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import multer from "multer";
import { sessionSecret } from "../config/index.js";
import session from "express-session";
import { isLoggedIn, isLoggedOut } from "../middleware/auth.js";
import { checkUserExists } from "../middleware/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/userImages"));
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage });

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views/layouts/users"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: sessionSecret, resave: false, saveUninitialized: false })
);

app.get("/signup", isLoggedOut, loadRegister);
app.post("/signup", upload.single("image"), checkUserExists, insertUser);

app.get("/", isLoggedOut, loadSignIn);
app.get("/login", isLoggedOut, loadSignIn);
app.post("/login", verifySignIn);

app.get("/forgotPassword", isLoggedOut, loadForgotPassword);
app.post("/forgotPassword", forgetVerify);

app.get("/resetPassword", loadResetPassword);
app.post("/resetPassword", resetPassword);

app.get("/home", isLoggedIn, loadHome);

app.get("/emailVerification",isLoggedOut, loadVerifyEmailPage);
app.post("/emailVerification", verifyMail);
export default app;
