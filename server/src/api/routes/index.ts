import { Router } from "express";
import uploadRoutes from "./uploadRoutes.js";
import videoRoutes from "./videoRoutes.js";

const routes = Router();

routes.use("/upload", uploadRoutes);
routes.use("/video", videoRoutes);

export default routes;
