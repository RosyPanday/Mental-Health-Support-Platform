import { contextHandler } from "#src/middleware/context.js";
import { Router } from "express";
import { UploadController } from "../controllers/uploadController.js";
import { uploadTherapistDocuments } from "#src/middleware/uploadDocuments.js";

const uploadRoutes = Router();

/*writing only contextHandler will cause runtime 
crash as contextHandler is object expecting function,
the authentication middleware is always a function name without triggering it
if the function is triggered as contextHandler({req,res,next})
then it causes startup crash, causing the function to run at startup and not at the time of request, 
\so the function should be passed as a reference to the middleware and not triggered at startup

*/
uploadRoutes.post(
  "/therapist-document",
  (req, res, next) => {
    contextHandler({ req, res, next });
  },
  uploadTherapistDocuments,
  UploadController.uploadTherapistDocument,
);

export default uploadRoutes;
