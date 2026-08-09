import { Router } from "express";
import { contextHandler } from "#src/middleware/context.js";
import { VideoController } from "../controllers/videoController.js";

const videoRoutes = Router();

const authenticate = (req: any, res: any, next: any) => {
  contextHandler({ req, res, next });
};

videoRoutes.get("/credentials", authenticate, VideoController.getCredentials);
videoRoutes.post("/start", authenticate, VideoController.startCall);
videoRoutes.post("/end", authenticate, VideoController.endCall);
videoRoutes.post("/heartbeat", authenticate, VideoController.heartbeat);
videoRoutes.get("/calls", authenticate, VideoController.getActiveCalls);

export default videoRoutes;