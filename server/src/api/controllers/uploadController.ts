import type { TherapistUploadFields } from "#src/interfaces/index.js";
import { UploadService } from "#src/services/uploadService.js";
import { Guard } from "#src/utils/guard.js";
import type { NextFunction, Request, Response } from "express";

export class UploadController {
  public static uploadTherapistDocument = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const therapistId = await Guard.grantTherapist(req.user.id);

      //for ts type resolution as we have used field in middleware with fieldNames
      const files = req.files as unknown as TherapistUploadFields | undefined;
      if (
        !files ||
        !files.profilePic?.[0] ||
        !files.educationalDoc1?.[0] ||
        !files.educationalDoc2?.[0] ||
        !files.professionalDoc?.[0]
      ) {
        throw new Error(
          "Missing required files. Please upload all required documents",
        );
      }
      await new UploadService().uploadTherapistDocumentsAndImage(
        therapistId,
        files.profilePic?.[0].path,
        files.educationalDoc1?.[0].path,
        files.educationalDoc2?.[0].path,
        files.professionalDoc?.[0].path,
      );
      res.status(200).json({
        message:
          "Therapist documents and profile picture uploaded successfully.",
      });
    } catch (error) {
      next(error);
    }
  };
}
