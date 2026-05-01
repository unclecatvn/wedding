import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminCookieName = "wedding_admin_session";

const sessionValue = "admin";

function getSecret() {
  return process.env.ADMIN_PASSWORD || "";
}

function sign(value: string) {
  const secret = getSecret();

  if (!secret) {
    return "";
  }

  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createAdminToken() {
  return `${sessionValue}.${sign(sessionValue)}`;
}

export function isValidAdminToken(token?: string) {
  const secret = getSecret();

  if (!secret || !token) {
    return false;
  }

  const [value, signature] = token.split(".");
  const expected = sign(value || "");

  if (value !== sessionValue || !signature || !expected) {
    return false;
  }

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return (
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer)
  );
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return isValidAdminToken(cookieStore.get(adminCookieName)?.value);
}

export function isCorrectAdminPassword(password: string) {
  const secret = getSecret();

  if (!secret) {
    return false;
  }

  const inputBuffer = Buffer.from(password);
  const secretBuffer = Buffer.from(secret);

  return (
    inputBuffer.length === secretBuffer.length &&
    timingSafeEqual(inputBuffer, secretBuffer)
  );
}
