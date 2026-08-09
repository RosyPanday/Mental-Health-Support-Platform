const API_BASE = "http://localhost:4000/api";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  };
}

export async function fetchVideoCredentials() {
  const response = await fetch(`${API_BASE}/video/credentials`, { headers: authHeaders() });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Could not load video credentials.");
  }
  return await response.json();
}

export async function startVideoCall(therapistId) {
  const response = await fetch(`${API_BASE}/video/start`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ therapistId }),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) throw new Error(result?.message || "Could not start the call.");
  return result.data;
}

export async function endVideoCall(callId) {
  await fetch(`${API_BASE}/video/end`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ callId }),
  });
}

export function sendTherapistHeartbeat() {
  fetch(`${API_BASE}/video/heartbeat`, {
    method: "POST",
    headers: authHeaders(),
  }).catch(() => {});
}

export function startHeartbeat() {
  sendTherapistHeartbeat();
  const interval = setInterval(sendTherapistHeartbeat, 15000);
  return () => clearInterval(interval);
}

export async function fetchActiveCalls() {
  const response = await fetch(`${API_BASE}/video/calls`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Could not load incoming calls.");
  const result = await response.json();
  return result.data ?? null;
}

const CALL_SESSION_KEY = "calmspace-call-init";

export function saveCallSession(session) {
  sessionStorage.setItem(CALL_SESSION_KEY, JSON.stringify(session));
}

export function getCallSession() {
  try {
    return JSON.parse(sessionStorage.getItem(CALL_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function clearCallSession() {
  sessionStorage.removeItem(CALL_SESSION_KEY);
}

export async function prepareCallSession(callId, name) {
  const credentials = await fetchVideoCredentials();
  const session = {
    callId,
    apiKey: credentials.apiKey,
    token: credentials.token,
    streamId: credentials.streamId,
    name: name || credentials.name || credentials.streamId,
  };
  saveCallSession(session);
  return session;
}