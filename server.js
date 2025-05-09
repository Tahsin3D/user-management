import mongoose from "mongoose";
import express from "express";
import userRoute from "./routes/userRoute.js";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(
    `mongodb+srv://tahsin:${process.env.ATLAS_PASSWORD}@cluster0.eox5kn5.mongodb.net/user-management`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const app = express();

app.use("/", userRoute);

app.listen(3000, () => {
  console.log("Server is running!");
});
