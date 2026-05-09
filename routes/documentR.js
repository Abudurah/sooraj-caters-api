import { Router } from "express";
import { checkAuth } from "../middlewares/authChecker.js";
import { createDocument, deleteDocument, editDocument, listDocuments } from "../controllers/documentC.js";

const routes = Router();

routes.post("/", checkAuth, createDocument);
routes.get("/", checkAuth, listDocuments);
routes.put("/:id", checkAuth, editDocument);
routes.delete("/:id", checkAuth, deleteDocument);

export default routes;
