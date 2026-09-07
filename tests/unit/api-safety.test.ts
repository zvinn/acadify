import assert from "node:assert/strict";
import test from "node:test";

import { isNoOffersAvailableError } from "../../lib/api/offer-availability.ts";
import { normalizeApiErrorMessage, sanitizeApiPayload } from "../../lib/api/safety.ts";

test("sanitizeApiPayload removes sensitive fields recursively", () => {
  const payload = {
    data: [{ id: "1", password: "hash", nested: { resetPasswordToken: "secret", name: "Student" } }],
  };
  assert.deepEqual(sanitizeApiPayload(payload), {
    data: [{ id: "1", nested: { name: "Student" } }],
  });
});

test("sanitizeApiPayload normalizes localhost asset URLs centrally", () => {
  assert.deepEqual(
    sanitizeApiPayload({ avatar: "http://localhost:8000/uploads/avatar.png" }, "https://api.example.com/"),
    { avatar: "https://api.example.com/uploads/avatar.png" },
  );
});

test("normalizeApiErrorMessage returns a useful message or safe fallback", () => {
  assert.equal(normalizeApiErrorMessage({ message: " Invalid code " }, "Try again"), "Invalid code");
  assert.equal(normalizeApiErrorMessage({ detail: "stack trace" }, "Try again"), "Try again");
  assert.equal(normalizeApiErrorMessage(null, "Try again"), "Try again");
});

test("isNoOffersAvailableError recognizes the backend empty-offers response", () => {
  assert.equal(
    isNoOffersAvailableError({ status: 400, message: "cant find offer for this user" }),
    true,
  );
  assert.equal(
    isNoOffersAvailableError({ status: 404, message: "No offers found" }),
    true,
  );
  assert.equal(
    isNoOffersAvailableError({ status: 400, message: "Request validation failed" }),
    false,
  );
  assert.equal(
    isNoOffersAvailableError({ status: 500, message: "cant find offer for this user" }),
    false,
  );
});
