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

export async function getSessionFromRequest(request?: Request): Promise<UserSession | null> {
  let token: string | undefined;

  // 1. Try Next.js next/headers cookies() store
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    token = cookieStore.get("chitown_session")?.value;
  } catch {
    // Expected when called outside Next.js request context
  }

  // 2. Try NextRequest cookie API
  if (!token && request && (request as any).cookies?.get) {
    token = (request as any).cookies.get("chitown_session")?.value;
  }

  // 3. Try raw cookie header string with decodeURIComponent
  if (!token && request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/chitown_session=([^;]+)/);
    if (match && match[1]) {
      token = decodeURIComponent(match[1].trim());
    }
  }

  // 4. Try Bearer token in authorization header
  if (!token && request) {
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdminSession(
  request?: Request,
  allowedRoles: string[] = ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER", "STAFF"]
): Promise<UserSession> {
  const session = await getSessionFromRequest(request);
  if (!session) {
    throw new Error("UNAUTHORIZED: Authentication session required");
  }
  if (!allowedRoles.includes(session.role)) {
    throw new Error(`FORBIDDEN: Role '${session.role}' is not authorized for this action`);
  }
  return session;
}

