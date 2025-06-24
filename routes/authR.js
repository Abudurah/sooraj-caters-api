import { Router } from "express";
import { login, logout } from "../controllers/auth.js";
import {
  editUser,
  getLogedInUserDetails,
  signup,
  subscribePushNotification,
  unsubscribePushNotification,
} from "../controllers/userC.js";
import { checkAuth } from "../middlewares/authChecker.js";

const routes = Router();

routes.post("/login", login);
routes.post("/logout", logout);
routes.post("/signup", signup);
routes.put("/subscribe", checkAuth, subscribePushNotification);
routes.put("/unsubscribe", checkAuth, unsubscribePushNotification);
routes.put("/edit", checkAuth, editUser);
routes.get("/userDetails", checkAuth, getLogedInUserDetails);

export default routes;
