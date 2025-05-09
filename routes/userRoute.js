import express from "express";
import { insertUser, loadRegister } from "../controllers/userController.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/userImages"));
  },
  filename: (req, file, cb) => {
    const name = Date.now()+'-'+file.originalname;
    cb(null, name);
  }
});
const upload = multer({storage});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views/layouts/users"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/register", loadRegister);
app.post("/register",upload.single("image"), insertUser);

export default app;
