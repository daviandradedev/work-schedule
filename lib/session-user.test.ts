import { describe, expect, it } from "vitest";
import { UnauthorizedError, isUnauthorizedError } from "@/lib/session-user";

describe("session user", () => {
  it("treats a missing session as unauthorized", () => {
    expect(isUnauthorizedError(new UnauthorizedError())).toBe(true);
    expect(isUnauthorizedError(new Error("Request failed"))).toBe(false);
  });
});
