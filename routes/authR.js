import { Router } from "express";
import { login, logout } from "../controllers/auth.js";
import { editUser, signup } from "../controllers/userC.js";
import { checkAuth } from "../middlewares/authChecker.js";

const routes = Router();

routes.post("/login", login);
routes.post("/logout", logout);
routes.post("/signup", signup);
routes.put("/edit",checkAuth, editUser);

export default routes