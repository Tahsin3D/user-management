import express from "express"
import {loadRegister} from "../controllers/userController.js"
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "../views/layouts/users"));

app.get('/register', loadRegister);

export default app;