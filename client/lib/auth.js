import { useSyncExternalStore } from "react";

const AUTH_TOKEN_KEY = "authToken";
const AUTH_ROLE_KEY = "authRole";
const AUTH_CHANGE_EVENT = "calmspace-auth-change";

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function roleFromToken(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))).role ?? null;
  } catch {
    return null;
  }
}

export function saveAuthSession(token, role) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);

  if (role) {
    localStorage.setItem(AUTH_ROLE_KEY, role);
  }

  notifyAuthChange();
}

export function getAuthRole() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  return localStorage.getItem(AUTH_ROLE_KEY) ?? roleFromToken(token);
}

export function isAuthenticatedClient() {
  return getAuthRole() === "patient";
}

export function isAuthenticatedTherapist() {
  return getAuthRole() === "therapist";
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
  notifyAuthChange();
}

function subscribeToAuthChange(callback) {
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useIsAuthenticatedClient() {
  return useSyncExternalStore(
    subscribeToAuthChange,
    isAuthenticatedClient,
    () => false,
  );
}

export function useIsAuthenticatedTherapist() {
  return useSyncExternalStore(
    subscribeToAuthChange,
    isAuthenticatedTherapist,
    () => false,
  );
}
