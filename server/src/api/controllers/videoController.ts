import type { NextFunction, Request, Response } from "express";
import { VideoService } from "#src/services/videoService.js";
import { Guard } from "#src/utils/guard.js";
import { TherapistRepository, ConsultationTicketRepository } from "#src/repositories/index.js";
import { RoleEnum } from "#src/enums/roleEnum.js";

export class VideoController {
  public static getCredentials = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!VideoService.isConfigured()) {
        throw new Error("Video calls are not configured yet. Add STREAM_API_KEY and STREAM_SECRET to the server .env file.");
      }
      const token = VideoService.generateToken(req.user.id);
      const streamId = `user-${req.user.id}`;
      const role = req.user.role;
      let name = "";
      if (role === RoleEnum.therapist) {
        const therapistId = await Guard.grantTherapist(req.user.id);
        const therapist = await new TherapistRepository().findByPk(therapistId);
        name = therapist?.name ?? "";
      }
      res.status(200).json({
        apiKey: VideoService.apiKey(),
        token,
        streamId,
        name,
      });
    } catch (error) {
      next(error);
    }
  };

  public static startCall = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (req.user.role !== RoleEnum.patient) throw new Error("Only patients can start a call.");
      const patientUserId = req.user.id;
      const therapistId = Number(req.body.therapistId);
      if (!therapistId) throw new Error("Therapist id is required.");
      const therapist = await new TherapistRepository().findByPk(therapistId);
      if (!therapist || !therapist.isVerified) throw new Error("This therapist is not available for a call right now.");
      if (!VideoService.isConfigured()) throw new Error("Video calls are not configured yet. Add STREAM_API_KEY and STREAM_SECRET to the server .env file.");

      const patientId = await Guard.grantPatient(patientUserId);
      const ticketRepo = new ConsultationTicketRepository();
      const ticket = await ticketRepo.findOne({
        where: { patientId, status: "COMPLETED" },
        order: [["id", "DESC"]],
      });
      if (!ticket) throw new Error("You do not have an active ticket. Please buy a ticket first.");

      const call = VideoService.startCall(therapistId, patientUserId);
      await ticketRepo.update({ where: { id: ticket.id }, input: { therapistId, status: "USED" } });

      res.status(200).json({
        message: "Call started.",
        data: {
          callId: call.callId,
          patientStreamId: call.patientStreamId,
          therapistStreamId: call.therapistStreamId,
          patientUserId: patientUserId,
          token: VideoService.generateToken(patientUserId),
          apiKey: VideoService.apiKey(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public static endCall = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const callId = req.body.callId as string;
      if (!callId) throw new Error("Call id is required.");
      VideoService.endCall(callId);
      res.status(200).json({ message: "Call ended." });
    } catch (error) {
      next(error);
    }
  };

  public static heartbeat = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (req.user.role !== RoleEnum.therapist) throw new Error("Only therapists can update presence.");
      const therapistId = await Guard.grantTherapist(req.user.id);
      VideoService.markOnline(therapistId);
      res.status(200).json({ message: "online" });
    } catch (error) {
      next(error);
    }
  };

  public static getActiveCalls = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (req.user.role !== RoleEnum.therapist) throw new Error("Only therapists can see incoming calls.");
      const therapistId = await Guard.grantTherapist(req.user.id);
      const call = VideoService.getCallByTherapist(therapistId);
      res.status(200).json({ data: call });
    } catch (error) {
      next(error);
    }
  };
}