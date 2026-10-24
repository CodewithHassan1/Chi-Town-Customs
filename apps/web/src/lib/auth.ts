import * as crypto from "crypto";

const SALT = "chitown_salt_2026";

export function hashPassword(password: string): string {
  return crypto.scryptSync(password, SALT, 64).toString("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  const calculated = hashPassword(password);
  return crypto.timingSafeEqual(Buffer.from(calculated), Buffer.from(hash));
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function signToken(user: UserSession): string {
  const payload = JSON.stringify({ ...user, iat: Date.now() });
  const hmac = crypto.createHmac("sha256", process.env.SESSION_SECRET || "chitown_secret_key");
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return Buffer.from(payload).toString("base64") + "." + signature;
}

export function verifyToken(token: string): UserSession | null {
  try {
    const [payloadBase64, signature] = token.split(".");
    if (!payloadBase64 || !signature) return null;

    const payload = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const hmac = crypto.createHmac("sha256", process.env.SESSION_SECRET || "chitown_secret_key");
    hmac.update(payload);
    const expectedSignature = hmac.digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    return JSON.parse(payload) as UserSession;
  } catch {
    return null;
  }
}
