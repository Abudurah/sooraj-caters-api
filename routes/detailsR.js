import { Router } from "express";
import { checkAuth } from "../middlewares/authChecker.js";
import {
  createDetails,
  deleteDetails,
  editDetails,
  listDetails,
} from "../controllers/detailsC.js";

const routes = Router();

routes.post("/", checkAuth, createDetails);
routes.get("/", checkAuth, listDetails);
routes.put("/:id", checkAuth, editDetails);
routes.delete("/:id", checkAuth, deleteDetails);

export default routes;
