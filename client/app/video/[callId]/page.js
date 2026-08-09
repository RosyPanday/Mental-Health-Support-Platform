"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CallingState,
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  clearCallSession,
  endVideoCall,
  fetchVideoCredentials,
  getCallSession,
} from "@/lib/video";
import { getAuthRole } from "@/lib/auth";

function homeRoute() {
  return getAuthRole() === "therapist" ? "/therapist/dashboard" : "/home";
}

function EndCallButton() {
  const call = useCall();
  const router = useRouter();

  const handleEnd = useCallback(() => {
    call?.leave();
    router.replace(homeRoute());
  }, [call, router]);

  return (
    <button
      type="button"
      onClick={handleEnd}
      className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
    >
      End call
    </button>
  );
}

function CallRoom() {
  const call = useCall();
  const callId = call?.id || "";
const router = useRouter();
  const { useCallCallingState, useRemoteParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const remoteParticipants = useRemoteParticipants();
  const cleanedUp = useRef(false);

  const isRinging = callingState === CallingState.JOINING;
  const isWaiting = remoteParticipants.length === 0;
  const isEnded =
    callingState === CallingState.LEFT || callingState === CallingState.ENDED;

  const finish = useCallback(async () => {
    if (cleanedUp.current) return;
    cleanedUp.current = true;
    try {
      await call?.leave();
    } catch {}
    try {
      if (callId) await endVideoCall(callId);
    } catch {}
    clearCallSession();
    router.replace(homeRoute());
  }, [call, callId, router]);

  useEffect(() => {
    if (isEnded) {
      finish();
    }
  }, [isEnded, finish]);

  if (isRinging) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 rounded-3xl bg-white p-10 text-center shadow-sm">
        <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
          CS
        </div>
        <p className="text-xl font-semibold text-slate-800">Connecting you to your therapist...</p>
        <p className="text-sm text-slate-500">Please wait, the call is being established.</p>
        <EndCallButton />
      </div>
    );
  }

  return (
    <StreamTheme className="h-[calc(100vh-8rem)] rounded-3xl bg-slate-900 shadow-sm">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center justify-between gap-3 bg-slate-800 px-4 py-2.5">
          <p className="text-sm font-medium text-slate-100">Private consultation call</p>
          <EndCallButton />
        </div>
<div className="min-h-0 flex-1">
          <SpeakerLayout />
          {isWaiting && (
            <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center">
              <p className="rounded-xl bg-white/95 px-5 py-3 text-sm font-medium text-slate-700 shadow">
                Waiting for the other person to join the call...
              </p>
            </div>
          )}
        </div>
        <div className="shrink-0 bg-slate-800 pb-3 pt-1">
          <CallControls />
        </div>
      </div>
    </StreamTheme>
  );
}

export default function VideoCallPage() {
  const params = useParams();
  const router = useRouter();
  const callId = Array.isArray(params?.callId) ? params.callId[0] : params?.callId;
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken || !callId) {
          router.replace("/login");
          return;
        }

        const stored = getCallSession();
        let apiKey = stored?.apiKey;
        let streamToken = stored?.token;
        let streamId = stored?.streamId;
        let name = stored?.name;

        if (!apiKey || !streamToken || !streamId || stored?.callId !== callId) {
          const credentials = await fetchVideoCredentials();
          apiKey = credentials.apiKey;
          streamToken = credentials.token;
          streamId = credentials.streamId;
          name = credentials.name || streamId;
        }

        const streamClient = new StreamVideoClient({
          apiKey,
          token: streamToken,
          user: { id: streamId, name: name || streamId },
        });

        await streamClient.connectUser({ id: streamId, name: name || streamId }, streamToken);

        const activeCall = streamClient.call("default", callId);
        await activeCall.join({ create: true });

        if (cancelled) {
          streamClient.disconnectUser();
          return;
        }

        setClient(streamClient);
        setCall(activeCall);
        clearCallSession();
      } catch (err) {
        if (!cancelled) setError(err?.message || "Could not join the call. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setup();

    return () => {
      cancelled = true;
    };
  }, [callId, router]);

  useEffect(() => {
    return () => {
      try {
        client?.disconnectUser();
      } catch {}
    };
  }, [client]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="rounded-2xl bg-white px-6 py-5 font-medium text-slate-600 shadow-sm">Joining your call...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">Call unavailable</h1>
          <p className="mt-3 leading-7 text-slate-600">{error}</p>
          <button
            type="button"
            onClick={() => router.replace(homeRoute())}
            className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (!client || !call) return null;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme className="h-full">
          <CallRoom />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
}
