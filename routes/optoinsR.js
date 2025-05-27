import { Router } from "express";
import { checkAuth } from "../middlewares/authChecker.js";
import {
  createOptions,
//   deleteAllOptions,
  deleteOptions,
  editOptions,
  listOptions,
//   tcreateOptions,
} from "../controllers/optionC.js";

const routes = Router();

routes.post("/", checkAuth, createOptions);
routes.get("/", checkAuth, listOptions);
routes.put("/:id", checkAuth, editOptions);
routes.delete("/:id", checkAuth, deleteOptions);
// routes.post("/t", checkAuth, tcreateOptions);
// routes.delete("/d", checkAuth, deleteAllOptions);

export default routes;
