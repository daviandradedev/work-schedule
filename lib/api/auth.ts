import { auth } from "@/lib/auth";

export async function getCurrentUser(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
    query: { disableRefresh: true },
  });

  return session?.user ?? null;
}
