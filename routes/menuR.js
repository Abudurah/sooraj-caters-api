import { Router } from "express";
import { checkAuth } from "../middlewares/authChecker.js";
import { createMenu, deleteMenu, editMenu, listMenu } from "../controllers/menu/menuC.js";

const routes = Router();

routes.post("/", checkAuth, createMenu);
routes.get("/", checkAuth, listMenu);
routes.put("/:id", checkAuth, editMenu);
routes.delete("/:id", checkAuth, deleteMenu);

export default routes;
