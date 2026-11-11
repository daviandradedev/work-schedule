import { afterEach, describe, expect, it, vi } from "vitest";
import { saveWasRejected } from "@/lib/login-redirect";

describe("saveWasRejected", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends a rejected save to the auth hub", () => {
    const assign = vi.fn();
    vi.stubGlobal("window", {
      location: {
        hostname: "localhost",
        href: "http://localhost:3000/",
        assign,
      },
    });
    vi.stubEnv("NEXT_PUBLIC_AUTH_URL", "http://localhost:3100");

    const rejected = saveWasRejected(new Response(null, { status: 401 }));

    expect(rejected).toBe(true);
    expect(assign).toHaveBeenCalledWith(
      "http://localhost:3100/?callbackURL=http%3A%2F%2Flocalhost%3A3000%2F",
    );
  });

  it("leaves other responses on this site", () => {
    expect(saveWasRejected(new Response(null, { status: 500 }))).toBe(false);
  });
});
