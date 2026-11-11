import { createAuthClient } from "better-auth/react";
import { clientAppBaseUrl } from "@/lib/auth-public";

export const authClient = createAuthClient({
  baseURL: clientAppBaseUrl(),
});

export { redirectToAuthLogin, saveWasRejected } from "@/lib/login-redirect";
