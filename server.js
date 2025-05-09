import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI;

const connect = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("connected to database");
};

// Middleware
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  connect();
  console.log(`Server is running on PORT : ${PORT}`);
});
