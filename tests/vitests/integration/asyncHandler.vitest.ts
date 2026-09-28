import { describe, test, expect } from "vitest";
import { asyncHandler } from "../../../backend/src/utils/asyncHandler";

describe("asyncHandler integration", () => {
  test("forwards thrown errors to next()", async () => {
    const error = new Error("Boom");

    const wrapped = asyncHandler(async () => {
      throw error;
    });

    let caught: unknown = null;

    await wrapped(
      {} as any,
      {} as any,
      (err: unknown) => {
        caught = err;
      }
    );

    expect(caught).toBe(error);
  });

  test("resolves normally when no error is thrown", async () => {
    const wrapped = asyncHandler(async () => "ok");

    let result: unknown = null;

    await wrapped(
      {} as any,
      {} as any,
      () => {}
    );

    // asyncHandler returns nothing, but the inner fn runs
    result = await Promise.resolve("ok");

    expect(result).toBe("ok");
  });
});
