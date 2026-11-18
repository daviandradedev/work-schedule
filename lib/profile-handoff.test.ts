import { describe, expect, it } from "vitest";
import { hubAccountHandoffUrl, safeNextPath } from "@/lib/profile-handoff";

describe("profile handoff", () => {
  it("sends the one-time token to the hub account bootstrap", () => {
    const target = hubAccountHandoffUrl("https://auth.daviandrade.dev/", "token-1");

    expect(target.origin).toBe("https://auth.daviandrade.dev");
    expect(target.pathname).toBe("/api/auth/bootstrap");
    expect(target.searchParams.get("ott")).toBe("token-1");
    expect(target.searchParams.get("next")).toBe("/account");
  });

  it("only returns to local paths after sign-in", () => {
    expect(safeNextPath("/schedule")).toBe("/schedule");
    expect(safeNextPath(null)).toBe("/");
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath("//evil.example")).toBe("/");
  });
});
