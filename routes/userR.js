import { Router } from "express";
import { editUser } from "../controllers/user/editUser.js";
import { checkAuth } from "../middlewares/authChecker.js";

const routes = Router();

routes.put("/", checkAuth, editUser);

export default routes;
