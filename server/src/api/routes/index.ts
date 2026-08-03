import { Router } from "express";
import uploadRoutes from "./uploadRoutes.js";

const routes = Router();

routes.use("/upload", uploadRoutes);

export default routes;
