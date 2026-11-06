import { createAuthClient } from "better-auth/react";
import { authHubUrlForHost, clientAppBaseUrl } from "@/lib/auth-public";

export const authClient = createAuthClient({
  baseURL: clientAppBaseUrl(),
});

export function redirectToAuthLogin() {
  if (typeof window === "undefined") return;
  const login = new URL(authHubUrlForHost(window.location.hostname));
  login.searchParams.set("callbackURL", window.location.href);
  window.location.assign(login.toString());
}
