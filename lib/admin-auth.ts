/**
 * Admin gate for the private talent pool (HTTP Basic auth).
 *
 * Set ADMIN_PASSWORD in the environment (any username works). In production the
 * gate fails closed when ADMIN_PASSWORD is missing; in local development it is
 * open so the tool works out of the box.
 */

export const ADMIN_REALM = 'Basic realm="care3r admin", charset="UTF-8"';

function safeEqual(a: string, b: string) {
  // Constant-time comparison (works in any runtime).
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function isAdminAuthorization(authorization: string | null | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return process.env.NODE_ENV !== "production";
  if (!authorization?.startsWith("Basic ")) return false;
  try {
    const decoded = atob(authorization.slice(6));
    const supplied = decoded.slice(decoded.indexOf(":") + 1);
    return safeEqual(supplied, password);
  } catch {
    return false;
  }
}

/** For Server Components: true when the current request carries valid admin credentials. */
export async function isAdminRequest(): Promise<boolean> {
  const { headers } = await import("next/headers");
  return isAdminAuthorization((await headers()).get("authorization"));
}

/** For Route Handlers. Returns a 401 Response when not authorized, otherwise null. */
export function adminGuard(req: Request): Response | null {
  if (isAdminAuthorization(req.headers.get("authorization"))) return null;
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json", "WWW-Authenticate": ADMIN_REALM },
  });
}
