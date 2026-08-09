import jwt from "jsonwebtoken";
import { streamApiKey, streamSecret } from "#src/config/index.js";

const presence = new Map<number, number>();
const activeCalls = new Map<string, { therapistId: number; patientUserId: number; patientStreamId: string; therapistStreamId: string; expiresAt: number }>();
const ONLINE_TTL_MS = 45000;
const CALL_MAX_TTL_MS = 2 * 60 * 60 * 1000;

const streamIdFor = (userId: number) => `user-${userId}`;

function pruneExpiredCalls(): void {
  const now = Date.now();
  for (const [callId, call] of activeCalls.entries()) {
    if (now > call.expiresAt) activeCalls.delete(callId);
  }
}

export const VideoService = {
  isConfigured(): boolean {
    return Boolean(streamApiKey && streamSecret);
  },

  apiKey(): string {
    return streamApiKey!;
  },

  generateToken(userId: number): string {
    if (!VideoService.isConfigured()) {
      throw new Error("Stream credentials are not configured. Add STREAM_API_KEY and STREAM_SECRET to the server .env file.");
    }
    const now = Math.floor(Date.now() / 1000);
    return jwt.sign(
      {
        user_id: streamIdFor(userId),
        sub: `user/${streamIdFor(userId)}`,
        apiKey: streamApiKey,
        iat: now,
        exp: now + 7200,
      },
      streamSecret!,
      { algorithm: "HS256" },
    );
  },

  markOnline(therapistId: number): void {
    presence.set(therapistId, Date.now());
  },

  isOnline(therapistId: number): boolean {
    const lastSeen = presence.get(therapistId);
    return Boolean(lastSeen && Date.now() - lastSeen < ONLINE_TTL_MS);
  },

  isBusy(therapistId: number): boolean {
    pruneExpiredCalls();
    for (const call of activeCalls.values()) {
      if (call.therapistId === therapistId) return true;
    }
    return false;
  },

  startCall(therapistId: number, patientUserId: number): { callId: string; patientStreamId: string; therapistStreamId: string } {
    pruneExpiredCalls();

    for (const [callId, call] of activeCalls.entries()) {
      if (call.patientUserId === patientUserId) activeCalls.delete(callId);
    }

    if (VideoService.isBusy(therapistId)) {
      throw new Error("This therapist is currently on a call. Please try again later.");
    }
    const callId = `calm-${patientUserId}-${Date.now()}`;
    activeCalls.set(callId, {
      therapistId,
      patientUserId,
      patientStreamId: streamIdFor(patientUserId),
      therapistStreamId: streamIdFor(therapistId),
      expiresAt: Date.now() + CALL_MAX_TTL_MS,
    });
    return { callId, patientStreamId: streamIdFor(patientUserId), therapistStreamId: streamIdFor(therapistId) };
  },

  endCall(callId: string): void {
    activeCalls.delete(callId);
  },

  getCall(callId: string) {
    pruneExpiredCalls();
    return activeCalls.get(callId);
  },

  getCallByTherapist(therapistId: number) {
    pruneExpiredCalls();
    for (const [callId, call] of activeCalls.entries()) {
      if (call.therapistId === therapistId) {
        return { callId, ...call };
      }
    }
    return null;
  },
};