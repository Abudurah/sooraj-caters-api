import { Router } from "express";
import { checkAuth } from "../middlewares/authChecker.js";
import { createOptions, deleteOptions, editOptions, listOptions } from "../controllers/detailOptions/optionC.js";

const routes = Router();

routes.post("/", checkAuth, createOptions);
routes.get("/", checkAuth, listOptions);
routes.put("/:id", checkAuth, editOptions);
routes.delete("/:id", checkAuth, deleteOptions);

export default routes;
