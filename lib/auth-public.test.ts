import { afterEach, describe, expect, it, vi } from "vitest";
import { appBaseUrlForHost, authHubUrlForHost } from "@/lib/auth-public";

describe("public urls", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps localhost targets on a local host", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
    vi.stubEnv("NEXT_PUBLIC_AUTH_URL", "http://localhost:3100");

    expect(appBaseUrlForHost("localhost")).toBe("http://localhost:3000");
    expect(authHubUrlForHost("localhost")).toBe("http://localhost:3100");
  });

  it("ignores a localhost url when the site is the production host", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
    vi.stubEnv("NEXT_PUBLIC_AUTH_URL", "http://localhost:3100");

    expect(appBaseUrlForHost("workschedule-dd.vercel.app")).toBe("https://workschedule-dd.vercel.app");
    expect(authHubUrlForHost("workschedule-dd.vercel.app")).toBe("https://auth.daviandrade.dev");
  });

  it("uses the production urls on Vercel when the public urls are missing", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    vi.stubEnv("NEXT_PUBLIC_AUTH_URL", "");
    vi.stubEnv("VERCEL_ENV", "production");

    expect(appBaseUrlForHost(null)).toBe("https://workschedule-dd.vercel.app");
    expect(authHubUrlForHost(null)).toBe("https://auth.daviandrade.dev");
  });
});
