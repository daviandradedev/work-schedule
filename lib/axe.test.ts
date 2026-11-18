import { describe, expect, it } from "vitest";
import { axeViolations } from "@/lib/axe";

describe("axeViolations", () => {
  it("reports no violations for a labeled control", async () => {
    document.body.innerHTML = `
      <main id="main-content">
        <h1>Schedule</h1>
        <label for="month">Month</label>
        <input id="month" name="month" />
        <button type="button">Generate</button>
      </main>
    `;
    expect(await axeViolations(document.body)).toEqual([]);
  });
});
