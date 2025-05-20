import { Router } from "express";
import { checkAuth } from "../middlewares/authChecker.js";
import {
  createDetails,
  deleteDetails,
  editDetails,
  listDetails,
} from "../controllers/detailsC.js";
import { tcreateOptions } from "../controllers/optionC.js";

const routes = Router();

routes.post("/", checkAuth, createDetails);
routes.post("/t", checkAuth, tcreateOptions);
routes.get("/", checkAuth, listDetails);
routes.put("/:id", checkAuth, editDetails);
routes.delete("/:id", checkAuth, deleteDetails);

export default routes;
