import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import webpush from 'web-push'
dotenv.config();

//route imports
import AuthR from "./routes/authR.js";
import OptionsR from "./routes/optoinsR.js";
import DetailsR from "./routes/detailsR.js";
import MenuR from "./routes/menuR.js";
import { initializeScheduler } from "./utils/notificationScheduler.js";

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI;
const HOST = process.env.APP;
const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const MAIL = process.env.VAPID_EMAIL;

webpush.setVapidDetails(`mailto:${MAIL}`, PUBLIC_KEY, PRIVATE_KEY);

const connect = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("connected to database");
  initializeScheduler()
};

// Middleware
app.use(
  cors({
    origin: ["https://sooraj-caters.vercel.app/", "http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

// app routes
app.use("/api/v0.1/", AuthR);
app.use("/api/v0.1/options", OptionsR);
app.use("/api/v0.1/details", DetailsR);
app.use("/api/v0.1/menu", MenuR);

//error throwing middleware
app.use((err, req, res, next) => {
  // console.log(err);
  if (HOST !== "DEVELOPMENT") delete err.stack;
  res.status(err?.status || 500).json(err);
});

app.listen(PORT, () => {
  connect();
  console.log(`Server is running on PORT : ${PORT}`);
});
